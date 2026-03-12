"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Search, User, Globe, ShieldCheck, CheckCircle2, Clock, Smartphone } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from "../store/authstore";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BACKEND_URL } from '@/store/urls';

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  // State for buyer info and tracking requests
  const [activeRequests, setActiveRequests] = useState<any[]>([]);

  // Initialize buyerInfo from Zustand if available
  const [buyerInfo, setBuyerInfo] = useState({ 
    name: user?.firstName || "", 
    phone: user?.whatsappNumber || "" 
  });

  // Keep state in sync if user logs in/out
  useEffect(() => {
    if (user) {
      setBuyerInfo({ name: user.firstName, phone: user.whatsappNumber });
    }
  }, [user]);

  // 1. Initial Logic to open modal or send
 const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    // If authenticated, skip the modal and go straight to search
    if (isAuthenticated) {
      executeSearch();
    } else {
      setShowContactModal(true);
    }
  };
  // 2. The actual API call
  const executeSearch = async () => {
    setIsAnalyzing(true);
    setShowContactModal(false);
    // Get token from store
  const token = useAuthStore.getState().token;
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/searchProduct`, {
        userPrompt: query,
        buyerInfo: buyerInfo
      },
    {
        headers: {
          Authorization: `Bearer ${token}` // Pass JWT for verified requests
        }
      });

      if (response.data.success) {
        setIsSuccess(true);
        // Add to local history list
        setActiveRequests(prev => [{
          id: response.data.requestId,
          item: query.substring(0, 40) + "...",
          status: 'Finding Suppliers',
          time: 'Just now'
        }, ...prev]);
        setQuery("");
        // Reset success message after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Search failed:", error);
      alert("Error connecting to backend. Ensure your server is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-green-500/30">
      
      {/* --- Navigation --- */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
  <motion.div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
    MarketSupply.AI
  </motion.div>
  
  <div className="flex gap-6 items-center">
    {isAuthenticated ? (
      <>
        <div className="hidden md:block text-sm text-gray-500">
          Logged in as{" "}
  <span className="text-white font-medium">
    {user?.role === 'seller' ? user?.businessName : user?.firstName}
  </span>
        </div>
        <button 
          onClick={() => { logout(); router.push('/signin'); }}
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          Sign Out
        </button>
        <button 
          onClick={() => router.push(user?.role === 'seller' ? '/dashboard' : '/profile')}
          className="bg-white text-black px-5 py-2 rounded-full font-medium hover:bg-gray-200 transition-all flex items-center gap-2"
        >
          <User size={18} /> {user?.role === 'seller' ? 'Dashboard' : 'Profile'}
        </button>
      </>
    ) : (
      <>
        <Link href="/signin" className="text-gray-400 hover:text-white transition-colors">Sign In</Link>
        <Link 
          href="/signup" 
          className="bg-white text-black px-5 py-2 rounded-full font-medium hover:bg-gray-200 transition-all"
        >
          Get Started
        </Link>
      </>
    )}
  </div>
</nav>

      {/* --- Hero Section --- */}
      <main className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
        >
          Source anything. <br />
          <span className="text-gray-500">Chat on WhatsApp.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto"
        >
          Tell our AI exactly what you need. We'll find the best global wholesalers and connect you instantly via WhatsApp. No middlemen, no hassle.
        </motion.p>

        {/* --- AI Input Box --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
          
          <form onSubmit={handlePreSubmit} className="relative bg-[#161616] border border-white/10 p-4 rounded-2xl shadow-2xl">
            <textarea 
              className="w-full bg-transparent border-none focus:ring-0 text-lg placeholder-gray-600 resize-none h-32 p-2"
              placeholder="I need 500 custom-branded stainless steel water bottles, matte finish, delivered to Dubai..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isAnalyzing}
            />
            
            <div className="flex justify-between items-center mt-4 border-t border-white/5 pt-4">
              <div className="flex gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><ShieldCheck size={14}/> Verified Wholesalers</span>
                <span className="flex items-center gap-1"><Globe size={14}/> Global Reach</span>
              </div>
              
              <button 
                type="submit"
                disabled={!query || isAnalyzing}
                className="bg-green-500 hover:bg-green-400 disabled:bg-gray-700 text-black font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all transform active:scale-95"
              >
                {isAnalyzing ? "Analyzing..." : "Find Wholesalers"}
                <Send size={18} />
              </button>
            </div>
          </form>
        </motion.div>

        {/* --- Post-Submission Status --- */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 inline-block"
            >
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
                Searching 10,000+ suppliers for your request...
              </div>
            </motion.div>
          )}

          {isSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-400 inline-block"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} />
                Request sent! Suppliers will contact you on WhatsApp.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Active Requests Section --- */}
        {activeRequests.length > 0 && (
          <div className="mt-20 text-left max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock size={20} className="text-green-500" /> Active Sourcing
            </h3>
            <div className="space-y-4">
              {activeRequests.map((req, i) => (
                <div key={i} className="bg-[#111] border border-white/5 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{req.item}</h4>
                    <p className="text-sm text-gray-500">{req.time}</p>
                  </div>
                  <span className="text-xs bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20">
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* --- Buyer Info Modal --- */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#161616] border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="text-green-500" />
                </div>
                <h3 className="text-2xl font-bold">One last thing</h3>
                <p className="text-gray-400 text-sm mt-2">Suppliers need your contact to reach out via WhatsApp.</p>
              </div>
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-green-500 transition-colors"
                  value={buyerInfo.name}
                  onChange={(e) => setBuyerInfo({...buyerInfo, name: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="WhatsApp Number (e.g. +91...)" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-green-500 transition-colors"
                  value={buyerInfo.phone}
                  onChange={(e) => setBuyerInfo({...buyerInfo, phone: e.target.value})}
                />
                <button 
                  onClick={executeSearch}
                  disabled={!buyerInfo.name || !buyerInfo.phone}
                  className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 text-black font-bold py-3 rounded-xl transition-all"
                >
                  Connect with Suppliers
                </button>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="w-full text-gray-500 text-sm hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Footer Info --- */}
      <footer className="border-t border-white/5 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center gap-2"><MessageCircle /> WhatsApp Integrated</div>
          <div className="flex items-center gap-2"><Search /> AI Matching</div>
          <div className="flex items-center gap-2"><Globe /> 50+ Countries</div>
        </div>
      </footer>
    </div>
  );
}