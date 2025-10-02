import BestSellProduct from "../../components/landing/home/BestSellProduct"
import FeaturesBrands from "../../components/landing/home/FeaturesBrands"
import HeroSection from "../../components/landing/home/HeroSection"
import MainBanner from "../../components/landing/home/MainBanner"
import NewArrivalProduct from "../../components/landing/home/NewArrivalProduct"
import PopularCategory from "../../components/landing/home/PopularCategory"
import SampleCards from "../../components/landing/home/SampleCards"
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
       <SummerOffer />
       <NewArrivalProduct />
       <WishingBanner />

      </main>
  )
}

export default Home