import { ArrowRight, Truck, Clock, Shield } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-earth-sand via-white to-orange-50" />
      
      <div className="container mx-auto px-4 py-8 md:py-16 relative">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left content */}
          <div className="text-center md:text-left animate-slide-up">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              🌍 Authentic African Flavors
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Fresh African <br />
              <span className="text-primary">Groceries</span> Delivered
            </h1>
            <p className="text-gray-600 text-base md:text-lg mb-6 max-w-md mx-auto md:mx-0">
              Discover authentic ingredients from across Africa. From Nigerian spices to Ethiopian coffee, 
              we bring the taste of home to your doorstep.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mb-8">
              <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3.5 rounded-full font-medium flex items-center justify-center gap-2 transition-all">
                Start Shopping <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3.5 rounded-full font-medium transition-all">
                View Deals
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-secondary" />
                <span>Free Delivery $50+</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-secondary" />
                <span>Same Day Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-secondary" />
                <span>Quality Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Right content - Hero image */}
          <div className="relative animate-fade-in">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&h=500&fit=crop"
                alt="Fresh African groceries"
                className="rounded-2xl shadow-2xl w-full object-cover"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🌶️</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Fresh Spices</p>
                    <p className="text-sm text-secondary">Just Arrived!</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Background decoration */}
            <div className="absolute top-8 right-8 w-full h-full bg-primary/20 rounded-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
