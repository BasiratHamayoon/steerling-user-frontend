'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { products } from '@/data/products';
import ProductCard from './ProductCard';

export default function ProductsSection() {
  const featuredProducts = products.slice(0, 8);

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            Featured Products
          </motion.h2>
          <p className="text-gray-400">Best selling steering wheels</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
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
            href="/products"
            className="inline-flex items-center gap-2 bg-[#0295E6] hover:bg-[#0275c6] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}