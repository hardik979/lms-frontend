"use client";
import FlexibilitySection from "@/components/CardShow";
import SuccessCarousel from "@/components/Carousel";
import { AlmaXTimeline } from "@/components/ui/TimelineDemo";

export default function FeesPage() {
  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-cyan-950 via-cyan-900 to-slate-900 text-white pt-[120px] sm:pt-[140px] lg:pt-[160px] mt-12 px-4 py-6 sm:px-6 lg:px-8 font-sans relative overflow-hidden flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-400 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-sky-300 rounded-full blur-2xl"></div>
          <div className="absolute bottom-40 left-1/4 w-28 h-28 bg-cyan-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-sky-400 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-white">
              Fees{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-sky-300 bg-clip-text text-transparent">
                Structure
              </span>
            </h1>

            <p className="text-base sm:text-lg text-cyan-100 mb-4 max-w-3xl mx-auto leading-relaxed">
              We believe in transparency and flexibility. Our fee structure is
              designed to support your journey both before and after you land
              your dream job.
            </p>
          </div>

          {/* Fee Cards */}
          <div className="grid gap-4 lg:gap-6 sm:grid-cols-2 mb-6">
            {/* Pre-Placement Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-sky-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-cyan-900/90 to-cyan-800/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl border border-cyan-600/30 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-sky-400 rounded-xl flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                      Pre-Placement Fee
                    </h2>
                    <p className="text-cyan-300 text-xs">(Training Fee)</p>
                  </div>
                </div>

                <p className="text-cyan-100 mb-4 leading-relaxed text-sm">
                  Covers the complete job-ready training curriculum including
                  hands-on projects, quizzes, mentorship, and certification.
                </p>

                <div className="space-y-2 mb-4">
                  {[
                    "Flexible EMI options available",
                    "100% placement support after training",
                    "Live mentorship and project-based learning",
                    "Industry-recognized certification",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-sky-300 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-cyan-200 text-xs">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-cyan-700/50 to-sky-600/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-3">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-cyan-300 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-cyan-200 font-medium text-xs">
                      EMI Available • Pay in easy installments
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Post-Placement Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-cyan-900/90 to-sky-800/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl border border-sky-600/30 hover:border-sky-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-xl flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                      Post-Placement Fee
                    </h2>
                    <p className="text-sky-300 text-xs">(Success Fee)</p>
                  </div>
                </div>

                <p className="text-cyan-100 mb-4 leading-relaxed text-sm">
                  This fee is applicable only once you secure a job through our
                  placement program. Pay only after you're earning.
                </p>

                <div className="space-y-2 mb-4">
                  {[
                    "No upfront risk — Pay after you get placed",
                    "Transparent and student-friendly terms",
                    "Continued placement support post-job",
                    "Career guidance and growth support",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-4 h-4 bg-gradient-to-r from-sky-400 to-cyan-300 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-cyan-200 text-xs">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-sky-700/50 to-cyan-600/50 backdrop-blur-sm border border-sky-500/30 rounded-xl p-3">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-sky-300 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sky-200 font-medium text-xs">
                      No Job? No Fee. It's that simple.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-cyan-800/30 to-sky-800/30 backdrop-blur-sm border border-cyan-600/30 rounded-2xl p-4 sm:p-6 mb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Ready to Transform Your Career?
            </h3>
            <p className="text-cyan-200 mb-4 max-w-2xl mx-auto text-sm">
              Join thousands of successful professionals who trusted us with
              their career transformation. Get personalized guidance and
              detailed fee structure information.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href="https://wa.me/+919425645642?text=Hi%2C%20can%20you%20tell%20me%20more"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785" />
                </svg>
                Know More
              </a>

              <div className="flex items-center text-cyan-300 text-xs">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Free Consultation Available
              </div>
            </div>
          </div>
        </div>
      </section>

      <SuccessCarousel />
      <AlmaXTimeline />
      <FlexibilitySection />
    </>
  );
}
