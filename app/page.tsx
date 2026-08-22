'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProductCard from './components/ProductCard'
import CategoryFilter from './components/CategoryFilter'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  stock: number
  category_id: number
}

interface Category {
  id: number
  name: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [selectedCategory])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*')
      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      let query = supabase.from('products').select('*')

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory)
      }

      const { data, error } = await query
      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-900">🛍️ متجر تاسيلي</h1>
          <p className="text-gray-600 mt-2">أفضل المنتجات بأسعار مميزة</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories Filter */}
        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Products Grid */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedCategory 
              ? `المنتجات - ${categories.find(c => c.id === selectedCategory)?.name}` 
              : 'جميع المنتجات'}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">جاري التحميل...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">لا توجد منتجات</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
