const categories = [
  { name: 'Grains & Flours', icon: '🌾', count: 120, color: 'bg-amber-100' },
  { name: 'Spices & Seasonings', icon: '🌶️', count: 85, color: 'bg-red-100' },
  { name: 'Proteins & Meats', icon: '🥩', count: 64, color: 'bg-rose-100' },
  { name: 'Fresh Vegetables', icon: '🥬', count: 92, color: 'bg-green-100' },
  { name: 'Palm Oil & Oils', icon: '🫒', count: 38, color: 'bg-orange-100' },
  { name: 'Beverages', icon: '🍵', count: 56, color: 'bg-yellow-100' },
  { name: 'Snacks & Sweets', icon: '🍪', count: 73, color: 'bg-purple-100' },
  { name: 'Ready Meals', icon: '🍲', count: 45, color: 'bg-teal-100' },
]

export default function Categories() {
  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-600 mt-1">Find everything you need</p>
          </div>
          <a href="#" className="text-primary font-medium hover:underline hidden sm:block">
            View All →
          </a>
        </div>

        {/* Mobile horizontal scroll */}
        <div className="flex md:hidden gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
          {categories.map((category) => (
            <a
              key={category.name}
              href="#"
              className="flex-shrink-0 w-28 text-center group"
            >
              <div className={`${category.color} w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-2 group-hover:scale-110 transition-transform`}>
                {category.icon}
              </div>
              <p className="text-sm font-medium text-gray-800 line-clamp-2">{category.name}</p>
            </a>
          ))}
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <a
              key={category.name}
              href="#"
              className="bg-gray-50 rounded-2xl p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all group"
            >
              <div className={`${category.color} w-16 h-16 mx-auto rounded-xl flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform`}>
                {category.icon}
              </div>
              <p className="font-medium text-gray-800 text-sm">{category.name}</p>
              <p className="text-xs text-gray-500 mt-1">{category.count} items</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
