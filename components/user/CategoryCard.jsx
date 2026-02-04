import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CategoryCard({ category }) {
  return (
    <Link href={`/categories/${category.id}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="card-hover bg-gray-900 rounded-xl overflow-hidden border border-gray-700"
      >
        <div className="h-48 overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
          <p className="text-gray-400 text-sm">{category.count} products</p>
        </div>
      </motion.div>
    </Link>
  );
}