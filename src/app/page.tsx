import { 
  HeroSection, 
  FeaturesSection, 
  PricingSection, 
  TestimonialsSection, 
  ContactSection 
} from "@/components/home";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <ContactSection />
      <div className="flex justify-center py-10">
        <Link href="/handler/signup" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          S'inscrire avec Stack Auth
        </Link>
      </div>
    </>
  );
}


