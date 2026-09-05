import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Categories from '@/components/Categories'
import FeaturedProducts from '@/components/FeaturedProducts'
import WhyChooseUs from '@/components/WhyChooseUs'
import AppDownload from '@/components/AppDownload'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <WhyChooseUs />
        <AppDownload />
      </main>
      <Footer />
    </div>
  )
}
