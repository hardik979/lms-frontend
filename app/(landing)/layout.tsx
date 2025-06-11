import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Landinglayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}

      <Footer />
    </div>
  );
};

export default Landinglayout;
