'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { categories } from '@/data/categories';
import CategoryCard from './CategoryCard';

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            Shop by Categories
          </motion.h2>
          <p className="text-gray-400">Find the perfect steering wheel for your vehicle</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 bg-[#0295E6] hover:bg-[#0275c6] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            View All Categories
          </Link>
        </motion.div>
      </div>
    </section>
  );
}