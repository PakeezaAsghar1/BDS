import React from 'react';
import { TeamDashboard } from './TeamDashboard';

/**
 * AdminConsole / Admin Dashboard
 * Uses the unified, responsive BDS Portal layout identical to TeamDashboard,
 * configured with full Administrator oversight, BDS Administrator green badge,
 * and executive administration privileges.
 */
export const AdminConsole: React.FC = () => {
  return <TeamDashboard isAdmin={true} />;
};

export default AdminConsole;
