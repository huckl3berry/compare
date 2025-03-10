import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart3, Info, Home, Settings, Menu, X } from 'lucide-react';
import AuthModal from './AuthModal';
import { Button } from './ui/button';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        scrolled 
          ? "py-3 bg-white/80 backdrop-blur-lg border-b border-border/50 shadow-sm" 
          : "py-5 bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between">
        <NavLink 
          to="/" 
          className="flex items-center gap-2 text-xl font-medium tracking-tight transition-opacity hover:opacity-80"
        >
          <BarChart3 className="h-6 w-6 text-primary" />
          <span className="text-foreground">COMpare</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {[
            { to: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
            { to: "/about", label: "About", icon: <Info className="h-4 w-4" /> },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
              end={item.to === "/"}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
          
          {user ? (
            <Button 
              variant="outline" 
              onClick={() => signOut()}
              className="ml-2"
            >
              Sign Out
            </Button>
          ) : (
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="ml-2"
            >
              Sign In
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div 
          className={cn(
            "fixed top-[61px] inset-x-0 p-4 transition-transform duration-300 ease-in-out",
            mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="glass-card rounded-xl overflow-hidden shadow-lg animate-fade-in">
            <nav className="flex flex-col gap-1 p-2">
              {[
                { to: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
                { to: "/about", label: "About", icon: <Info className="h-4 w-4" /> },
              ].map((item, index) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => cn(
                    "flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                    "animate-slide-down"
                  )}
                  style={{ '--index': index } as React.CSSProperties}
                  onClick={() => setMobileMenuOpen(false)}
                  end={item.to === "/"}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
              
              {user ? (
                <Button 
                  variant="outline" 
                  onClick={() => signOut()}
                  className="mt-2"
                >
                  Sign Out
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="mt-2"
                >
                  Sign In
                </Button>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
      />
    </header>
  );
};

export default Navbar;
