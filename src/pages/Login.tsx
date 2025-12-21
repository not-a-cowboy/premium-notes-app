import { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';

export function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/');
            }
        } catch (error: any) {
            setMessage(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // const _handleGoogleLogin = async () => {
    //     setLoading(true);
    //     const { error } = await supabase.auth.signInWithOAuth({
    //         provider: 'google',
    //         options: {
    //             redirectTo: window.location.origin
    //         }
    //     });
    //     if (error) alert(error.message);
    //     setLoading(false);
    // };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <Link to="/" className="absolute top-8 left-8 p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
                <ArrowLeft size={24} />
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8"
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
                <p className="text-gray-500 mb-8">Sync your notes across devices</p>

                {message && (
                    <div className={`p-4 rounded-xl mb-6 text-sm ${message.includes('Check') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gta-purple"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gta-purple"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gta-purple text-white rounded-xl font-bold hover:bg-gta-pink transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {isSignUp ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                <div className="mt-6 flex items-center gap-4">
                    <div className="h-px bg-gray-200 flex-1" />
                    <span className="text-gray-400 text-sm">or</span>
                    <div className="h-px bg-gray-200 flex-1" />
                </div>

                <div className="mt-6 space-y-3">
                    {/* Placeholder for Google Login - requires Supabase configured URL */}
                    {/*  <button 
                        onClick={_handleGoogleLogin}
                        className="w-full py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex justify-center items-center gap-2"
                    >
                       <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                       Continue with Google
                    </button> */}

                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="w-full py-3 text-gta-purple font-medium hover:underline text-sm"
                    >
                        {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
