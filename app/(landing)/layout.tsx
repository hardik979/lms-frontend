"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Landinglayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" [font-family:var(--font-raleway)]">
      <Navbar />
      {children}

      <Footer />
    </div>
  );
};

export default Landinglayout;
