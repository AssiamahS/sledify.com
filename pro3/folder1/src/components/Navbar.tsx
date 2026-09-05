import { useState } from 'react'
import { Menu, X, ShoppingCart, Search, User, MapPin } from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount] = useState(3)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm safe-top">
      {/* Top bar - hidden on mobile */}
      <div className="hidden md:block bg-primary text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Delivering to: Select your location</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Help</a>
            <a href="#" className="hover:underline">Track Order</a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">AfroMart</span>
          </a>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for African groceries, spices, ingredients..."
                className="w-full py-2.5 pl-4 pr-12 border-2 border-gray-200 rounded-full focus:border-primary focus:outline-none"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="md:hidden p-2">
              <Search className="w-6 h-6 text-gray-600" />
            </button>
            
            <a href="#" className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-primary">
              <User className="w-6 h-6" />
              <span className="hidden lg:block">Sign In</span>
            </a>

            <button className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Category navigation - desktop */}
        <div className="hidden md:flex items-center gap-6 mt-3 text-sm">
          <a href="#" className="text-primary font-medium">All Categories</a>
          <a href="#" className="text-gray-600 hover:text-primary">Grains & Flours</a>
          <a href="#" className="text-gray-600 hover:text-primary">Spices</a>
          <a href="#" className="text-gray-600 hover:text-primary">Proteins</a>
          <a href="#" className="text-gray-600 hover:text-primary">Vegetables</a>
          <a href="#" className="text-gray-600 hover:text-primary">Beverages</a>
          <a href="#" className="text-gray-600 hover:text-primary">Snacks</a>
          <a href="#" className="text-accent font-medium">🔥 Deals</a>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search groceries..."
                className="w-full py-3 pl-4 pr-12 border-2 border-gray-200 rounded-full"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex flex-col gap-3">
              <a href="#" className="py-2 text-primary font-medium">All Categories</a>
              <a href="#" className="py-2 text-gray-600">Grains & Flours</a>
              <a href="#" className="py-2 text-gray-600">Spices</a>
              <a href="#" className="py-2 text-gray-600">Proteins</a>
              <a href="#" className="py-2 text-gray-600">Vegetables</a>
              <a href="#" className="py-2 text-gray-600">Beverages</a>
              <a href="#" className="py-2 text-gray-600">Snacks</a>
              <a href="#" className="py-2 text-accent font-medium">🔥 Deals</a>
              <hr className="my-2" />
              <a href="#" className="py-2 text-gray-600 flex items-center gap-2">
                <User className="w-5 h-5" /> Sign In / Register
              </a>
              <a href="#" className="py-2 text-gray-600 flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Select Location
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
