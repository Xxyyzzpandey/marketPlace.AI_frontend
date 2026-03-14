"use client";
import { useState } from 'react';
import AuthLayout from '@/components/AuthLayout';
import Link from 'next/link';
import { Smartphone, ShoppingBag, Truck, Globe, Info, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuthStore } from "../../store/authstore"; // Import your store
import { useRouter } from 'next/navigation';
import { BACKEND_URL } from '@/store/urls';

export default function SignUp() {
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      // Use the specific routes we discussed
      const endpoint = role === 'seller' ? '/seller/signup' : '/normalUser/signup';
      const response = await axios.post(`${BACKEND_URL}${endpoint}`, {
        ...data,
        role // explicitly send role
      });

      if (response.data.success) {
        // Save to Zustand store
        setAuth(response.data.user, response.data.token);
        
        // Redirect based on role
        router.push(role === 'seller' ? '/seller/dashboard' : '/');
      }
    } catch (error: any) {
      console.log(error);
      alert(error.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account">
      {/* --- Role Selector --- */}
      <div className="flex p-1 bg-[#0a0a0a] border border-white/10 rounded-2xl mb-8">
        <button 
          type="button"
          disabled={loading}
          onClick={() => setRole('buyer')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${role === 'buyer' ? 'bg-white text-black font-bold' : 'text-gray-500 hover:text-white'}`}
        >
          <ShoppingBag size={18} /> Buyer
        </button>
        <button 
          type="button"
          disabled={loading}
          onClick={() => setRole('seller')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${role === 'seller' ? 'bg-green-500 text-black font-bold' : 'text-gray-500 hover:text-white'}`}
        >
          <Truck size={18} /> Seller
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
            <input type="text" required name="firstName" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-green-500 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
            <input type="text" required name="lastName" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-green-500 text-white" />
          </div>
        </div>

        {/* WhatsApp/Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">WhatsApp Number (Login ID)</label>
          <div className="relative">
            <Smartphone className="absolute left-4 top-3.5 text-gray-600" size={18} />
            <input 
              type="tel" 
              required
              name="whatsappNumber"
              placeholder="+1 555 000 0000"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-1 focus:ring-green-500 text-white" 
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-600" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              required
              name="password"
              placeholder="••••••••"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-12 py-3 outline-none focus:ring-1 focus:ring-green-500 text-white" 
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

        {/* Seller Fields */}
        {role === 'seller' && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2 border-t border-white/5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Business Name</label>
              <input type="text" required name="businessName" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-green-500 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 text-xs">Country</label>
                <input type="text" required name="country" placeholder="Country" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-green-500 text-white text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 text-xs">City</label>
                <input type="text" required name="city" placeholder="City" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-green-500 text-white text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Business Description (for AI matching)</label>
              <textarea required name="description" placeholder="What do you sell?" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-green-500 h-24 text-white text-sm resize-none" />
            </div>
          </motion.div>
        )}

        <button 
          disabled={loading}
          className={`w-full font-bold py-4 rounded-xl mt-4 transition-all flex items-center justify-center gap-2 transform active:scale-95 ${role === 'seller' ? 'bg-green-500 text-black hover:bg-green-400' : 'bg-white text-black hover:bg-gray-200'}`}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : (role === 'seller' ? 'Create Wholesaler Profile' : 'Create Buyer Account')}
        </button>
      </form>
      
      <p className="text-center text-gray-500 mt-6 text-sm">
        Already have an account? <Link href="/signin" className="text-green-400 hover:underline">Log in</Link>
      </p>
    </AuthLayout>
  );
}