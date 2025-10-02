import BestSellProduct from "../../components/landing/home/BestSellProduct"
import BlogSection from "../../components/landing/home/BlogSection"
import CountdownTimer from "../../components/landing/home/CountdownTimer"
import FeaturesBrands from "../../components/landing/home/FeaturesBrands"
import HeroSection from "../../components/landing/home/HeroSection"
import MainBanner from "../../components/landing/home/MainBanner"
import NewArrivalProduct from "../../components/landing/home/NewArrivalProduct"
import PopularCategory from "../../components/landing/home/PopularCategory"
import ProductTabsSection from "../../components/landing/home/ProductTabsSection"
import PromoCards from "../../components/landing/home/PromoCards"
import SampleCards from "../../components/landing/home/SampleCards"
import TestimonialSection from "../../components/landing/home/Testimonials"
import SummerOffer from "../../components/landing/home/SummerOffer"
import WishingBanner from "../../components/landing/home/WishingBanner"

const Home = () => {
  return (
    <main>
       <HeroSection />
       <SampleCards />
       <BestSellProduct />
       <MainBanner />
       <PopularCategory />
       <PromoCards  />
       <CountdownTimer  />
       <BlogSection  />
       <SummerOffer />
       <TestimonialSection  />
       <NewArrivalProduct />
       <WishingBanner />
       <ProductTabsSection  />

      </main>
  )
}

export default Home