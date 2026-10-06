import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  Phone,
  Building2,
  BadgeCheck,
  Lock,
  KeyRound,
  CheckCircle2,
  Calendar,
  AlertCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';

export const AdminProfilePage: React.FC = () => {
  const { currentUser, activeRole } = useAuth();

  // Change password modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const getDepartmentLabel = () => {
    if (activeRole === 'finance_admin') return 'Finance';
    if (activeRole === 'academic_admin') return 'Academic';
    return 'IT';
  };

  const getRoleLabel = () => {
    if (activeRole === 'finance_admin') return 'Finance Administrator';
    if (activeRole === 'academic_admin') return 'Academic Administrator';
    return 'IT Administrator';
  };

  const employeeId =
    currentUser?.employeeId ||
    (activeRole === 'finance_admin'
      ? 'ADM-FIN-002'
      : activeRole === 'academic_admin'
      ? 'ADM-ACAD-003'
      : 'ADM-IT-001');

  const phone = currentUser?.phone || '+91 98765 88990';

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPasswordStatusMsg({ type: 'error', text: 'All password fields are required.' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordStatusMsg({
        type: 'error',
        text: 'New password must be at least 8 characters long.',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatusMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordStatusMsg({
      type: 'success',
      text: 'Institutional SSO password updated successfully.',
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setIsPasswordModalOpen(false);
      setPasswordStatusMsg(null);
    }, 1800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-[#E2ECE7] bg-white flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xs">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0D5C46] to-[#0F766E] flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0">
          <ShieldCheck className="w-10 h-10" />
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#0D3B2E]">
              {currentUser?.name || 'Administrator'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {getRoleLabel()}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5 text-xs text-slate-500 font-mono">
            <span>Employee ID: <strong className="text-slate-800">{employeeId}</strong></span>
            <span>·</span>
            <span>Department: <strong className="text-slate-800">{getDepartmentLabel()}</strong></span>
          </div>

          <p className="text-xs text-slate-600 mt-2 font-medium">
            {currentUser?.department || 'University Operational Administration'}
          </p>
        </div>

        <div className="self-center sm:self-start bg-[#FAFBFB] px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 font-mono flex items-center gap-1.5">
          <BadgeCheck className="w-4 h-4 text-emerald-700" />
          <span>Verified Staff Token</span>
        </div>
      </div>

      {/* Grid: Personal Information & Department Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="glass-panel rounded-2xl p-6 border border-[#E2ECE7] bg-white shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
            <BadgeCheck className="w-4 h-4 text-[#0D5C46]" />
            <h3 className="text-sm font-semibold text-slate-900">Personal Information</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Full Name</span>
              <span className="text-slate-800 font-semibold text-sm">
                {currentUser?.name || 'Administrator'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Employee Identifier</span>
              <span className="text-slate-800 font-mono font-semibold">{employeeId}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Official College Email</span>
              <span className="text-slate-800 font-mono flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {currentUser?.email || 'admin@university.edu'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Direct Phone Line</span>
              <span className="text-slate-800 font-mono flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {phone}
              </span>
            </div>
          </div>
        </div>

        {/* Department Information */}
        <div className="glass-panel rounded-2xl p-6 border border-[#E2ECE7] bg-white shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
            <Building2 className="w-4 h-4 text-[#0D5C46]" />
            <h3 className="text-sm font-semibold text-slate-900">Department Information</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Assigned Department</span>
              <span className="text-slate-800 font-semibold text-sm">{getDepartmentLabel()}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Administrative Role</span>
              <span className="text-slate-800 font-medium">{getRoleLabel()}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Department Unit</span>
              <span className="text-slate-800">{currentUser?.department}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Security Access Scope</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-medium text-[11px] mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{getDepartmentLabel()} Queue & Student Directory Operations</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Security & Password Management (No raw passwords displayed) */}
      <div className="glass-panel rounded-2xl p-6 border border-[#E2ECE7] bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Lock className="w-4 h-4 text-[#0D5C46]" />
            <span>Institutional Credential Security</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Raw passwords are cryptographically shielded under University LDAP / SSO protocols and are never visible. You can update your authentication token using the secure password rotation procedure.
          </p>
        </div>

        <button
          onClick={() => {
            setPasswordStatusMsg(null);
            setIsPasswordModalOpen(true);
          }}
          className="self-start sm:self-auto px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <KeyRound className="w-3.5 h-3.5 text-slate-500" />
          <span>Change Password</span>
        </button>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <Modal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          title="Change Administrator Password"
          subtitle={`Account: ${currentUser?.email} (${getRoleLabel()})`}
          maxWidth="md"
        >
          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            {passwordStatusMsg && (
              <div
                className={`p-3 rounded-xl border flex items-center gap-2 ${
                  passwordStatusMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {passwordStatusMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                )}
                <span>{passwordStatusMsg.text}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0D5C46]"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0D5C46] hover:bg-[#0B4A38] text-white font-semibold rounded-lg cursor-pointer shadow-xs"
              >
                Update Password
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
