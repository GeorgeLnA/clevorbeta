export default function Blog() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-clevor-persian-blue font-fustat text-5xl font-bold leading-tight mb-6">
            Clevor Blog
          </h1>
          <p className="text-clevor-emperor font-fustat text-xl leading-relaxed max-w-2xl mx-auto">
            Stay updated with the latest insights on Web3, DeFi, and the future of digital finance.
          </p>
        </div>

        <div className="grid gap-8 md:gap-12">
          {/* Blog Post 1 */}
          <article className="bg-clevor-grey-96 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h2 className="text-clevor-persian-blue font-fustat text-2xl md:text-3xl font-bold mb-4">
                  The Future of Self-Custodial Payments
                </h2>
                <p className="text-clevor-mine-shaft font-fustat text-lg leading-relaxed mb-6">
                  Discover how Clevor Card is revolutionizing the way we think about digital payments, 
                  bringing true financial sovereignty to your everyday transactions.
                </p>
                <div className="flex items-center text-clevor-emperor text-sm">
                  <span>December 15, 2024</span>
                  <span className="mx-2">•</span>
                  <span>5 min read</span>
                </div>
              </div>
              <div className="w-full md:w-48 h-32 bg-gradient-to-br from-clevor-persian-blue to-clevor-teal rounded-2xl flex items-center justify-center">
                <div className="text-white text-4xl">💳</div>
              </div>
            </div>
          </article>

          {/* Blog Post 2 */}
          <article className="bg-clevor-grey-96 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h2 className="text-clevor-persian-blue font-fustat text-2xl md:text-3xl font-bold mb-4">
                  Web3 Banking: Breaking Traditional Barriers
                </h2>
                <p className="text-clevor-mine-shaft font-fustat text-lg leading-relaxed mb-6">
                  Learn how our innovative approach to Web3 banking eliminates the need for traditional 
                  financial intermediaries while maintaining security and convenience.
                </p>
                <div className="flex items-center text-clevor-emperor text-sm">
                  <span>December 10, 2024</span>
                  <span className="mx-2">•</span>
                  <span>7 min read</span>
                </div>
              </div>
              <div className="w-full md:w-48 h-32 bg-gradient-to-br from-clevor-teal to-clevor-persian-blue rounded-2xl flex items-center justify-center">
                <div className="text-white text-4xl">🌐</div>
              </div>
            </div>
          </article>

          {/* Blog Post 3 */}
          <article className="bg-clevor-grey-96 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h2 className="text-clevor-persian-blue font-fustat text-2xl md:text-3xl font-bold mb-4">
                  FIDO2 Authentication: Passwordless Security
                </h2>
                <p className="text-clevor-mine-shaft font-fustat text-lg leading-relaxed mb-6">
                  Explore how FIDO2 technology in Clevor Card provides seamless, passwordless 
                  authentication for all your online services.
                </p>
                <div className="flex items-center text-clevor-emperor text-sm">
                  <span>December 5, 2024</span>
                  <span className="mx-2">•</span>
                  <span>4 min read</span>
                </div>
              </div>
              <div className="w-full md:w-48 h-32 bg-gradient-to-br from-clevor-persian-blue via-purple-500 to-clevor-teal rounded-2xl flex items-center justify-center">
                <div className="text-white text-4xl">🔐</div>
              </div>
            </div>
          </article>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-clevor-persian-blue to-clevor-teal rounded-3xl">
          <h3 className="text-white font-fustat text-2xl font-bold mb-4">
            Want to learn more about Clevor?
          </h3>
          <p className="text-white/90 font-fustat text-lg mb-6">
            Subscribe to our newsletter for the latest updates and insights.
          </p>
          <button className="bg-white text-clevor-persian-blue font-fustat text-lg font-medium px-8 py-3 rounded-full hover:bg-gray-100 transition-colors duration-200">
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
}
