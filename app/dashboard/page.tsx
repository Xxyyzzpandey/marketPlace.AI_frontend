// "use client";

// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   MessageSquare, TrendingUp, MapPin, CheckCircle, 
//   Clock, ExternalLink, Zap
// } from 'lucide-react';
// import { useAuthStore } from "@/store/authstore";
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { BACKEND_URL } from '@/store/urls';

// export default function SellerDashboard() {
//   const { user, token } = useAuthStore();
//   const router = useRouter();
  
//   const [leads, setLeads] = useState([]);
//   const [loadingLeads, setLoadingLeads] = useState(true);
//   const [isChecking, setIsChecking] = useState(true);

//   useEffect(() => {
//     const initDashboard = async () => {
//       // 1. Check if user exists in Zustand
//       if (!user) {
//         // 2. Fallback: check localStorage directly to be 100% sure
//         const storedAuth = localStorage.getItem('market-supply-auth'); // Matches your store name
//         if (!storedAuth) {
//           router.replace('/signin');
//           return;
//         }
//       }

//       // 3. Check role
//       if (user && user.role !== 'seller') {
//         router.replace('/signin');
//         return;
//       }

//       // 4. If we have a user and they are a seller, stop loading and fetch data
//       if (user && user.role === 'seller') {
//         setIsChecking(false);
//         fetchLeads();
//       }
//     };

//     initDashboard();
//   }, [user, router]);

//   const fetchLeads = async () => {
//     try {
//       const res = await axios.get(`${BACKEND_URL}/leads/seller`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setLeads(res.data.leads || []);
//     } catch (err) {
//       console.error("Failed to fetch leads");
//     } finally {
//       setLoadingLeads(false);
//     }
//   };

//   // --- LOADING STATE ---
//   if (isChecking) {
//     return (
//       <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
//         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-500"></div>
//         <p className="text-gray-500 text-sm animate-pulse">Verifying Wholesaler Session...</p>
//       </div>
//     );
//   }

//   const stats = [
//     { label: "Active Leads", value: leads.length, icon: MessageSquare, color: "text-blue-500" },
//     { label: "Acceptance Rate", value: "88%", icon: TrendingUp, color: "text-green-500" },
//     { label: "Search Visibility", value: "High", icon: Zap, color: "text-yellow-500" },
//   ];

//   return (
//     <div className="min-h-screen bg-[#0a0a0a] text-white">
//       <div className="max-w-7xl mx-auto px-6 py-10">
        
//         {/* Header */}
//         <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
//           <div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
//               Welcome, {user?.businessName}
//             </h1>
//             <p className="text-gray-500 mt-1 flex items-center gap-2">
//               <MapPin size={14} /> {user?.location?.city}, {user?.location?.country} • Seller ID: {user?.id?.slice(-6).toUpperCase()}
//             </p>
//           </div>
//         </header>

//         {/* --- Stats Grid --- */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//           {stats.map((stat, i) => (
//             <motion.div 
//               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.1 }}
//               key={stat.label} 
//               className="bg-[#111] border border-white/5 p-6 rounded-2xl"
//             >
//               <stat.icon className={`${stat.color} mb-4`} size={24} />
//               <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
//               <p className="text-2xl font-bold mt-1">{stat.value}</p>
//             </motion.div>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//           <div className="lg:col-span-2 space-y-6">
//             <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
//               <Clock className="text-green-500" size={20} /> Incoming Requests
//             </h2>

//             <AnimatePresence>
//               {loadingLeads ? (
//                 <div className="h-64 flex items-center justify-center text-gray-600">Syncing with MarketSupply AI...</div>
//               ) : leads.length > 0 ? (
//                 leads.map((lead: any, i) => (
//                   <motion.div 
//                     initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
//                     key={lead._id}
//                     className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-green-500/30 transition-all relative overflow-hidden group"
//                   >
//                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//                       <div className="space-y-2">
//                         <h3 className="text-lg font-bold text-green-400">{lead.details?.item}</h3>
//                         <p className="text-gray-400 text-sm max-w-md">"{lead.details?.specs}"</p>
//                         <div className="flex gap-4 text-xs text-gray-500 pt-2">
//                           <span className="flex items-center gap-1"><Package size={14}/> {lead.details?.qty} Units</span>
//                         </div>
//                       </div>
//                       <button className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all">
//                         Accept Lead <CheckCircle size={16} />
//                       </button>
//                     </div>
//                   </motion.div>
//                 ))
//               ) : (
//                 <div className="py-20 text-center bg-[#111] rounded-3xl border border-dashed border-white/10 text-gray-500">
//                   No active leads matching your business description.
//                 </div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/5 border border-green-500/20 p-6 rounded-3xl">
//               <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
//                 AI Optimization <Zap size={18} className="text-yellow-500 fill-yellow-500" />
//               </h3>
//               <p className="text-sm text-gray-400 leading-relaxed mb-4">
//                 Your profile is appearing in <strong>24%</strong> of relevant buyer searches.
//               </p>
//               <button className="w-full bg-white text-black text-sm font-bold py-3 rounded-xl hover:bg-gray-200 transition-all">
//                 Update Description
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const Package = ({size}: {size: number}) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
// );


"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  TrendingUp,
  MapPin,
  CheckCircle,
  Clock,
  Zap,
  Package
} from "lucide-react";
import { useAuthStore } from "@/store/authstore";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/store/urls";

// ❌ Removed 'async' from the function declaration
export default function SellerDashboard() {
  const { user, token } = useAuthStore();
  const router = useRouter();

  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  // Moved fetchLeads out or wrapped it in useCallback if needed, 
  // but keeping it simple for now.
  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/leads/seller`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLeads(res.data.leads || []);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        router.replace("/signin");
      }
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    const initDashboard = async () => {
      // If store is still hydrating, wait.
      // If we've checked and there's no token, redirect.
      if (!token) {
        // Give Zustand a moment to hydrate from localStorage
        const storedAuth = localStorage.getItem('market-supply-auth');
        if (!storedAuth) {
          router.replace("/signin");
          return;
        }
      }

      if (user && user.role !== "seller") {
        router.replace("/signin");
        return;
      }

      if (user && token) {
        setIsChecking(false);
        fetchLeads();
      }
    };

    initDashboard();
  }, [user, token, router]);

  const acceptLead = async (leadId: string) => {
    try {
      const res = await axios.patch(
        `${BACKEND_URL}/leads/${leadId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === leadId
            ? { ...lead, status: "accepted", buyerInfo: res.data.buyerInfo }
            : lead
        )
      );
    } catch (err) {
      console.error("Accept lead failed");
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-500"></div>
        <p className="text-gray-500 text-sm animate-pulse">
          Verifying Wholesaler Session...
        </p>
      </div>
    );
  }

  const stats = [
    { label: "Active Leads", value: leads.length, icon: MessageSquare, color: "text-blue-500" },
    { label: "Acceptance Rate", value: "10%", icon: TrendingUp, color: "text-green-500" },
    { label: "Search Visibility", value: "High", icon: Zap, color: "text-yellow-500" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Welcome, {user?.businessName}
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <MapPin size={14} />
              {user?.location?.city}, {user?.location?.country}
              • Seller ID: {user?.id?.slice(-6).toUpperCase()}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#111] border border-white/5 p-6 rounded-2xl"
            >
              <stat.icon className={`${stat.color} mb-4`} size={24} />
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
              <Clock className="text-green-500" size={20} />
              Incoming Requests
            </h2>

            <AnimatePresence>
              {loadingLeads ? (
                <div className="h-64 flex items-center justify-center text-gray-600">
                  Syncing with MarketSupply AI...
                </div>
              ) : leads.length > 0 ? (
                leads.map((lead: any) => (
                  <motion.div
                    key={lead._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-green-500/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-green-400">
                          {lead.details?.item}
                        </h3>
                        <p className="text-gray-400 text-sm max-w-md">
                          "{lead.details?.specs}"
                        </p>
                        <div className="flex gap-4 text-xs text-gray-500 pt-2">
                          <span className="flex items-center gap-1">
                            <Package size={14} />
                            {lead.details?.qty} Units
                          </span>
                        </div>
                        {lead.status === "accepted" && (
                          <p className="text-green-500 text-sm mt-2 font-mono">
                            Buyer Contact: {lead.buyerInfo?.phone}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => acceptLead(lead._id)}
                        disabled={lead.status === "accepted"}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all
                        ${
                          lead.status === "accepted"
                            ? "bg-white/5 text-gray-500 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-400 text-black"
                        }`}
                      >
                        {lead.status === "accepted" ? "Contact Shared" : "Accept Lead"}
                        <CheckCircle size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center bg-[#111] rounded-3xl border border-dashed border-white/10 text-gray-500">
                  No active leads matching your business description.
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/5 border border-green-500/20 p-6 rounded-3xl">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                AI Optimization
                <Zap size={18} className="text-yellow-500 fill-yellow-500" />
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Your profile is appearing in <strong>24%</strong> of relevant buyer searches.
              </p>
              <button className="w-full bg-white text-black text-sm font-bold py-3 rounded-xl hover:bg-gray-200 transition-all">
                Update Description
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}