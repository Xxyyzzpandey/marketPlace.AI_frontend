"use client";
import { useState } from 'react';
import AuthLayout from '@/components/AuthLayout';
import Link from 'next/link';
import { Smartphone, Lock, ShoppingBag, Truck, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { BACKEND_URL } from '@/store/urls';

export default function SignIn() {
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      // Determine endpoint based on role
      const endpoint = role === 'seller' ? '/seller/signin' : '/user/signin';
      const response = await axios.post(`${BACKEND_URL}${endpoint}`, data);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', role);
        setAuth(response.data.user, response.data.token);
        // Redirect based on role
        window.location.href = role === 'seller' ? '/dashboard' : '/';
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back">
      {/* --- Role Selector --- */}
      <div className="flex p-1 bg-[#0a0a0a] border border-white/10 rounded-2xl mb-8">
        <button 
          type="button"
          onClick={() => setRole('buyer')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${role === 'buyer' ? 'bg-white text-black font-bold' : 'text-gray-500 hover:text-white'}`}
        >
          <ShoppingBag size={18} /> Buyer
        </button>
        <button 
          type="button"
          onClick={() => setRole('seller')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${role === 'seller' ? 'bg-green-500 text-black font-bold' : 'text-gray-500 hover:text-white'}`}
        >
          <Truck size={18} /> Wholesaler
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* WhatsApp Number */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">WhatsApp Number</label>
          <div className="relative">
            <Smartphone className="absolute left-4 top-3.5 text-gray-600" size={18} />
            <input 
              name="whatsappNumber"
              type="tel" 
              required
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all text-white"
              placeholder="+1 555 000 0000"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-600" size={18} />
            <input 
              name="password"
              type={showPassword ? "text" : "password"} 
              required
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-12 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all text-white"
              placeholder="••••••••"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-gray-600 hover:text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button 
          disabled={loading}
          className={`w-full py-3 rounded-xl mt-4 font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
            role === 'seller' ? 'bg-green-500 hover:bg-green-400 text-black' : 'bg-white hover:bg-gray-200 text-black'
          }`}
        >
          {loading ? "Authenticating..." : "Sign In"}
        </button>
      </form>
      
      <p className="text-center text-gray-500 mt-6 text-sm">
        Don't have an account? <Link href="/signup" className="text-green-400 hover:underline">Create one</Link>
      </p>
    </AuthLayout>
  );
}