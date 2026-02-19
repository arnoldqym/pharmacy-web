import HomepageLayout from "../layouts/HomepageLayout";
import HeroSection from "../components/Homepage/HeroSection";
import PricingSection from "../components/Homepage/PricingSection";

function LandingPage() {
  return <HomepageLayout>
    <HeroSection />
    <PricingSection />
  </HomepageLayout>;
}

export default LandingPage;