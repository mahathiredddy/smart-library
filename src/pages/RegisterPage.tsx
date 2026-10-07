import React, { useState } from 'react';
import { useAuth } from '../services/authContext';
import { useToast } from '../components/Toast';
import { BookOpen, User, Mail, Lock, BookMarked, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface RegisterPageProps {
  onSuccess: () => void;
  onNavigateToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onSuccess,
  onNavigateToLogin,
}) => {
  const { register } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [favoriteGenre, setFavoriteGenre] = useState('Computer Science');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 4) {
      setError('Password must contain at least 4 characters.');
      return;
    }

    setLoading(true);
    const res = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      favoriteGenre,
    });
    setLoading(false);

    if (res.success) {
      toast('Registration successful! Welcome to E-Book Library.', 'success');
      onSuccess();
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden library-card">
        {/* Header */}
        <div className="p-7 pb-5 bg-gradient-to-b from-[#f7f5ef] to-white border-b border-stone-100 text-center">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 text-amber-200 flex items-center justify-center mx-auto mb-3 font-serif-display font-bold shadow-xs">
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
            PATRON ENROLLMENT
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
            Create Reader Account
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
            Enroll in the academic digital repository to save favorites and track your progress.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-7 sm:p-8 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1.5">
                FULL NAME *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Clara Oswald"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200/90 rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 transition-all font-medium text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1.5">
                EMAIL ADDRESS *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="clara.oswald@university.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200/90 rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 transition-all font-medium text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1.5">
                PASSWORD *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 4 characters"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-stone-50 border border-stone-200/90 rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 transition-all font-medium text-stone-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-stone-400 hover:text-stone-700"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1.5">
                PRIMARY RESEARCH DISCIPLINE
              </label>
              <div className="relative">
                <BookMarked className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                <select
                  value={favoriteGenre}
                  onChange={(e) => setFavoriteGenre(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200/90 rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 font-medium text-stone-900"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Classic Literature">Classic Literature</option>
                  <option value="Philosophy">Philosophy</option>
                  <option value="Architecture & Design">Architecture & Design</option>
                  <option value="Science & Astronomy">Science & Astronomy</option>
                  <option value="Business & Economics">Business & Economics</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 transition-all shadow-xs hover:shadow-md mt-4 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Reader Enrollment'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center pt-2 border-t border-stone-100">
            <p className="text-xs text-stone-500">
              Already enrolled in the repository?{' '}
              <button
                onClick={onNavigateToLogin}
                className="text-stone-950 font-bold hover:underline"
              >
                Sign In to Existing Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
