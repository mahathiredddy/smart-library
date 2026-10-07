import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { storage } from '../../services/storage';
import { useToast } from '../../components/Toast';
import { Shield, Mail, Key, RotateCcw, Check, Save } from 'lucide-react';
import { Modal } from '../../components/Modal';

interface AdminProfilePageProps {
  onDataReset: () => void;
}

export const AdminProfilePage: React.FC<AdminProfilePageProps> = ({ onDataReset }) => {
  const { currentUser, updateProfile } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(currentUser?.name || 'Administrator Elena Vance');
  const [bio, setBio] = useState(
    currentUser?.bio ||
      'Lead Systems Librarian & Archival Curator overseeing digital collections.'
  );
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast('Name cannot be empty', 'error');
      return;
    }
    updateProfile({ name: name.trim(), bio: bio.trim() });
    toast('Admin profile updated.', 'success');
  };

  const handleResetData = () => {
    storage.resetToDefaults();
    setResetModalOpen(false);
    toast('Demo database reset to initial seeds.', 'info');
    onDataReset();
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-200">
      <div className="pb-3 border-b border-stone-200/80">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
          SYSTEM CURATOR
        </span>
        <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
          Librarian & Admin Profile
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          System administrator credentials and archival curation identity.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-xs library-card">
        <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
          <div className="w-14 h-14 rounded-2xl bg-amber-900 text-amber-200 flex items-center justify-center font-bold text-xl shadow-xs">
            <Shield className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <h3 className="font-serif-display text-xl font-bold text-stone-900">{name}</h3>
            <p className="text-xs text-stone-500 font-mono mt-0.5">{currentUser?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 font-mono">
                Lead System Curator & Administrator
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1.5">
              ADMINISTRATOR NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-2.5 px-3.5 text-xs bg-stone-50 border border-stone-200/90 rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 font-semibold text-stone-900"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1.5">
              REGISTERED CURATOR EMAIL
            </label>
            <input
              type="email"
              disabled
              value={currentUser?.email || 'admin@ebooklibrary.org'}
              className="w-full py-2.5 px-3.5 text-xs bg-stone-100 text-stone-500 border border-stone-200 rounded-xl cursor-not-allowed font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1.5">
              ARCHIVAL ROLE & CURATOR DOSSIER
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full py-2.5 px-3.5 text-xs bg-stone-50 border border-stone-200/90 rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 leading-relaxed font-medium"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 transition-all shadow-xs flex items-center gap-2 active:scale-[0.98]"
            >
              <Save className="w-3.5 h-3.5 text-amber-300" />
              <span>Save Admin Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Database Maintenance Operations Card */}
      <div className="bg-amber-50/70 rounded-2xl border border-amber-200/80 p-6 space-y-3">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-amber-800" />
          <h4 className="text-sm font-bold text-amber-950 font-serif-display">
            Repository Database Management & Reset
          </h4>
        </div>
        <p className="text-xs text-amber-900/80 leading-relaxed">
          Restore the library repository, sample volumes, disciplines, and patron accounts to default initial seed records.
        </p>
        <button
          onClick={() => setResetModalOpen(true)}
          className="py-2 px-3.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200/90 border border-amber-300 transition-all"
        >
          Reset Database to Seed State
        </button>
      </div>

      {/* Confirmation Modal */}
      {resetModalOpen && (
        <Modal
          isOpen={resetModalOpen}
          onClose={() => setResetModalOpen(false)}
          title="Reset Catalog Database"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-stone-600 leading-relaxed">
              This operation will restore all cataloged books, disciplines, patron accounts, and reading progress back to the pristine default library dataset.
            </p>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setResetModalOpen(false)}
                className="py-2 px-3.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="py-2 px-4 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
