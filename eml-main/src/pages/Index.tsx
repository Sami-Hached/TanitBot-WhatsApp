import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import About from "@/components/About";
import CurrentProjects from "@/components/CurrentProjects";
import Testimonials from "@/components/Testimonials";
import DigitalRightsGuide from "@/components/DigitalRightsGuide";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Navbar />
    <Hero />
    <Partners />
    <About />
    <DigitalRightsGuide />
    {/* <CurrentProjects /> */}
    {/* <Testimonials /> */}
    <CTASection />
    <Footer />
  </>
);

export default Index;
