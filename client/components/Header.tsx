import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <nav className="flex items-center justify-center relative">
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
