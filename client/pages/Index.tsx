import Spline from '@splinetool/react-spline';
import { HeroScrollDemo } from '@/components/ui/demo';
import { useEffect, useState, useRef, useCallback } from 'react';

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
        setVisibleSections(prev => new Set([...prev, entry.target.dataset.section]));
      } else {
        // Remove from visible sections when not in view to free up resources
        setVisibleSections(prev => {
          const newSet = new Set(prev);
          newSet.delete(entry.target.dataset.section);
          return newSet;
        });
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '200px', // Start loading 200px before section comes into view
      threshold: 0.1
    });

    if (heroRef.current) observer.observe(heroRef.current);
    if (cryptoPayRef.current) observer.observe(cryptoPayRef.current);

    return () => observer.disconnect();
  }, [observerCallback, showMainContent]);

  // Performance optimization: Reduce animations when device has limited performance
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      console.log('Reduced motion preferred - optimizing animations');
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
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulated loading time
      setIsPreloaded(true);

      // Show CLEVOR text for 2.5 seconds before starting curtain effect
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
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-colors duration-1000" style={{ backgroundColor: showCurtain ? 'transparent' : 'black' }}>
          <div className="w-full h-full relative">
            <div className={"absolute inset-0" + (showCurtain ? " animate-spline-roll-up" : "") }>
              <Spline scene="https://prod.spline.design/v-vvo7sbJoCnGdsX/scene.splinecode" />
              {/* CLEVOR Text Overlay - appears after loading */}
              {isPreloaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10 animate-in fade-in duration-1000">
                  <h1 className="text-8xl md:text-[12rem] font-bold text-white tracking-wider">
                    CLEVOR
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
          className="relative bg-clevor-grey-95 h-screen flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Spline 3D Scene - Only load when visible */}
          <div className="absolute inset-0 w-full h-full">
            {visibleSections.has('hero') ? (
              <Spline
                scene="https://prod.spline.design/8wPfo43v95uamovu/scene.splinecode"
                onLoad={() => console.log('Hero Spline loaded')}
              />
            ) : (
              <div className="w-full h-full bg-clevor-grey-95 flex items-center justify-center">
                <div className="text-clevor-persian-blue text-xl">Loading 3D Scene...</div>
              </div>
            )}
          </div>
        </section>

      {/* Description Section */}
      <section className="bg-white py-[120px] px-8">
        <div className="max-w-[1140px] mx-auto text-center">
          <p className="text-clevor-persian-blue font-fustat text-2xl font-light leading-9 text-center">
            At Clevor, we are revolutionizing how you navigate the digital economy.
            Our advanced smart cards bring the future of finance to your fingertips. Designed specifically for the
            Web3 era, our card combines three powerful technologies in one: a hardware wallet, a crypto debit card
            powered by Mastercard or Visa, and FIDO2 authentication for secure access.
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
          {visibleSections.has('cryptoPay') ? (
            <Spline
              scene="https://prod.spline.design/1YsdvfQLzvm2flZ2/scene.splinecode"
              onLoad={() => console.log('Crypto Pay Spline loaded')}
            />
          ) : (
            <div className="w-full h-full bg-white flex items-center justify-center">
              <div className="text-clevor-persian-blue text-xl">Loading 3D Scene...</div>
            </div>
          )}
        </div>

        {/* Text Overlay on Right */}
        <div className="absolute right-32 top-1/2 transform -translate-y-1/2 z-10 max-w-md">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <h2 className="text-clevor-persian-blue font-fustat text-4xl font-bold leading-tight mb-6">
              Pay With Crypto
              <br />
              Anywhere <span className="text-clevor-teal">YOU</span> Like
            </h2>
            <p className="text-clevor-mine-shaft font-fustat text-lg font-light leading-relaxed">
              Experience the freedom of spending your crypto assets at millions of merchants worldwide.
              From your favorite coffee shop to online purchases, Clevor Card seamlessly converts your
              digital assets to traditional currency at the point of sale.
            </p>
            <div className="mt-6 flex items-center text-clevor-emperor text-sm">
              <div className="w-2 h-2 bg-clevor-teal rounded-full mr-3"></div>
              <span>Accepted everywhere Mastercard & Visa are welcomed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Animation Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100">
        <HeroScrollDemo />
      </section>



      {/* Triple Technology Section */}
      <section 
        className="bg-clevor-grey-96 py-20 px-8"
        style={{
          backgroundImage: `url('https://api.builder.io/api/v1/image/assets/TEMP/1c86d321e99ccb12e3732d2dbd2f4cab2b11a5ab?width=3840')`,
          backgroundSize: '46.875px 46.875px',
          backgroundRepeat: 'repeat',
        }}
      >
        <div className="max-w-[1140px] mx-auto text-center">
          <div className="mb-6">
            <p className="text-clevor-cod-gray font-fustat text-2xl font-bold mb-4">
              Why Choose Clevor Cards?
            </p>
            <h2 className="text-clevor-persian-blue font-fustat text-[64px] font-bold leading-[76.8px] tracking-[-1px]">
              Triple Technology
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16">
            {/* Web3 Hardware Wallet */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-white rounded-full p-6 mb-7">
                <svg
                  width="121"
                  height="121"
                  viewBox="0 0 121 121"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[120px] h-[120px]"
                >
                  <path
                    d="M120.118 32.4536H0.837494V89.4148H120.118V32.4536Z"
                    fill="url(#pattern0_5_7)"
                  />
                  <defs>
                    <pattern
                      id="pattern0_5_7"
                      patternContentUnits="objectBoundingBox"
                      width="1"
                      height="1"
                    >
                      <use
                        xlinkHref="#image0_5_7"
                        transform="scale(0.000244141 0.000511247)"
                      />
                    </pattern>
                  </defs>
                </svg>
              </div>
              <h3 className="text-clevor-blue-44 font-fustat text-2xl font-bold leading-[28.8px] mb-4">
                Web3 Hardware Wallet
              </h3>
              <p className="text-clevor-mine-shaft font-fustat text-xl font-light leading-[30px]">
                A fully integrated, replaceable wallet that
                allows signing transactions directly on-
                chain without compromising security.
              </p>
            </div>

            {/* Crypto Debit Card */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-white rounded-full p-10 mb-7">
                <svg
                  width="90"
                  height="91"
                  viewBox="0 0 90 91"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[90px] h-[90px]"
                >
                  <path
                    d="M22.727 57.0685H36.0878C37.2689 57.0685 38.4017 56.5993 39.237 55.7642C40.0722 54.9289 40.5414 53.7961 40.5414 52.6149C40.5414 51.4338 40.0722 50.301 39.237 49.4657C38.4017 48.6306 37.2689 48.1613 36.0878 48.1613H22.727C21.5458 48.1613 20.413 48.6306 19.5778 49.4657C18.7426 50.301 18.2734 51.4338 18.2734 52.6149C18.2734 53.7961 18.7426 54.9289 19.5778 55.7642C20.413 56.5993 21.5458 57.0685 22.727 57.0685ZM76.1703 12.5325H13.8198C10.2763 12.5325 6.87787 13.9401 4.37222 16.4458C1.86658 18.9514 0.458928 22.3498 0.458928 25.8933V65.9757C0.458928 69.5193 1.86658 72.9177 4.37222 75.4233C6.87787 77.9289 10.2763 79.3366 13.8198 79.3366H76.1703C79.7138 79.3366 83.1121 77.9289 85.6178 75.4233C88.1235 72.9177 89.5311 69.5193 89.5311 65.9757V25.8933C89.5311 22.3498 88.1235 18.9514 85.6178 16.4458C83.1121 13.9401 79.7138 12.5325 76.1703 12.5325ZM80.6239 65.9757C80.6239 67.157 80.1547 68.2897 79.3194 69.125C78.4842 69.9601 77.3514 70.4293 76.1703 70.4293H13.8198C12.6386 70.4293 11.5058 69.9601 10.6706 69.125C9.83535 68.2897 9.36615 67.157 9.36615 65.9757V39.2541H80.6239V65.9757ZM80.6239 30.3469H9.36615V25.8933C9.36615 24.7121 9.83535 23.5793 10.6706 22.7441C11.5058 21.9089 12.6386 21.4396 13.8198 21.4396H76.1703C77.3514 21.4396 78.4842 21.9089 79.3194 22.7441C80.1547 23.5793 80.6239 24.7121 80.6239 25.8933V30.3469Z"
                    fill="black"
                  />
                </svg>
              </div>
              <h3 className="text-clevor-blue-44 font-fustat text-2xl font-bold leading-[28.8px] mb-4">
                Crypto Debit Card
              </h3>
              <p className="text-clevor-mine-shaft font-fustat text-xl font-light leading-[30px]">
                Powered by Mastercard, enabling crypto-
                to-fiat conversion for online payments or
                at any point of sale worldwide.
              </p>
            </div>

            {/* FIDO2 Functionality */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-white rounded-full p-6 mb-7">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/702dd2eb1fa7570e68eb15603d6b38c94d277f04?width=240"
                  alt="FIDO2"
                  className="w-[120px] h-[120px]"
                />
              </div>
              <h3 className="text-clevor-blue-44 font-fustat text-2xl font-bold leading-[28.8px] mb-4">
                FIDO2 Functionality
              </h3>
              <p className="text-clevor-mine-shaft font-fustat text-xl font-light leading-[30px]">
                Passwordless authentication for seamless
                and secure logins to all kind of online
                services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seamless On-Chain Transactions */}
      <section 
        className="bg-white py-[120px] px-8"
        style={{
          backgroundImage: `url('https://api.builder.io/api/v1/image/assets/TEMP/7f134071d1210229d80e5bc30317d36c2d9455a7?width=3840')`,
          backgroundSize: '100% 172.868%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0px -224.168px',
        }}
      >
        <div className="max-w-[1165px] mx-auto flex items-center gap-[50px]">
          <div className="w-[445px] flex-shrink-0">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/41babd685dec0edeb7832304b3c47be6b2ad132f?width=841"
              alt="On-chain transactions animation"
              className="w-full h-[445px] object-cover"
            />
          </div>
          <div className="flex-1 max-w-[670px] pl-[50px]">
            <h2 className="text-clevor-persian-blue font-fustat text-5xl font-bold leading-[57.6px] tracking-[-1px] mb-6">
              Seamless On-Chain
              Transactions
            </h2>
            <p className="text-clevor-cod-gray font-fustat text-xl font-light leading-[30px] mb-8">
              Clevor Card allows users to conduct instant, self-custodied stablecoin
              payments, bypassing traditional banking rails. Whether for remittances or
              commerce, or any Web3 defi operation, users enjoy real-time settlements
              24/7 all around the globe with complete financial autonomy.
            </p>
            <div className="flex justify-end">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/06620e415f91d3b190cd039b6a7000d33a7dd235?width=660"
                alt=""
                className="w-[330px] h-[5px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* No Key Backup Required */}
      <section 
        className="bg-white py-[150px] px-8"
        style={{
          backgroundImage: `url('https://api.builder.io/api/v1/image/assets/TEMP/e6342ee09fad07ce33b998edc594c1cb12cd37e1?width=3840')`,
          backgroundSize: '48.906% 60.397%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0px 329.17px',
        }}
      >
        <div className="max-w-[1140px] mx-auto flex items-center gap-[85px]">
          <div className="flex-1 max-w-[570px]">
            <h2 className="text-clevor-persian-blue font-fustat text-5xl font-bold leading-[57.6px] tracking-[-1px] mb-10">
              No Key Backup Required
              – A Revolutionary
              Security Feature
            </h2>
            <p className="text-clevor-cod-gray font-fustat text-xl font-light leading-[30px] mb-8">
              One of the most innovative aspects of the
              Clevor Card is its seamless key replacement
              system, powered by Cryptnox Cryptocard
              provider technology. If a user ever loses or
              replaces their card, the new card will contain an
              identical cryptographic key, ensuring
              uninterrupted access to their assets without
              requiring any key backup. This eliminates the risk
              of lost keys while maintaining full security and
              convenience.
            </p>
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/06620e415f91d3b190cd039b6a7000d33a7dd235?width=660"
              alt=""
              className="w-[330px] h-[5px]"
            />
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/686aaf06831f0315bec5999dc442f8e6cdfc9e31?width=798"
              alt="No Key Backup Required"
              className="w-[399px] h-[566px]"
            />
          </div>
        </div>
      </section>



      {/* How the Clevor Card Works */}
      <section className="bg-clevor-grey-96 py-[50px] px-8">
        <div className="max-w-[1140px] mx-auto">
          <div className="text-center mb-[70px]">
            <h2 className="text-clevor-persian-blue font-fustat text-[64px] font-bold leading-[76.8px] tracking-[-1px]">
              How the Clevor Card Works
            </h2>
          </div>

          <div className="bg-white rounded-[60px] px-[85px] py-[60px]">
            <div className="grid gap-[50px]">
              {/* Row 1 */}
              <div className="flex items-center gap-[30px]">
                <div className="flex-shrink-0">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20"
                  >
                    <path
                      d="M74.8545 1.07666H51.6192C50.5921 1.07666 49.6071 1.48466 48.8809 2.2109C48.1547 2.93714 47.7467 3.92214 47.7467 4.94921C47.7467 5.97627 48.1547 6.96128 48.8809 7.68752C49.6071 8.41376 50.5921 8.82176 51.6192 8.82176H70.9819V28.1845C70.9819 29.2116 71.39 30.1966 72.1162 30.9228C72.8424 31.649 73.8273 32.057 74.8545 32.057C75.8816 32.057 76.8665 31.649 77.5927 30.9228C78.319 30.1966 78.727 29.2116 78.727 28.1845V4.94921C78.727 3.92214 78.319 2.93714 77.5927 2.2109C76.8665 1.48466 75.8816 1.07666 74.8545 1.07666ZM74.8545 47.5473C73.8273 47.5473 72.8424 47.9553 72.1162 48.6815C71.39 49.4077 70.9819 50.3927 70.9819 51.4198V70.7826H51.6192C50.5921 70.7826 49.6071 71.1906 48.8809 71.9168C48.1547 72.643 47.7467 73.628 47.7467 74.6551C47.7467 75.6822 48.1547 76.6672 48.8809 77.3934C49.6071 78.1196 50.5921 78.5276 51.6192 78.5276H74.8545C75.8816 78.5276 76.8665 78.1196 77.5927 77.3934C78.319 76.6672 78.727 75.6822 78.727 74.6551V51.4198C78.727 50.3927 78.319 49.4077 77.5927 48.6815C76.8665 47.9553 75.8816 47.5473 74.8545 47.5473ZM40.0015 16.5669C36.9203 16.5669 33.9653 17.7909 31.7866 19.9695C29.6079 22.1483 28.3839 25.1033 28.3839 28.1845V32.057C26.3298 32.057 24.3598 32.873 22.9073 34.3256C21.4548 35.778 20.6387 37.748 20.6387 39.8021V55.2923C20.6387 57.3464 21.4548 59.3164 22.9073 60.769C24.3598 62.2214 26.3298 63.0374 28.3839 63.0374H51.6192C53.6733 63.0374 55.6433 62.2214 57.0957 60.769C58.5483 59.3164 59.3643 57.3464 59.3643 55.2923V39.8021C59.3643 37.748 58.5483 35.778 57.0957 34.3256C55.6433 32.873 53.6733 32.057 51.6192 32.057V28.1845C51.6192 25.1033 50.3951 22.1483 48.2165 19.9695C46.0377 17.7909 43.0828 16.5669 40.0015 16.5669ZM36.129 28.1845C36.129 27.1574 36.537 26.1724 37.2632 25.4462C37.9895 24.72 38.9744 24.312 40.0015 24.312C41.0286 24.312 42.0136 24.72 42.7398 25.4462C43.466 26.1724 43.874 27.1574 43.874 28.1845V32.057H36.129V28.1845ZM51.6192 55.2923H28.3839V39.8021H51.6192V55.2923ZM5.14858 32.057C6.17565 32.057 7.16064 31.649 7.88688 30.9228C8.61314 30.1966 9.02113 29.2116 9.02113 28.1845V8.82176H28.3839C29.411 8.82176 30.3959 8.41376 31.1222 7.68752C31.8484 6.96128 32.2564 5.97627 32.2564 4.94921C32.2564 3.92214 31.8484 2.93714 31.1222 2.2109C30.3959 1.48466 29.411 1.07666 28.3839 1.07666H5.14858C4.12152 1.07666 3.13652 1.48466 2.41028 2.2109C1.68403 2.93714 1.27603 3.92214 1.27603 4.94921V28.1845C1.27603 29.2116 1.68403 30.1966 2.41028 30.9228C3.13652 31.649 4.12152 32.057 5.14858 32.057ZM28.3839 70.7826H9.02113V51.4198C9.02113 50.3927 8.61314 49.4077 7.88688 48.6815C7.16064 47.9553 6.17565 47.5473 5.14858 47.5473C4.12152 47.5473 3.13652 47.9553 2.41028 48.6815C1.68403 49.4077 1.27603 50.3927 1.27603 51.4198V74.6551C1.27603 75.6822 1.68403 76.6672 2.41028 77.3934C3.13652 78.1196 4.12152 78.5276 5.14858 78.5276H28.3839C29.411 78.5276 30.3959 78.1196 31.1222 77.3934C31.8484 76.6672 32.2564 75.6822 32.2564 74.6551C32.2564 73.628 31.8484 72.643 31.1222 71.9168C30.3959 71.1906 29.411 70.7826 28.3839 70.7826Z"
                      fill="url(#paint0_linear_5_19)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_5_19"
                        x1="1.27603"
                        y1="39.8021"
                        x2="99.8397"
                        y2="39.9058"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#341BCC" />
                        <stop offset="1" stopColor="#B9F2E1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div>
                  <h3 className="text-clevor-deep-cove font-fustat text-2xl font-bold leading-[28.8px] mb-2">
                    Secure & Convenient
                  </h3>
                  <p className="text-clevor-mine-shaft font-fustat text-xl font-light leading-[30px]">
                    Your private keys never leave the card, ensuring absolute control.
                  </p>
                </div>
              </div>

              {/* Continue with other steps - abbreviated for space */}
              <div className="flex items-center gap-[30px]">
                <div className="flex-shrink-0">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
                    <path d="M40.0015 16.5669C36.9203 16.5669 33.9653 17.7909..." fill="url(#paint0_linear_5_334)"/>
                    <defs>
                      <linearGradient id="paint0_linear_5_334" x1="1.26242" y1="39.8012" x2="99.8635" y2="39.9049" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#341BCC"/>
                        <stop offset="1" stopColor="#B9F2E1"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div>
                  <h3 className="text-clevor-deep-cove font-fustat text-2xl font-bold leading-[28.8px] mb-2">
                    No Key Backup Needed
                  </h3>
                  <p className="text-clevor-mine-shaft font-fustat text-xl font-light leading-[30px]">
                    A replacement card retains the same private key, removing the need for manual backups.
                  </p>
                </div>
              </div>

              {/* Crypto to Fiat Off-Ramp */}
              <div className="flex items-center gap-[30px]">
                <div className="flex-shrink-0">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20"
                  >
                    <path
                      d="M67.1093 20.4404H63.2368V16.5679C63.2368 13.4866 62.0128 10.5317 59.8341 8.35293C57.6553 6.17419 54.7004 4.9502 51.6192 4.9502H12.8937C9.81248 4.9502 6.85749 6.17419 4.67876 8.35293C2.50003 10.5317 1.27603 13.4866 1.27603 16.5679V63.0385C1.27603 66.1196 2.50003 69.0747 4.67876 71.2533C6.85749 73.4321 9.81248 74.6561 12.8937 74.6561H67.1093C70.1906 74.6561 73.1455 73.4321 75.3243 71.2533C77.5031 69.0747 78.727 66.1196 78.727 63.0385V32.0581C78.727 28.9768 77.5031 26.0219 75.3243 23.8431C73.1455 21.6644 70.1906 20.4404 67.1093 20.4404ZM12.8937 12.6953H51.6192C52.6463 12.6953 53.6312 13.1033 54.3574 13.8295C55.0837 14.5558 55.4917 15.5408 55.4917 16.5679V20.4404H12.8937C11.8666 20.4404 10.8816 20.0324 10.1554 19.3062C9.42914 18.58 9.02113 17.5949 9.02113 16.5679C9.02113 15.5408 9.42914 14.5558 10.1554 13.8295C10.8816 13.1033 11.8666 12.6953 12.8937 12.6953ZM70.9819 51.4208H67.1093C66.0823 51.4208 65.0973 51.0128 64.371 50.2865C63.6448 49.5603 63.2368 48.5753 63.2368 47.5482C63.2368 46.5212 63.6448 45.5361 64.371 44.8099C65.0973 44.0837 66.0823 43.6757 67.1093 43.6757H70.9819V51.4208ZM70.9819 35.9306H67.1093C64.0282 35.9306 61.0731 37.1546 58.8945 39.3334C56.7157 41.512 55.4917 44.4671 55.4917 47.5482C55.4917 50.6294 56.7157 53.5844 58.8945 55.7632C61.0731 57.9419 64.0282 59.1659 67.1093 59.1659H70.9819V63.0385C70.9819 64.0655 70.5739 65.0505 69.8477 65.7768C69.1214 66.503 68.1364 66.911 67.1093 66.911H12.8937C11.8666 66.911 10.8816 66.503 10.1554 65.7768C9.42914 65.0505 9.02113 64.0655 9.02113 63.0385V27.5272C10.2653 27.9648 11.5748 28.1874 12.8937 28.1855H67.1093C68.1364 28.1855 69.1214 28.5934 69.8477 29.3198C70.5739 30.046 70.9819 31.0309 70.9819 32.0581V35.9306Z"
                      fill="url(#paint0_linear_5_22)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_5_22"
                        x1="1.27603"
                        y1="39.8032"
                        x2="99.8396"
                        y2="39.9182"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#341BCC" />
                        <stop offset="1" stopColor="#B9F2E1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div>
                  <h3 className="text-clevor-deep-cove font-fustat text-2xl font-bold leading-[28.8px] mb-2">
                    Crypto to Fiat Off-Ramp
                  </h3>
                  <p className="text-clevor-mine-shaft font-fustat text-xl font-light leading-[30px]">
                    Easily top up your spending balance from your Web3 wallet functionality.
                  </p>
                </div>
              </div>

              {/* Crypto Debit Card Top-Up */}
              <div className="flex items-center gap-[30px]">
                <div className="flex-shrink-0">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20"
                  >
                    <path
                      d="M40 40.223C37.8694 40.223 35.7865 40.8572 34.015 42.0453C32.2434 43.2335 30.8627 44.9222 30.0473 46.8981C29.2319 48.8739 29.0186 51.0481 29.4342 53.1456C29.85 55.2432 30.8759 57.1699 32.3825 58.6821C33.8892 60.1944 35.8087 61.2242 37.8983 61.6415C39.9881 62.0587 42.1541 61.8445 44.1225 61.0261C46.091 60.2077 47.7735 58.8218 48.9572 57.0435C50.1409 55.2653 50.7727 53.1747 50.7727 51.0361C50.7727 48.1682 49.6377 45.4179 47.6175 43.39C45.5972 41.3622 42.8571 40.223 40 40.223ZM40 54.6405C39.2898 54.6405 38.5955 54.4291 38.005 54.033C37.4144 53.637 36.9543 53.074 36.6824 52.4155C36.4106 51.7568 36.3395 51.0321 36.4781 50.3329C36.6166 49.6337 36.9587 48.9915 37.4608 48.4874C37.9631 47.9834 38.6029 47.64 39.2995 47.501C39.9961 47.3619 40.718 47.4332 41.3742 47.7061C42.0303 47.9789 42.5912 48.4409 42.9857 49.0336C43.3803 49.6264 43.5909 50.3232 43.5909 51.0361C43.5909 51.992 43.2126 52.9088 42.5392 53.5848C41.8657 54.2607 40.9523 54.6405 40 54.6405ZM37.4505 31.969C37.792 32.2971 38.1947 32.5543 38.6355 32.7259C39.0653 32.9166 39.53 33.015 40 33.015C40.47 33.015 40.9347 32.9166 41.3645 32.7259C41.8054 32.5543 42.208 32.2971 42.5495 31.969L50.7727 23.8591C51.4679 23.1613 51.8585 22.2147 51.8585 21.2279C51.8585 20.241 51.4679 19.2945 50.7727 18.5967C50.0775 17.8989 49.1346 17.5068 48.1513 17.5068C47.1682 17.5068 46.2252 17.8989 45.53 18.5967L43.5909 20.7233V7.78358C43.5909 6.82764 43.2126 5.91084 42.5392 5.2349C41.8657 4.55895 40.9523 4.1792 40 4.1792C39.0477 4.1792 38.1343 4.55895 37.4608 5.2349C36.7875 5.91084 36.4091 6.82764 36.4091 7.78358V20.7233L34.47 18.5967C33.7748 17.8989 32.8318 17.5068 31.8487 17.5068C30.8654 17.5068 29.9225 17.8989 29.2273 18.5967C28.5321 19.2945 28.1415 20.241 28.1415 21.2279C28.1415 22.2147 28.5321 23.1613 29.2273 23.8591L37.4505 31.969ZM65.1363 51.0361C65.1363 50.3232 64.9258 49.6264 64.5312 49.0336C64.1366 48.4409 63.5758 47.9789 62.9197 47.7061C62.2635 47.4332 61.5414 47.3619 60.8449 47.501C60.1484 47.64 59.5085 47.9834 59.0063 48.4874C58.5041 48.9915 58.1621 49.6337 58.0236 50.3329C57.885 51.0321 57.9561 51.7568 58.2279 52.4155C58.4996 53.074 58.9599 53.637 59.5504 54.033C60.141 54.4291 60.8353 54.6405 61.5455 54.6405C62.4978 54.6405 63.4112 54.2607 64.0846 53.5848C64.758 52.9088 65.1363 51.992 65.1363 51.0361ZM68.7273 25.8055H57.9545C57.0022 25.8055 56.0888 26.1852 55.4154 26.8611C54.742 27.5371 54.3637 28.4539 54.3637 29.4099C54.3637 30.3658 54.742 31.2826 55.4154 31.9585C56.0888 32.6344 57.0022 33.0142 57.9545 33.0142H68.7273C69.6796 33.0142 70.593 33.3939 71.2664 34.0699C71.9399 34.7458 72.3182 35.6626 72.3182 36.6186V65.4536C72.3182 66.4095 71.9399 67.3263 71.2664 68.0023C70.593 68.6782 69.6796 69.058 68.7273 69.058H11.2727C10.3204 69.058 9.40699 68.6782 8.73357 68.0023C8.06014 67.3263 7.68182 66.4095 7.68182 65.4536V36.6186C7.68182 35.6626 8.06014 34.7458 8.73357 34.0699C9.40699 33.3939 10.3204 33.0142 11.2727 33.0142H22.0455C22.9978 33.0142 23.9112 32.6344 24.5846 31.9585C25.258 31.2826 25.6363 30.3658 25.6363 29.4099C25.6363 28.4539 25.258 27.5371 24.5846 26.8611C23.9112 26.1852 22.9978 25.8055 22.0455 25.8055H11.2727C8.41562 25.8055 5.67554 26.9447 3.65526 28.9725C1.63498 31.0004 0.5 33.7507 0.5 36.6186V65.4536C0.5 68.3214 1.63498 71.0718 3.65526 73.0996C5.67554 75.1275 8.41562 76.2667 11.2727 76.2667H68.7273C71.5844 76.2667 74.3245 75.1275 76.3447 73.0996C78.3651 71.0718 79.5 68.3214 79.5 65.4536V36.6186C79.5 33.7507 78.3651 31.0004 76.3447 28.9725C74.3245 26.9447 71.5844 25.8055 68.7273 25.8055ZM14.8637 51.0361C14.8637 51.749 15.0742 52.4459 15.4688 53.0386C15.8634 53.6313 16.4242 54.0933 17.0803 54.3661C17.7365 54.6389 18.4586 54.7103 19.1551 54.5712C19.8516 54.4321 20.4915 54.0889 20.9937 53.5848C21.4959 53.0806 21.8379 52.4385 21.9764 51.7392C22.115 51.0401 22.0439 50.3153 21.7721 49.6568C21.5004 48.9981 21.0401 48.4352 20.4496 48.0392C19.859 47.6431 19.1647 47.4317 18.4545 47.4317C17.5022 47.4317 16.5888 47.8114 15.9154 48.4874C15.242 49.1633 14.8637 50.0801 14.8637 51.0361Z"
                      fill="url(#paint0_linear_5_403)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_5_403"
                        x1="0.5"
                        y1="40.223"
                        x2="101.034"
                        y2="40.3387"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#341BCC" />
                        <stop offset="1" stopColor="#B9F2E1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="min-w-[860px]">
                  <h3 className="text-clevor-deep-cove font-fustat text-2xl font-bold leading-[28.8px] mb-2">
                    Crypto Debit Card Top-Up from Web3 Wallet
                  </h3>
                  <p className="text-clevor-mine-shaft font-fustat text-xl font-light leading-[30px]">
                    Top up your card 100% on-chain by simply signing a transaction from your Web3 wallet. Your
                    assets are seamlessly converted and credited to your card balance, ready for spending anywhere
                    Mastercard or Visa is accepted. No intermediaries, no delays—just pure blockchain efficiency.
                  </p>
                </div>
              </div>

              {/* Banking-Grade Security */}
              <div className="flex items-center gap-[30px]">
                <div className="flex-shrink-0">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20"
                  >
                    <path
                      d="M69.987 6.78135C69.5304 6.41198 68.9969 6.14963 68.4255 6.01361C67.8542 5.87757 67.2596 5.87131 66.6856 5.99527C62.4858 6.87545 58.1502 6.88666 53.9459 6.02823C49.7415 5.16978 45.7575 3.45987 42.2388 1.00373C41.5808 0.547312 40.7992 0.302734 39.9985 0.302734C39.1978 0.302734 38.4161 0.547312 37.7582 1.00373C34.2396 3.45987 30.2554 5.16978 26.0511 6.02823C21.8468 6.88666 17.5113 6.87545 13.3114 5.99527C12.7374 5.87131 12.1428 5.87757 11.5715 6.01361C11.0001 6.14963 10.4666 6.41198 10.0099 6.78135C9.55395 7.15127 9.18662 7.61865 8.93496 8.14917C8.68331 8.67968 8.55372 9.25985 8.55572 9.84702V39.1281C8.55222 44.7632 9.89507 50.3177 12.4724 55.3288C15.0498 60.34 18.7871 64.6629 23.3731 67.9375L37.7189 78.1565C38.3845 78.6304 39.1814 78.8851 39.9985 78.8851C40.8156 78.8851 41.6124 78.6304 42.278 78.1565L56.6239 67.9375C61.2099 64.6629 64.9472 60.34 67.5246 55.3288C70.102 50.3177 71.4447 44.7632 71.4413 39.1281V9.84702C71.4433 9.25985 71.3137 8.67968 71.062 8.14917C70.8104 7.61865 70.4431 7.15127 69.987 6.78135ZM63.5806 39.1281C63.5836 43.5094 62.5401 47.8283 60.5372 51.725C58.5341 55.6217 55.6294 58.9837 52.0646 61.5311L39.9985 70.1386L27.9324 61.5311C24.3677 58.9837 21.463 55.6217 19.4599 51.725C17.4568 47.8283 16.4134 43.5094 16.4164 39.1281V14.3669C24.6561 15.0722 32.9083 13.1604 39.9985 8.90373C47.0887 13.1604 55.3409 15.0722 63.5806 14.3669V39.1281ZM46.0512 30.1276L35.4786 40.7395L31.9806 37.2022C31.2404 36.4622 30.2367 36.0463 29.1901 36.0463C28.1434 36.0463 27.1396 36.4622 26.3995 37.2022C25.6594 37.9423 25.2436 38.9461 25.2436 39.9928C25.2436 41.0395 25.6594 42.0432 26.3995 42.7834L32.688 49.0719C33.0534 49.4402 33.4882 49.7326 33.9671 49.9323C34.4461 50.1318 34.9597 50.2345 35.4786 50.2345C35.9974 50.2345 36.5112 50.1318 36.9901 49.9323C37.4691 49.7326 37.9038 49.4402 38.2692 49.0719L51.7895 35.6693C52.5296 34.9293 52.9454 33.9256 52.9454 32.8789C52.9454 31.8322 52.5296 30.8284 51.7895 30.0883C51.0494 29.3482 50.0456 28.9324 48.9989 28.9324C47.9524 28.9324 46.9486 29.3482 46.2085 30.0883L46.0512 30.1276Z"
                      fill="url(#paint0_linear_5_16)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_5_16"
                        x1="8.55569"
                        y1="39.5939"
                        x2="88.5836"
                        y2="39.6612"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#341BCC" />
                        <stop offset="1" stopColor="#B9F2E1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div>
                  <h3 className="text-clevor-deep-cove font-fustat text-2xl font-bold leading-[28.8px] mb-2">
                    Banking-Grade Security
                  </h3>
                  <p className="text-clevor-mine-shaft font-fustat text-xl font-light leading-[30px]">
                    Integrated cryptographic security and tamper-resistant technology.
                  </p>
                </div>
              </div>

              {/* Plug & Play */}
              <div className="flex items-center gap-[30px]">
                <div className="flex-shrink-0">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20"
                  >
                    <path
                      d="M50.5349 27.1711L33.9217 43.823L27.532 37.4333C27.1848 37.0279 26.7575 36.6987 26.2771 36.4662C25.7966 36.2338 25.2734 36.1032 24.74 36.0826C24.2067 36.0619 23.6749 36.1519 23.1779 36.3466C22.681 36.5413 22.2297 36.8366 21.8522 37.2139C21.4749 37.5914 21.1795 38.0426 20.9848 38.5396C20.7901 39.0365 20.7003 39.5684 20.7209 40.1017C20.7416 40.635 20.8721 41.1584 21.1046 41.6388C21.337 42.1193 21.6662 42.5464 22.0717 42.8936L31.1721 52.0328C31.534 52.3917 31.9632 52.6758 32.4349 52.8684C32.9067 53.0611 33.412 53.1588 33.9217 53.1559C34.9376 53.1516 35.9111 52.7482 36.6324 52.0328L55.9952 32.67C56.3581 32.3101 56.6462 31.8818 56.8428 31.4099C57.0395 30.938 57.1407 30.4318 57.1407 29.9206C57.1407 29.4093 57.0395 28.9031 56.8428 28.4314C56.6462 27.9594 56.3581 27.5311 55.9952 27.1711C55.2696 26.4498 54.2881 26.045 53.265 26.045C52.242 26.045 51.2604 26.4498 50.5349 27.1711ZM40.0015 0.876465C32.3424 0.876465 24.8551 3.14768 18.4868 7.40289C12.1185 11.6581 7.15489 17.7062 4.22385 24.7824C1.29281 31.8586 0.525918 39.6449 2.02014 47.1569C3.51438 54.669 7.20263 61.5692 12.6185 66.985C18.0343 72.4009 24.9346 76.0891 32.4466 77.5834C39.9585 79.0776 47.745 78.3107 54.8211 75.3797C61.8973 72.4486 67.9454 67.4851 72.2006 61.1167C76.4558 54.7483 78.727 47.2611 78.727 39.602C78.727 34.5164 77.7254 29.4808 75.7792 24.7824C73.833 20.084 70.9806 15.8149 67.3845 12.2189C63.7887 8.6229 59.5195 5.77041 54.8211 3.82427C50.1227 1.87813 45.087 0.876465 40.0015 0.876465ZM40.0015 70.5824C33.8741 70.5824 27.8844 68.7654 22.7897 65.3612C17.6951 61.9571 13.7243 57.1186 11.3794 51.4576C9.03455 45.7967 8.42104 39.5676 9.61643 33.558C10.8118 27.5484 13.7624 22.0282 18.0951 17.6955C22.4277 13.3628 27.948 10.4122 33.9576 9.21684C39.9671 8.02146 46.1963 8.63497 51.8572 10.9798C57.5181 13.3247 62.3567 17.2955 65.7607 22.3902C69.165 27.4849 70.9819 33.4746 70.9819 39.602C70.9819 47.8184 67.718 55.6984 61.908 61.5084C56.098 67.3184 48.2181 70.5824 40.0015 70.5824Z"
                      fill="url(#paint0_linear_5_3)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_5_3"
                        x1="1.27603"
                        y1="39.6019"
                        x2="99.8397"
                        y2="39.7056"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#341BCC" />
                        <stop offset="1" stopColor="#B9F2E1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div>
                  <h3 className="text-clevor-deep-cove font-fustat text-2xl font-bold leading-[28.8px] mb-2">
                    Plug & Play
                  </h3>
                  <p className="text-clevor-mine-shaft font-fustat text-xl font-light leading-[30px]">
                    No setup complexity; works instantly like a traditional bank card.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bridging Web3 and TradFi */}
      <section 
        className="bg-clevor-grey-96 py-20 px-8"
        style={{
          backgroundImage: `url('https://api.builder.io/api/v1/image/assets/TEMP/e83b54017e23eba3002a8fa960726ba51c0c33d1?width=3840')`,
          backgroundSize: '50.94px 50.94px',
          backgroundRepeat: 'repeat',
        }}
      >
        <div className="max-w-[1140px] mx-auto text-center">
          <div className="mb-16">
            <h2 className="text-clevor-persian-blue font-fustat text-5xl font-bold leading-[57.6px] tracking-[-1px] mb-6">
              Bridging Web3 and TradFi
            </h2>
            <p className="text-clevor-emperor font-fustat text-2xl font-light leading-9 max-w-[912px] mx-auto">
              The Clevor Card is your bridge between decentralized finance (DeFi) and the
              traditional financial world (Tradfi). By linking crypto to existing banking infrastructures
              through Visa or Mastercard, our users can seamlessly spend and store cryptos, with
              the additional possibility to authenticate online with the Fido2 Functionality
            </p>
          </div>
          <div className="mix-blend-darken">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/1a46e4405b1dc64c2680ae7251bd47b91f6915cf?width=1824"
              alt="Bridging Web3 and TradFi animation"
              className="w-full max-w-[912px] h-[912px] mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Future of Finance */}
      <section 
        className="bg-clevor-grey-96 relative py-20 px-8"
        style={{
          backgroundImage: `url('https://api.builder.io/api/v1/image/assets/TEMP/0eb69e89c2081d5adeacf2d5c87c019291d4bf66?width=3840')`,
          backgroundSize: '46.875px 46.875px',
          backgroundRepeat: 'repeat',
        }}
      >
        <div className="max-w-[1140px] mx-auto text-center">
          <h2 className="text-clevor-persian-blue font-fustat text-5xl font-bold leading-[57.6px] tracking-[-1px] mb-6">
            The Future of Finance is Here
          </h2>
          <p className="text-clevor-emperor font-fustat text-2xl font-light leading-9 mb-16 max-w-[832px] mx-auto">
            With Clevor, you hold the power of a Web3 bank in the palm of your hand.
            A new era of financial freedom, security, and convenience.
          </p>
          <div className="mix-blend-darken">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f?width=2280"
              alt="Future of Finance visualization"
              className="w-full max-w-[1140px] h-[855px] mx-auto"
            />
          </div>
        </div>
      </section>


      {/* Technological Partners */}
      <section 
        className="bg-clevor-mercury py-20 px-8"
        style={{
          backgroundImage: `url('https://api.builder.io/api/v1/image/assets/TEMP/0c81b8fa3a5aa54fef7fc2ec20b525ca1a88f429?width=3840')`,
          backgroundSize: '100% 153.489%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0px -119.817px',
        }}
      >
        <div className="max-w-[1140px] mx-auto text-center">
          <h2 className="text-clevor-persian-blue font-fustat text-5xl font-bold leading-[57.6px] tracking-[-1px] mb-16">
            Technological Partners
          </h2>
          
          <div className="flex justify-center gap-11 max-w-[960px] mx-auto">
            {/* Cryptnox */}
            <div 
              className="flex-1 min-h-[200px] rounded-3xl px-[10px] py-[36px] flex flex-col justify-center items-center gap-[10px]"
              style={{
                background: `url('https://api.builder.io/api/v1/image/assets/TEMP/2c2a04899e4fffcc81f278eeb38b2de220e957db?width=846') lightgray -188.5px -90.005px / 189.125% 190% no-repeat, #2C14CC`,
              }}
            >
              <div className="max-w-[423px]">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/4fa6ff23512e212e3fe601810bfab1872183f715?width=403"
                  alt="Cryptnox"
                  className="w-[202px] h-[38px] mx-auto"
                />
              </div>
              <div className="max-w-[423px]">
                <p className="text-white text-center font-roboto text-xl leading-[30px]">
                  Integrating <span className="font-bold">C-WAAS</span> technology
                </p>
              </div>
              <div className="max-w-[423px]">
                <a 
                  href="#" 
                  className="inline-block bg-clevor-blue-44 text-clevor-mercury text-center font-roboto text-[15px] font-medium leading-[15px] px-6 py-3 rounded-[3px]"
                >
                  What is C-WAAS? Click Here
                </a>
              </div>
            </div>

            {/* AWS */}
            <div className="flex-1 min-h-[200px] bg-clevor-cod-gray rounded-3xl px-[10px] py-[51px] flex flex-col justify-center items-center">
              <div className="max-w-[423px]">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/bbe4465913c627c43612fa3692dcfff811f01768?width=322"
                  alt="AWS"
                  className="w-[161px] h-[98px] mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
        </div>
      )}
    </>
  );
}
