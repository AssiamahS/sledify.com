import { Apple, PlayCircle } from 'lucide-react'

export default function AppDownload() {
  return (
    <section className="py-10 md:py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Download Our App
            </h2>
            <p className="text-white/80 mb-6 max-w-md">
              Get exclusive deals, track your orders, and shop on the go. 
              Available for iOS and Android.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a
                href="#"
                className="inline-flex items-center gap-3 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-900 transition-colors"
              >
                <Apple className="w-7 h-7" />
                <div className="text-left">
                  <p className="text-xs text-gray-400">Download on the</p>
                  <p className="font-semibold">App Store</p>
                </div>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-3 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-900 transition-colors"
              >
                <PlayCircle className="w-7 h-7" />
                <div className="text-left">
                  <p className="text-xs text-gray-400">Get it on</p>
                  <p className="font-semibold">Google Play</p>
                </div>
              </a>
            </div>
          </div>
          
          <div className="relative">
            <div className="flex gap-4">
              <div className="w-36 md:w-48 bg-white/10 rounded-3xl p-2 backdrop-blur">
                <div className="bg-gray-800 rounded-2xl aspect-[9/19] flex items-center justify-center">
                  <span className="text-4xl">📱</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
