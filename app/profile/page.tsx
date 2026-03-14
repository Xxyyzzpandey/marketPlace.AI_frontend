"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Smartphone, 
  Settings, 
  Package, 
  ChevronRight, 
  LogOut, 
  ShieldCheck, 
  Mail,
  ExternalLink
} from 'lucide-react';
import { useAuthStore } from "../../store/authstore";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BACKEND_URL } from '@/store/urls';

export default function ProfilePage() {
  const { user, token, logout } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'requests' | 'settings'>('requests');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!useAuthStore.getState().isAuthenticated) {
      router.push('/signin');
    } else {
      fetchUserHistory();
    }
  }, [user]);

  const fetchUserHistory = async () => {
    try {
      // Assuming you have an endpoint to get a user's sourcing history
      const res = await axios.get(`${BACKEND_URL}/leads/buyer`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data.leads || []);
    } catch (err) {
      console.error("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      {/* --- Header --- */}
      <div className="bg-gradient-to-b from-green-500/10 to-transparent pt-12 pb-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center text-3xl font-bold text-black">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="absolute bottom-0 right-0 bg-black border border-white/10 p-1.5 rounded-full">
              <ShieldCheck size={16} className="text-green-500" />
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold">{user?.firstName} {user?.lastName}</h1>
            <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2 mt-1">
              <Smartphone size={16} /> {user?.whatsappNumber}
            </p>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all text-sm"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* --- Main Content --- */}
      <main className="max-w-4xl mx-auto px-6 mt-8">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-white/5 mb-8">
          <button 
            onClick={() => setActiveTab('requests')}
            className={`pb-4 text-sm font-medium transition-all relative ${activeTab === 'requests' ? 'text-green-500' : 'text-gray-500'}`}
          >
            Sourcing History
            {activeTab === 'requests' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />}
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`pb-4 text-sm font-medium transition-all relative ${activeTab === 'settings' ? 'text-green-500' : 'text-gray-500'}`}
          >
            Account Settings
            {activeTab === 'settings' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />}
          </button>
        </div>

        {activeTab === 'requests' ? (
          <div className="space-y-4">
            {loading ? (
              <div className="py-20 text-center text-gray-500">Loading your history...</div>
            ) : history.length > 0 ? (
              history.map((lead: any) => (
                <div key={lead._id} className="group bg-[#111] border border-white/5 p-5 rounded-2xl hover:border-green-500/30 transition-all cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="bg-green-500/10 p-3 rounded-xl">
                        <Package className="text-green-500" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{lead.details?.item || "Sourcing Request"}</h4>
                        <p className="text-sm text-gray-500">Qty: {lead.details?.qty} • {new Date(lead.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-md border ${
                      lead.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center bg-[#111] rounded-3xl border border-dashed border-white/10">
                <Package className="mx-auto mb-4 text-gray-600" size={40} />
                <h3 className="text-xl font-medium">No requests yet</h3>
                <p className="text-gray-500 mt-2 mb-6 text-sm">Start sourcing products to see them here.</p>
                <button onClick={() => router.push('/')} className="bg-green-500 text-black px-6 py-2 rounded-full font-bold">Find Suppliers</button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden">
             <div className="p-6 border-b border-white/5">
                <h3 className="font-bold flex items-center gap-2"><Settings size={18} /> Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="text-xs text-gray-500 block mb-2 uppercase">First Name</label>
                    <input disabled value={user?.firstName} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-400 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-2 uppercase">Last Name</label>
                    <input disabled value={user?.lastName} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-400 cursor-not-allowed" />
                  </div>
                </div>
             </div>
             
             <div className="p-6">
                <h3 className="font-bold flex items-center gap-2"><ShieldCheck size={18} /> Security</h3>
                <div className="mt-4 p-4 rounded-2xl bg-white/5 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>
                  <button className="text-green-500 text-sm font-bold">Update</button>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}