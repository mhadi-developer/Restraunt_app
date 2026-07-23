"use client";
import { AboutSection } from "@/components/Home/About";
import CategorySection from "@/components/Home/Category";
import { ChefsSection } from "@/components/Home/Chef";
import GallerySection from "@/components/Home/Gallery";
import Hero from "@/components/Home/Hero";
import HistorySection from "@/components/Home/History";
import WrorkingHoursSection from "@/components/Home/Hours";
import MarqueeSection from "@/components/Home/Marquee";
import { MenuSection } from "@/components/Home/Menue";
import { SpecialOfferSection } from "@/components/Home/SpecialOffer";
import { TestimonialSection } from "@/components/Home/Testonomial";
import {InfoSection} from "@/components/Home/Info"
import { BlogSection } from "@/components/Home/Blog";
import { NewsletterSection } from "@/components/Home/NewsLetter";
import { ContactSection } from "@/components/Home/Contact";
import { useAuth } from "@/hooks/useAuth";
import { Suspense, useEffect } from "react";
import SpinnerCircle from "@/components/Spinner";

export default function HomePage() {
  const { getLoggedInUser } = useAuth();
  
  useEffect(() => {
    getLoggedInUser()
  }, [getLoggedInUser]);
  return (
    <>
      <Hero />
      <MarqueeSection />
      <Suspense fallback={<SpinnerCircle size={128} />}>
      <CategorySection />
      </Suspense>
      <AboutSection />
      <MenuSection />
      <SpecialOfferSection/>
      <GallerySection />
      <HistorySection/>
      <ChefsSection />
      <WrorkingHoursSection />
      <TestimonialSection/>
      <InfoSection/>
      <BlogSection />
      <NewsletterSection/>
      <ContactSection/>
    </>
  )
}