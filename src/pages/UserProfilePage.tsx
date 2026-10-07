import React, { useState } from 'react';
import { useAuth } from '../services/authContext';
import { useToast } from '../components/Toast';
import { Mail, Save, User as UserIcon, CheckCircle2 } from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [favoriteGenre, setFavoriteGenre] = useState(currentUser?.favoriteGenre || 'Computer Science');

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-sm text-stone-500">Please log in to view your patron dossier.</p>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast('Name cannot be empty', 'error');
      return;
    }

    updateProfile({
      name: name.trim(),
      bio: bio.trim(),
      favoriteGenre: favoriteGenre.trim(),
    });

    toast('Patron profile updated successfully!', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      <div className="border-b border-stone-200/80 pb-6">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">
          PATRON DIRECTORY
        </span>
        <h1 className="font-serif-display text-3xl font-bold text-stone-900 mt-0.5">
          Patron Account Dossier
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Manage your reader identity, scholarly interests, and reading preferences.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-10">
        {/* Profile Card Header */}
        <div className="flex items-center gap-5 pb-7 border-b border-stone-100">
          <div className="w-16 h-16 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-bold text-2xl shadow-xs font-serif-display">
            {name.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="font-serif-display text-xl font-bold text-stone-900">{name}</h3>
            <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5 font-mono">
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              <span>{currentUser.email}</span>
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-mono">
                ROLE: {currentUser.role}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Active Patron
              </span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="mt-7 space-y-5">
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1.5">
              FULL NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-2.5 px-3.5 text-xs bg-stone-50 border border-stone-200/90 rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 transition-all font-semibold text-stone-900"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1.5">
              REGISTERED EMAIL IDENTIFIER
            </label>
            <input
              type="email"
              disabled
              value={currentUser.email}
              className="w-full py-2.5 px-3.5 text-xs bg-stone-100 text-stone-500 border border-stone-200 rounded-xl cursor-not-allowed font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1.5">
              PRIMARY FIELD OF SCHOLARLY FOCUS
            </label>
            <input
              type="text"
              value={favoriteGenre}
              onChange={(e) => setFavoriteGenre(e.target.value)}
              placeholder="e.g. Distributed Computing, Stoic Philosophy"
              className="w-full py-2.5 px-3.5 text-xs bg-stone-50 border border-stone-200/90 rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 transition-all font-semibold text-stone-900"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1.5">
              SCHOLARLY BIOGRAPHY & RESEARCH INTERESTS
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your current studies, reading clubs, or research focus..."
              className="w-full py-2.5 px-3.5 text-xs bg-stone-50 border border-stone-200/90 rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 transition-all font-medium text-stone-900 leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-400 font-mono">
              Member since {new Date(currentUser.createdAt).toLocaleDateString()}
            </span>
            <button
              type="submit"
              className="py-2.5 px-5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all shadow-xs hover:shadow-md flex items-center gap-2 active:scale-[0.98]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Patron Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
