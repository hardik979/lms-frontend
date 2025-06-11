import "../app/globals.css";

const Marquee = () => {
  // Split into two groups of 5 each
  const line1Logos = [
    "/client-1.png",
    "/client-2.png",
    "/client-3.png",
    "/client-4.png",
    "/client-5.png",
    "/client-1.png",
    "/client-2.png",
    "/client-3.png",
    "/client-4.png",
    "/client-5.png",
  ];

  const line2Logos = [
    "/client-6.png",
    "/client-7.png",
    "/client-8.png",
    "/client-9.png",
    "/client-10.png",
    "/client-6.png",
    "/client-7.png",
    "/client-8.png",
    "/client-9.png",
    "/client-10.png",
  ];

  return (
    <section className="bg-cyan-50 py-10 overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-semibold text-center text-cyan-900 mb-16">
        Our Hiring <span className="text-sky-500 underline">Partners</span>
      </h2>

      {/* Line 1 - Left to Right */}
      <div className="relative overflow-hidden">
        <div className="marquee-track flex w-max animate-marquee gap-20 px-4">
          {[...Array(3)].map((_, groupIdx) => (
            <div className="flex gap-16 px-4" key={`line1-${groupIdx}`}>
              {line1Logos.map((src, i) => (
                <img
                  key={`${i}-${groupIdx}`}
                  src={src}
                  alt="Partner Logo"
                  className="h-12 w-auto object-contain"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Line 2 - Right to Left */}
      <div className="relative overflow-hidden mt-10">
        <div className="marquee-track flex w-max animate-marquee-reverse gap-20 px-4">
          {[...Array(3)].map((_, groupIdx) => (
            <div className="flex gap-16 px-4" key={`line2-${groupIdx}`}>
              {line2Logos.map((src, i) => (
                <img
                  key={`${i}-rev-${groupIdx}`}
                  src={src}
                  alt="Partner Logo"
                  className="h-12 w-auto object-contain"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Marquee;
