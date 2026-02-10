import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, Mail, Lock, Eye, EyeOff, CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

type AuthStep = 'login' | 'signup-email' | 'signup-verify' | 'signup-password';

export default function Auth() {
  const { user, loading } = useAuth();
  const [step, setStep] = useState<AuthStep>('login');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/notes" replace />;
  }

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const clearError = () => setError('');

  // Step 1: Send OTP code to email
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithOtp({ 
      email,
      options: {
        shouldCreateUser: true,
      }
    });
    setSubmitting(false);

    if (error) {
      setError(error.message);
    } else {
      setStep('signup-verify');
    }
  };

  // Step 2: Verify OTP code (8 digits)
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (otpCode.length !== 8) {
      setError('Please enter the 8-digit code');
      return;
    }

    setSubmitting(true);
    
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: 'email',
    });
    
    setSubmitting(false);

    if (error) {
      setError('Invalid or expired code. Please try again.');
    } else {
      setStep('signup-password');
    }
  };

  // Step 3: Set password
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setError(error.message);
    }
    // User is already authenticated after verifyOtp + updateUser, 
    // the auth state listener will redirect to /notes
  };

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please verify your email first');
      } else {
        setError(error.message);
      }
    }
  };

  const resetToLogin = () => {
    setStep('login');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOtpCode('');
    clearError();
  };

  const resetToSignup = () => {
    setStep('signup-email');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOtpCode('');
    clearError();
  };

  const renderOtpInput = () => (
    <div className="flex justify-center gap-2">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otpCode[i] || ''}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '');
            const newCode = otpCode.split('');
            newCode[i] = val;
            setOtpCode(newCode.join(''));
            if (val && i < 7) {
              document.getElementById(`otp-${i + 1}`)?.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !otpCode[i] && i > 0) {
              document.getElementById(`otp-${i - 1}`)?.focus();
            }
          }}
          className="w-11 h-14 text-center text-xl font-bold rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-glow mb-4">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-2">NoteMark</h1>
          <p className="text-muted-foreground">Your personal notes & bookmarks manager</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* ── LOGIN ── */}
          {step === 'login' && (
            <>
              <h2 className="font-serif text-xl font-bold mb-1 text-center">Log In</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Welcome back! Sign in with your email and password.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl btn-gradient disabled:opacity-50 transition-all"
                >
                  {submitting ? 'Signing in...' : 'Log In'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button onClick={resetToSignup} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Don't have an account?{' '}
                  <span className="text-primary font-medium">Sign Up</span>
                </button>
              </div>
            </>
          )}

          {/* ── SIGNUP STEP 1: EMAIL ── */}
          {step === 'signup-email' && (
            <>
              <h2 className="font-serif text-xl font-bold mb-1 text-center">Sign Up</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Enter your email address to create an account.<br />
                We'll send you an 8-digit verification code.
              </p>

              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl btn-gradient disabled:opacity-50 transition-all"
                >
                  {submitting ? 'Sending code...' : 'Send Code'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button onClick={resetToLogin} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Already have an account?{' '}
                  <span className="text-primary font-medium">Log In</span>
                </button>
              </div>
            </>
          )}

          {/* ── SIGNUP STEP 2: VERIFY CODE ── */}
          {step === 'signup-verify' && (
            <>
              <button onClick={() => { setStep('signup-email'); clearError(); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-serif text-xl font-bold mb-1">Verify Your Email</h2>
                <p className="text-sm text-muted-foreground">
                  We've sent an 8-digit code to<br />
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyCode} className="space-y-5">
                {renderOtpInput()}

                <button
                  type="submit"
                  disabled={submitting || otpCode.length !== 6}
                  className="w-full py-3 rounded-xl btn-gradient disabled:opacity-50 transition-all"
                >
                  {submitting ? 'Verifying...' : 'Verify'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={handleSendCode as any}
                  disabled={submitting}
                  className="text-sm text-primary hover:underline disabled:opacity-50"
                >
                  Resend code
                </button>
              </div>
            </>
          )}

          {/* ── SIGNUP STEP 3: SET PASSWORD ── */}
          {step === 'signup-password' && (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-serif text-xl font-bold mb-1">Set Your Password</h2>
                <p className="text-sm text-muted-foreground">
                  Your email has been verified 🎉<br />
                  Create a password to secure your account.
                </p>
              </div>

              <form onSubmit={handleSetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl btn-gradient disabled:opacity-50 transition-all"
                >
                  {submitting ? 'Setting up...' : 'Continue'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
