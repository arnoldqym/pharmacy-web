import HomepageLayout from "../layouts/HomepageLayout";
import HeroSection from "../components/Homepage/HeroSection";
import DemoSection from "../components/Homepage/DemoSection";
import AboutSection from "../components/Homepage/AboutSection";
import PricingSection from "../components/Homepage/PricingSection";

function LandingPage() {
  return <HomepageLayout>
    <HeroSection />
    <DemoSection />
    <AboutSection />
    <PricingSection />
  </HomepageLayout>;
}

export default LandingPage;