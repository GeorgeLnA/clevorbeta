import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <nav className="flex items-center justify-center relative">
          {/* Logo - positioned absolutely to the left */}
          <Link to="/" className="absolute left-0 flex items-center">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/feab8a74b7e886ffc0fa9cb268d85f6de2b58fca?width=860"
              alt="Clevor"
              className="h-5 w-auto"
            />
          </Link>

          {/* Navigation - centered */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`font-fustat text-lg font-medium transition-colors duration-200 ${
                location.pathname === "/"
                  ? "text-clevor-persian-blue"
                  : "text-gray-600 hover:text-clevor-persian-blue"
              }`}
            >
              Home
            </Link>
            <Link
              to="/blog"
              className={`font-fustat text-lg font-medium transition-colors duration-200 ${
                location.pathname === "/blog"
                  ? "text-clevor-persian-blue"
                  : "text-gray-600 hover:text-clevor-persian-blue"
              }`}
            >
              Blog
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
