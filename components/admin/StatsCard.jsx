'use client';

import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function StatsCard({ title, value, icon, change, trend, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
      <div className="flex items-center gap-2">
        {trend === 'up' ? (
          <FaArrowUp className="text-blue-300" />
        ) : (
          <FaArrowDown className="text-red-300" />
        )}
        <span className="text-sm">{change} from last month</span>
      </div>
    </motion.div>
  );
}