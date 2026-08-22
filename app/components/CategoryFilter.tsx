'use client'

interface Category {
  id: number
  name: string
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: number | null
  onSelectCategory: (categoryId: number | null) => void
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {/* All Categories Button */}
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          selectedCategory === null
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
        }`}
      >
        جميع الفئات
      </button>

      {/* Category Buttons */}
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === category.id
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
