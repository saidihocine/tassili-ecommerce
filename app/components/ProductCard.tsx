'use client'

import { useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  stock: number
  category_id: number
}

export default function ProductCard({ product }: { product: Product }) {
  const [addingToCart, setAddingToCart] = useState(false)

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert('الرجاء تسجيل الدخول أولاً')
        return
      }

      // Check if product already in cart
      const { data: existingItem } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single()

      if (existingItem) {
        // Update quantity
        await supabase
          .from('cart')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id)
      } else {
        // Add new item
        await supabase
          .from('cart')
          .insert([{
            user_id: user.id,
            product_id: product.id,
            quantity: 1
          }])
      }

      alert('تم إضافة المنتج إلى السلة')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('حدث خطأ في إضافة المنتج')
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative w-full h-48 bg-gray-200">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
            product.stock > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `متوفر (${product.stock})` : 'غير متوفر'}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || addingToCart}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {addingToCart ? 'جاري الإضافة...' : 'أضف إلى السلة'}
        </button>
      </div>
    </div>
  )
}
