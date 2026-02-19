import HomepageLayout from "../layouts/HomepageLayout";
import HeroSection from "../components/Homepage/HeroSection";
import DemoSection from "../components/Homepage/DemoSection";
import PricingSection from "../components/Homepage/PricingSection";

function LandingPage() {
  return <HomepageLayout>
    <HeroSection />
    <DemoSection />
    <PricingSection />
  </HomepageLayout>;
}

export default LandingPage;