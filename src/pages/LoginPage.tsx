import React, { useState } from 'react';
import { useAuth } from '../services/authContext';
import { useToast } from '../components/Toast';
import { BookOpen, Shield, User as UserIcon, Lock, Mail, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onSuccess: (role?: 'user' | 'admin') => void;
  onNavigateToRegister: () => void;
  defaultAdminTab?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateToRegister,
  defaultAdminTab = false,
}) => {
  const { login, quickDemoLogin } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'reader' | 'admin'>(
    defaultAdminTab ? 'admin' : 'reader'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTabChange = (tab: 'reader' | 'admin') => {
    setActiveTab(tab);
    setError('');
    if (tab === 'admin') {
      setEmail('admin@ebooklibrary.org');
      setPassword('admin123');
    } else {
      setEmail('sarah.chen@university.edu');
      setPassword('user123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please provide your account email.');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      toast('Signed in successfully.', 'success');
      onSuccess(res.user?.role || (activeTab === 'admin' ? 'admin' : 'user'));
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickDemo = (role: 'user' | 'admin') => {
    quickDemoLogin(role);
    toast(
      role === 'admin'
        ? 'Signed in as Administrator Elena Vance'
        : 'Signed in as Reader Sarah Chen',
      'success'
    );
    onSuccess(role);
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden library-card">
        {/* Header */}
        <div className="p-7 pb-5 bg-gradient-to-b from-[#f7f5ef] to-white border-b border-stone-100 text-center">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 text-amber-200 flex items-center justify-center mx-auto mb-3.5 font-serif-display font-bold shadow-xs">
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
            INSTITUTIONAL ACCESS
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
            Sign In to E-Book Library
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
            Access your scholarly bookshelf or the administrative catalog console.
          </p>

          {/* Segmented control for Reader vs Admin */}
          <div className="flex p-1 bg-stone-200/80 rounded-2xl mt-6">
            <button
              type="button"
              onClick={() => handleTabChange('reader')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'reader'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Reader Account</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Curator / Admin</span>
            </button>
          </div>
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
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    activeTab === 'admin'
                      ? 'admin@ebooklibrary.org'
                      : 'sarah.chen@university.edu'
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200/90 rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 transition-all font-medium text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono block mb-1.5">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 transition-all shadow-xs hover:shadow-md mt-2 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick 1-Click Demo Evaluation Buttons */}
          <div className="pt-5 border-t border-stone-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 text-center mb-3 font-mono">
              INSTANT 1-CLICK DEMO ACCESS
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-2.5 px-3 text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/90 rounded-xl transition-all text-center active:scale-[0.98]"
              >
                Demo as Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('user')}
                className="py-2.5 px-3 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-xl transition-all text-center active:scale-[0.98]"
              >
                Demo as Reader
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-stone-500">
              Need a reader membership?{' '}
              <button
                onClick={onNavigateToRegister}
                className="text-stone-950 font-bold hover:underline"
              >
                Register as New Reader
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
