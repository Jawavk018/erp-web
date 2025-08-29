import { useState } from 'react';
import { Eye, EyeOff, User, Lock, Loader2 } from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            if (credentials.email === 'demo@textile.com' && credentials.password === 'demo123') {
                setError('');
                alert('Login successful! Redirecting to dashboard...');
            } else {
                setError('Invalid email or password. Try demo@textile.com / demo123');
            }
            setLoading(false);
        }, 1500);
    };

    const handleChange = (e: any) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-center">
                        <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">Textile ERP</h1>
                        <p className="text-blue-100 text-sm">Enterprise Resource Planning</p>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-8">
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome Back</h2>
                                <p className="text-gray-500 text-sm">Please sign in to your account</p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm animate-pulse">
                                    {error}
                                </div>
                            )}

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={credentials.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                </label>
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                    Forgot password?
                                </a>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium text-sm transition-all duration-200 transform hover:from-blue-700 hover:to-blue-800 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                        Signing in...
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </button>

                            {/* Demo Credentials */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
                                <div className="text-xs text-blue-600 space-y-1">
                                    <p>Email: demo@textile.com</p>
                                    <p>Password: demo123</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        © 2024 Textile ERP. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;