import { Truck, Shield, Clock, Headphones, Leaf, CreditCard } from 'lucide-react'

const features = [
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Fast Delivery',
    description: 'Same-day delivery available in major cities',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Quality Guaranteed',
    description: 'Fresh and authentic products sourced directly',
  },
  {
    icon: <Leaf className="w-8 h-8" />,
    title: '100% Authentic',
    description: 'Genuine African products from trusted suppliers',
  },
  {
    icon: <Headphones className="w-8 h-8" />,
    title: '24/7 Support',
    description: 'We are here to help you anytime',
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: 'Secure Payment',
    description: 'Multiple secure payment options',
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Easy Returns',
    description: '30-day hassle-free return policy',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Why Choose AfroMart?</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            We're committed to bringing the authentic taste of Africa to your table
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-4 md:p-6 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
