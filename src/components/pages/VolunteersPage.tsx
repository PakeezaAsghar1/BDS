import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UET_CAMPUSES } from '../../types';
import {
  Users,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Activity,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VolunteersPage: React.FC = () => {
  const { applyAsVolunteer, navigate } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [campus, setCampus] = useState(UET_CAMPUSES[0]);
  const [department, setDepartment] = useState('Computer Science');
  const [batch, setBatch] = useState('2024');
  const [preferredRole, setPreferredRole] = useState('Emergency Dispatch & Hospital Liaison');
  const [statement, setStatement] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Communication', 'First Aid']);
  const [submitted, setSubmitted] = useState(false);

  const roles = [
    {
      title: 'Blood Drive Management',
      desc: 'Supervise donor registration desks, logistics, medical flow, and refreshment arrangements on campus camps.',
    },
    {
      title: 'Emergency Dispatch & Hospital Liaison',
      desc: 'Coordinate urgent midnight cases, hospital cross-matching, and donor transportation support in Narowal.',
    },
    {
      title: 'Awareness & Community Outreach',
      desc: 'Conduct seminar booths, class-to-class announcements, and educational workshops debunking blood myths.',
    },
    {
      title: 'Creative, Media & Photography',
      desc: 'Produce high-impact graphic design posters, video coverage, social campaigns, and documentary media.',
    },
    {
      title: 'Technical & Platform Operations',
      desc: 'Maintain BDS web infrastructure, SMS/WhatsApp broadcast bots, database security, and user features.',
    },
  ];

  const skillOptions = [
    'Emergency Coordination',
    'Hospital Liaison',
    'Graphic Design',
    'Social Media',
    'Web Development',
    'First Aid',
    'Event Logistics',
    'Public Speaking',
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await applyAsVolunteer({
      name,
      email,
      phone,
      campus,
      department,
      batch,
      preferredRole,
      statement,
      skills: selectedSkills,
    });

    setSubmitted(true);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="py-12 bg-[#FAF9F7] min-h-screen" id="volunteers-page">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/80 text-[#8F1D25] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join BDS UET Narowal Volunteer Team</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Become a BDS UET Narowal Volunteer
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Lead humanitarian campaigns, manage emergency cases, and serve the community alongside passionate student
            leaders across UET Narowal departments.
          </p>
        </div>

        {/* Roles Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {roles.map((r, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#B4232C] flex items-center justify-center font-bold mb-3">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{r.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{r.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-[#B4232C] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Certificate & Leadership Credit</span>
              </div>
            </div>
          ))}
        </div>

        {/* Application Form */}
        {!submitted ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm max-w-3xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Volunteer Application Form</h2>
              <p className="text-xs text-slate-500 mt-1">
                Open to all students and faculty enrolled at UET Narowal Campus.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" id="volunteer-application-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Rehan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    WhatsApp / Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0300-1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rehan@student.uet.edu.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Campus <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] bg-white font-medium"
                  >
                    {UET_CAMPUSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science / Mechanical"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Batch / Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024 (1st Year)"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Preferred Department / Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={preferredRole}
                  onChange={(e) => setPreferredRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] bg-white font-semibold"
                >
                  {roles.map((r) => (
                    <option key={r.title} value={r.title}>
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Skills selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Select Your Skills & Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((s) => {
                    const isSelected = selectedSkills.includes(s);
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => toggleSkill(s)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? 'bg-[#B4232C] text-white border-[#8F1D25] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Why do you want to join BDS UET?
                </label>
                <textarea
                  rows={3}
                  placeholder="Share a brief statement about your motivation..."
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#B4232C] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#B4232C] hover:bg-[#8F1D25] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-xs active:scale-98"
                id="submit-volunteer-app-btn"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Submit Volunteer Application</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-md text-center max-w-xl mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Application Received!</h2>
            <p className="text-sm text-slate-600">
              Thank you for stepping up to serve. Our executive team will review your application and contact you for the
              orientation session.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#B4232C] hover:underline"
            >
              <span>Submit another application</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
