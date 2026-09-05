import { Heart, ShoppingCart, Star } from 'lucide-react'

const products = [
  {
    id: 1,
    name: 'Organic Jollof Rice Spice Mix',
    price: 8.99,
    originalPrice: 12.99,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop',
    rating: 4.8,
    reviews: 234,
    badge: 'Best Seller',
    badgeColor: 'bg-primary',
  },
  {
    id: 2,
    name: 'Nigerian Palm Oil - 1L',
    price: 14.99,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop',
    rating: 4.6,
    reviews: 156,
    badge: null,
    badgeColor: '',
  },
  {
    id: 3,
    name: 'Dried Stockfish (Okporoko)',
    price: 24.99,
    originalPrice: 29.99,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=300&fit=crop',
    rating: 4.9,
    reviews: 89,
    badge: 'Sale',
    badgeColor: 'bg-accent',
  },
  {
    id: 4,
    name: 'Egusi Seeds - 500g',
    price: 11.99,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop',
    rating: 4.7,
    reviews: 312,
    badge: 'Popular',
    badgeColor: 'bg-secondary',
  },
  {
    id: 5,
    name: 'Garri (Cassava Flakes) - 2kg',
    price: 9.99,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop',
    rating: 4.5,
    reviews: 198,
    badge: null,
    badgeColor: '',
  },
  {
    id: 6,
    name: 'Suya Spice Blend',
    price: 6.99,
    originalPrice: 9.99,
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=300&h=300&fit=crop',
    rating: 4.8,
    reviews: 445,
    badge: 'New',
    badgeColor: 'bg-blue-500',
  },
]

export default function FeaturedProducts() {
  return (
    <section className="py-10 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-600 mt-1">Handpicked favorites from across Africa</p>
          </div>
          <a href="#" className="text-primary font-medium hover:underline hidden sm:block">
            View All →
          </a>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
            >
              {/* Image container */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.badge && (
                  <span className={`absolute top-2 left-2 ${product.badgeColor} text-white text-xs px-2 py-1 rounded-full`}>
                    {product.badge}
                  </span>
                )}
                <button className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="w-4 h-4 text-gray-600 hover:text-accent" />
                </button>
              </div>

              {/* Content */}
              <div className="p-3 md:p-4">
                <h3 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1 min-h-[2.5rem]">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{product.rating} ({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-primary">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through ml-1">${product.originalPrice}</span>
                    )}
                  </div>
                  <button className="w-8 h-8 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-full flex items-center justify-center transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-6 text-center sm:hidden">
          <a href="#" className="text-primary font-medium">View All Products →</a>
        </div>
      </div>
    </section>
  )
}
