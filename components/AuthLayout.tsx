// components/AuthLayout.tsx
import { motion } from 'framer-motion';

export default function AuthLayout({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center items-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#161616] border border-white/10 p-8 rounded-3xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-2 text-white">{title}</h2>
        <p className="text-gray-400 mb-8">Join the global sourcing network.</p>
        {children}
      </motion.div>
    </div>
  );
}