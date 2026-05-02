import React from 'react';
import { Wifi, WifiOff, RefreshCcw, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const SyncStatus = () => {
  const { isOnline, syncQueue } = useAppContext();

  return (
    <div className="flex items-center gap-3">
      <AnimatePresence mode="wait">
        {syncQueue.length > 0 ? (
          <motion.div 
            key="syncing"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full border border-orange-100"
          >
            <RefreshCcw size={14} className="animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest">{syncQueue.length} PENDING</span>
          </motion.div>
        ) : isOnline ? (
          <motion.div 
            key="online"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1.5 rounded-full border border-green-100"
          >
            <Cloud size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">SYNCED</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
        isOnline ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-red-50 text-red-600 border-red-100'
      }`}>
        {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
        <span className="text-[10px] font-black uppercase tracking-widest">
          {isOnline ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>
    </div>
  );
};

export default SyncStatus;
