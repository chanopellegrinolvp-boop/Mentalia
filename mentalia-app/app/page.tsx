import TopBar from "@/components/landing/TopBar";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProblemSolution from "@/components/landing/ProblemSolution";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import CTAFinal from "@/components/landing/CTAFinal";
import Footer from "@/components/landing/Footer";
import ScrollAnimations from "@/components/landing/ScrollAnimations";

export default function Home() {
  return (
    <>
      <ScrollAnimations />
      <TopBar />
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <Features />
        <Pricing />
        <Testimonials />
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
}
