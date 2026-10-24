import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10) || 3000;

app.use(express.json());

// Initialize Gemini client with user-agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoints for Google Cloud Run / App Engine probes
app.get(['/healthz', '/_ah/health', '/health'], (_req, res) => {
  res.status(200).send('OK');
});

// Chatbot API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, message } = req.body;
    const userPrompt = message || (Array.isArray(messages) && messages[messages.length - 1]?.content);

    if (!userPrompt) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const contents = [];
    if (Array.isArray(messages) && messages.length > 0) {
      for (const m of messages) {
        contents.push({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(m.content) }],
        });
      }
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: String(userPrompt) }],
      });
    }

    const systemInstruction = `You are "BDS AI Assistant", the official digital guide for the Blood Donor Society (BDS) at UET Narowal.
You provide accurate, compassionate, and helpful information about:
- Blood donation criteria: Age 18-60, weight >= 50 kg, min 90 days between donations, hemoglobin >= 12.5 g/dL, normal blood pressure, good health.
- Blood compatibility: O- is universal whole blood donor, AB+ is universal recipient, Rh positive/negative rules.
- Thalassemia support in Narowal: Routine transfusion requirements for children, free screening camps, importance of pre-marital thalassemia minor testing.
- BDS UET Narowal activities: Campus blood drives in Main Auditorium, volunteer wings, emergency cold-chain delivery to DHQ Hospital Narowal.
- Preparation & aftercare: Rest well, drink plenty of water, have an iron-rich meal 2-3 hours prior, rest 10-15 mins after donation, drink juice.
- Language: English & Urdu (or Roman Urdu) friendly.
- Medical disclaimer: For urgent life-threatening emergencies, advise calling Rescue 1122 or visiting DHQ Narowal emergency immediately.`;

    let reply = '';
    if (process.env.GEMINI_API_KEY) {
      const callPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 4000)
      );

      const response: any = await Promise.race([callPromise, timeoutPromise]);
      reply = response?.text || '';
    }

    if (!reply) {
      throw new Error('Fallback needed');
    }

    return res.json({ reply });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    // Helpful fallback answer if GEMINI_API_KEY is not set or network fails
    const userText = String(req.body?.message || (Array.isArray(req.body?.messages) && req.body.messages[req.body.messages.length - 1]?.content) || '').toLowerCase();
    let fallbackReply = 'Assalam-o-Alaikum! Welcome to Blood Donor Society (BDS) UET Narowal. ';
    if (userText.includes('donate') || userText.includes('eligible') || userText.includes('requirement')) {
      fallbackReply += 'To donate blood, you should be between 18-60 years old, weigh at least 50 kg, have a hemoglobin level above 12.5 g/dL, and have rested at least 90 days since your last donation.';
    } else if (userText.includes('emergency') || userText.includes('urgent') || userText.includes('need blood')) {
      fallbackReply += 'For urgent blood requests in Narowal, please submit an Emergency Request from the navigation menu or call our 24/7 volunteer hotline at +92 300 1234567. In life-threatening situations, please dial Rescue 1122.';
    } else if (userText.includes('camp') || userText.includes('event')) {
      fallbackReply += 'Our next Mega Blood Drive is held at the Main Auditorium, UET Narowal Campus. Everyone is welcome to donate and help save lives of thalassemic children.';
    } else if (userText.includes('compatibility') || userText.includes('type') || userText.includes('group')) {
      fallbackReply += 'O-negative (O-) is the universal donor for whole red blood cells, while AB-positive (AB+) is the universal recipient. Always ensure Rh compatibility before transfusion.';
    } else {
      fallbackReply += 'I can help you with blood donation eligibility, urgent blood requests in Narowal, blood group compatibility, and BDS campus activities. How may I help you?';
    }
    return res.json({ reply: fallbackReply });
  }
});

// Setup Vite middleware in dev or static files in production
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = fs.existsSync(path.resolve(process.cwd(), 'dist'))
    ? path.resolve(process.cwd(), 'dist')
    : path.join(__dirname, 'dist');

  app.use(express.static(distPath));

  app.get('*', (_req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(200).send('Application is ready.');
    }
  });
}

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on 0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    process.exit(0);
  });
});
