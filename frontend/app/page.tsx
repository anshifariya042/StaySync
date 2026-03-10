import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import SearchFilter from '@/components/SearchFilter/SearchFilter';
import FeaturedHostels from '@/components/FeaturedHostels/FeaturedHostels';
import Features from '@/components/Features/Features';
import Footer from '@/components/Footer/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SearchFilter />
      <FeaturedHostels />
      <Features />
      <Footer />
    </>
  );
}
