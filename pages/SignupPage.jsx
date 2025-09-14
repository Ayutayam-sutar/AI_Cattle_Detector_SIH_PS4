import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  

const handleSubmit = async (e) => { 
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
        await signup(name, email, password);
    } catch (error) {
        console.log("Signup failed on page.");
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
      {/* Left Panel: Image (now serves as background) */}
      <div 
        className="relative col-start-1 row-start-1 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1623211270083-5743da6c67ec?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFybWVyJTIwd2l0aCUyMGNvdyUyMGluZGlhbnxlbnwwfHwwfHx8MA%3D%3D')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 to-stone-900/50"></div>
        {/* Text Overlay (Hidden on Mobile) */}
        <div className="hidden lg:flex absolute inset-0 items-center justify-center p-12">
            <div className="text-white text-center">
                <h2 className="text-4xl font-bold animate-tracking-in-expand">Join a Community of Modern Farmers</h2>
                <p className="mt-4 text-lg text-emerald-100">Start making data-driven decisions for your dairy farm today.</p>
            </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="col-start-1 row-start-1 lg:col-start-2 z-10 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 animate-slide-in-elliptic-top-fwd">
        <div className="mx-auto w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-lg">
          <div>
            <h2 className="mt-6 text-3xl font-bold text-stone-900">
              Create a new account
            </h2>
            <p className="mt-2 text-lg text-stone-600">
              Already have an account?{' '}
              <button 
                onClick={() => window.location.hash = '/login'} 
                className="font-medium text-emerald-600 hover:text-emerald-500 bg-transparent border-none cursor-pointer p-0 "
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-stone-700">Full Name</label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="appearance-none block w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white sm:text-sm"
                    placeholder="Jignesh Patel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-stone-700">Email address</label>
                <div className="mt-1">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white sm:text-sm"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-stone-700">Password</label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none block w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white sm:text-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#557369] hover:bg-[#557339] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-400"
                >
                  {isLoading && <Spinner />}
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;