import Spline from "@splinetool/react-spline";
import { HeroScrollDemo } from "@/components/ui/demo";
import { Footer } from "@/components/ui/footer";
import { useEffect, useState, useRef, useCallback } from "react";

export default function Index() {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [showCurtain, setShowCurtain] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());

  const heroRef = useRef(null);
  const cryptoPayRef = useRef(null);

  // Intersection Observer for lazy loading Spline animations
  const observerCallback = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setVisibleSections(
          (prev) => new Set([...prev, entry.target.dataset.section]),
        );
      } else {
        // Remove from visible sections when not in view to free up resources
        setVisibleSections((prev) => {
          const newSet = new Set(prev);
          newSet.delete(entry.target.dataset.section);
          return newSet;
        });
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "200px", // Start loading 200px before section comes into view
      threshold: 0.1,
    });

    if (heroRef.current) observer.observe(heroRef.current);
    if (cryptoPayRef.current) observer.observe(cryptoPayRef.current);

    return () => observer.disconnect();
  }, [observerCallback, showMainContent]);

  // Performance optimization: Reduce animations when device has limited performance
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      console.log("Reduced motion preferred - optimizing animations");
    }
  }, []);

  useEffect(() => {
    // Show loading animation first
    setShowLoading(true);

    // Total loading animation duration: 4.0s (500ms preload + 2.5s text + 1s curtain)
    // Main content should load 1.0s before end (at 3.0s)
    const totalLoadingDuration = 4000; // 4.0 seconds (extended by 0.5s)
    const contentLoadOffset = 1000; // 1.0 seconds before end

    // Optimized preloading - only preload loading scene initially
    const preloadScenes = async () => {
      // Only preload the loading scene initially to reduce initial load
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulated loading time
      setIsPreloaded(true);

      // Show cardz text for 2.5 seconds before starting curtain effect
      setTimeout(() => {
        setShowCurtain(true);
        setTimeout(() => setShowLoading(false), 1000); // Hide loading after curtain animation
      }, 2500);
    };

    // Start loading main content 0.3s before loading animation ends
    setTimeout(() => {
      setShowMainContent(true);
    }, totalLoadingDuration - contentLoadOffset); // 3200ms

    preloadScenes();
  }, []);

  return (
    <>
      {/* Loading Animation Overlay */}
      {showLoading && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center transition-colors duration-1000"
          style={{ backgroundColor: showCurtain ? "transparent" : "black" }}
        >
          <div className="w-full h-full relative">
            <div
              className={
                "absolute inset-0" +
                (showCurtain ? " animate-spline-roll-up" : "")
              }
            >
              <Spline scene="https://prod.spline.design/v-vvo7sbJoCnGdsX/scene.splinecode" />
              {/* cardz Text Overlay - appears after loading */}
              {isPreloaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10 animate-in fade-in duration-1000">
                  <h1 className="text-7xl md:text-[9.5rem] font-bold text-white tracking-wider ml-4 mt-4">
                    cardz
                  </h1>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showMainContent && (
        <div className="min-h-screen bg-white">
          {/* Optimized preloading - only preload what's needed */}
          <div className="fixed inset-0 z-[-1] opacity-0 pointer-events-none">
            {/* Only preload the loading scene initially */}
            {!showMainContent && (
              <Spline scene="https://prod.spline.design/v-vvo7sbJoCnGdsX/scene.splinecode" />
            )}
          </div>

          {/* Hero Section with Spline */}
          <section
            ref={heroRef}
            data-section="hero"
            className="relative bg-white h-screen flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Spline 3D Scene - Only load when visible */}
            <div className="absolute inset-0 w-full h-full">
              {visibleSections.has("hero") ? (
                <Spline
                  scene="https://prod.spline.design/8wPfo43v95uamovu/scene.splinecode"
                  onLoad={() => console.log("Hero Spline loaded")}
                />
              ) : (
                <div className="w-full h-full bg-white flex items-center justify-center">
                  <div className="text-clevor-persian-blue text-xl">
                    Loading 3D Scene...
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Description Section */}
          <section className="bg-white py-[120px] px-8">
            <div className="max-w-[1140px] mx-auto text-center">
              <p className="text-clevor-persian-blue font-fustat text-2xl font-light leading-9 text-center">
                At cardz, we are revolutionizing how you navigate the digital
                economy. Our advanced smart cards bring the future of finance to
                your fingertips. Designed specifically for the Web3 era, our
                card combines three powerful technologies in one: a hardware
                wallet, a crypto debit card powered by Mastercard or Visa, and
                FIDO2 authentication for secure access.
              </p>
            </div>
          </section>

          {/* Pay With Crypto Section - Moved from bottom */}
          <section
            ref={cryptoPayRef}
            data-section="cryptoPay"
            className="relative bg-white h-screen flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full">
              {visibleSections.has("cryptoPay") ? (
                <Spline
                  scene="https://prod.spline.design/1YsdvfQLzvm2flZ2/scene.splinecode"
                  onLoad={() => console.log("Crypto Pay Spline loaded")}
                />
              ) : (
                <div className="w-full h-full bg-white flex items-center justify-center">
                  <div className="text-clevor-persian-blue text-xl">
                    Loading 3D Scene...
                  </div>
                </div>
              )}
            </div>

            {/* Text Overlay on Right */}
            <div className="absolute right-32 top-1/2 transform -translate-y-1/2 z-10 max-w-md">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                <h2 className="text-clevor-persian-blue font-fustat text-4xl font-bold leading-tight mb-6">
                  Seamless On-Chain Transactions
                </h2>
                <p className="text-clevor-mine-shaft font-fustat text-lg font-light leading-relaxed">
                  cardz Card allows users to conduct instant, self-custodied
                  stablecoin payments, bypassing traditional banking rails.
                  Whether for remittances or commerce, or any Web3 defi
                  operation, users enjoy real-time settlements 24/7 all around
                  the globe with complete financial autonomy.
                </p>
                <div className="mt-6 flex items-center text-clevor-emperor text-sm">
                  <div className="w-2 h-2 bg-clevor-teal rounded-full mr-3"></div>
                  <span>
                    Accepted everywhere Mastercard & Visa are welcomed
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Scroll Animation Section */}
          <section className="bg-white">
            <HeroScrollDemo />
          </section>

          {/* Why Choose cardz Cards Section */}
          <section className="bg-white py-24 px-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="text-center mb-20">
                <p className="text-clevor-cod-gray font-fustat text-lg font-medium mb-4 tracking-wide uppercase">
                  Why Choose cardz Cards?
                </p>
                <h2 className="text-clevor-persian-blue font-fustat text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                  Triple Technology
                </h2>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                {/* Web3 Hardware Wallet */}
                <div className="group relative">
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                    {/* Icon Container */}
                    <div className="w-20 h-20 bg-gradient-to-br from-clevor-persian-blue to-clevor-teal rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                    
                    {/* Content */}
                    <h3 className="text-clevor-blue-44 font-fustat text-2xl font-bold mb-4 leading-tight">
                    Web3 Hardware Wallet
                  </h3>
                    <p className="text-clevor-mine-shaft font-fustat text-lg leading-relaxed">
                      A fully integrated, replaceable wallet that allows signing transactions directly on-chain without compromising security.
                    </p>
                  </div>
                </div>

                {/* Crypto Debit Card */}
                <div className="group relative">
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                    {/* Icon Container */}
                    <div className="w-20 h-20 bg-gradient-to-br from-clevor-persian-blue to-clevor-teal rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                    
                    {/* Content */}
                    <h3 className="text-clevor-blue-44 font-fustat text-2xl font-bold mb-4 leading-tight">
                    Crypto Debit Card
                  </h3>
                    <p className="text-clevor-mine-shaft font-fustat text-lg leading-relaxed">
                      Powered by Mastercard, enabling crypto-to-fiat conversion for online payments or at any point of sale worldwide.
                  </p>
                  </div>
                </div>

                {/* FIDO2 Functionality */}
                <div className="group relative">
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                    {/* Icon Container */}
                    <div className="w-20 h-20 bg-gradient-to-br from-clevor-persian-blue to-clevor-teal rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                  </div>
                    
                    {/* Content */}
                    <h3 className="text-clevor-blue-44 font-fustat text-2xl font-bold mb-4 leading-tight">
                    FIDO2 Functionality
                  </h3>
                    <p className="text-clevor-mine-shaft font-fustat text-lg leading-relaxed">
                      Passwordless authentication for seamless and secure logins to all kinds of online services.
                  </p>
                </div>
                </div>
              </div>
            </div>
          </section>





          {/* How the cardz Card Works */}
          <section className="bg-white py-24 px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-clevor-persian-blue font-fustat text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                  How the cardz Card Works
                </h2>
              </div>

              <div className="space-y-6 md:space-y-8">
                {/* Secure & Convenient */}
                <div className="group relative bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-clevor-persian-blue to-clevor-teal rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-clevor-blue-44 font-fustat text-2xl font-bold leading-tight mb-2">
                        Secure & Convenient
                      </h3>
                      <p className="text-clevor-mine-shaft font-fustat text-lg leading-relaxed">
                        Your private keys never leave the card, ensuring absolute control.
                      </p>
                    </div>
                    </div>
                  </div>

                  {/* Crypto to Fiat Off-Ramp */}
                <div className="group relative bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-clevor-persian-blue to-clevor-teal rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-clevor-blue-44 font-fustat text-2xl font-bold leading-tight mb-2">
                        Crypto to Fiat Off-Ramp
                      </h3>
                      <p className="text-clevor-mine-shaft font-fustat text-lg leading-relaxed">
                        Easily top up your spending balance from your Web3 wallet functionality.
                      </p>
                    </div>
                    </div>
                  </div>

                {/* Crypto Debit Card Top-Up from Web3 Wallet */}
                <div className="group relative bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-clevor-persian-blue to-clevor-teal rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m-7 7h14" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-clevor-blue-44 font-fustat text-2xl font-bold leading-tight mb-2">
                        Crypto Debit Card Top-Up from Web3 Wallet
                      </h3>
                      <p className="text-clevor-mine-shaft font-fustat text-lg leading-relaxed">
                        Top up your card 100% on-chain by simply signing a transaction from your Web3 wallet. Your assets are seamlessly converted and credited to your card balance, ready for spending anywhere Mastercard or Visa is accepted.
                      </p>
                    </div>
                    </div>
                  </div>

                  {/* Banking-Grade Security */}
                <div className="group relative bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-clevor-persian-blue to-clevor-teal rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-clevor-blue-44 font-fustat text-2xl font-bold leading-tight mb-2">
                        Banking-Grade Security
                      </h3>
                      <p className="text-clevor-mine-shaft font-fustat text-lg leading-relaxed">
                        Integrated cryptographic security and tamper-resistant technology.
                      </p>
                    </div>
                    </div>
                  </div>

                  {/* Plug & Play */}
                <div className="group relative bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-clevor-persian-blue to-clevor-teal rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-clevor-blue-44 font-fustat text-2xl font-bold leading-tight mb-2">
                        Plug & Play
                      </h3>
                      <p className="text-clevor-mine-shaft font-fustat text-lg leading-relaxed">
                        No setup complexity; works instantly like a traditional bank card.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bridging Web3 and TradFi */}
          <section className="bg-white py-20 px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 gap-12 items-center">
                {/* Left: Copy */}
                <div>
                  <p className="text-clevor-cod-gray font-fustat text-sm tracking-wider uppercase mb-4">
                    Bridge Web3 ↔ TradFi
                  </p>
                  <h2 className="text-clevor-persian-blue font-fustat text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
                  Bridging Web3 and TradFi
                </h2>
                  <p className="text-clevor-emperor font-fustat text-lg leading-relaxed mb-8">
                    The cardz Card connects decentralized finance with everyday spending. Hold and manage
                    crypto on-chain, then pay like a traditional card anywhere Mastercard or Visa is
                    accepted—without compromising self-custody or security.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-clevor-persian-blue to-clevor-teal"></span>
                      <p className="text-clevor-mine-shaft font-fustat text-base leading-relaxed">
                        Seamless crypto-to-fiat conversion at the point of sale.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-clevor-persian-blue to-clevor-teal"></span>
                      <p className="text-clevor-mine-shaft font-fustat text-base leading-relaxed">
                        Passwordless access with built-in FIDO2 authentication.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-clevor-persian-blue to-clevor-teal"></span>
                      <p className="text-clevor-mine-shaft font-fustat text-base leading-relaxed">
                        Spend globally wherever major cards are accepted.
                </p>
              </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <Footer />




        </div>
      )}
    </>
  );
}
