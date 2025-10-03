import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/ui/user-button";
import { useUser } from "@clerk/clerk-react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
// Import the logo
import Logo from "@/assets/logos/logo.png";

export function Header() {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-3">
          <img
            src={Logo}
            alt="Renegade Race Logo"
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="text-xl font-bold text-gray-900">Renegade</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/explore"
            className="text-sm font-medium text-gray-700 hover:text-[#EF1C25] transition-colors"
          >
            Explore
          </Link>
          <Link
            to="/match"
            className="text-sm font-medium text-gray-700 hover:text-[#EF1C25] transition-colors"
          >
            Match
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {isSignedIn ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/list-vehicle">List Your Car</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="flex flex-col space-y-2 p-4">
            <Link
              to="/explore"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#EF1C25] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              to="/match"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#EF1C25] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Match
            </Link>
            <div className="border-t pt-4 mt-4">
              {isSignedIn ? (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start mb-2"
                  >
                    <Link
                      to="/list-vehicle"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      List Your Car
                    </Link>
                  </Button>
                  <div className="px-3">
                    <UserButton />
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/sign-in" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/sign-up" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
