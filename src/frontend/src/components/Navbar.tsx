import { useCart } from "@/context/CartContext";
import { type Currency, SYMBOLS, useCurrency } from "@/context/CurrencyContext";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";

const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: "NGN", label: "₦ NGN" },
  { value: "USD", label: "$ USD" },
  { value: "GBP", label: "£ GBP" },
  { value: "EUR", label: "€ EUR" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { currency, setCurrency } = useCurrency();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const routerState = useRouterState();
  const path = routerState.location.pathname;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/store", label: "Store" },
    { to: "/blog", label: "Blog" },
    { to: "/faq", label: "FAQ" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10"
      style={{ background: "rgba(9,9,9,0.92)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" data-ocid="nav.link">
            <img
              src="/assets/generated/eazykitshub-logo-transparent.dim_400x120.png"
              alt="Eazykitshub"
              className="h-9 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid="nav.link"
                className={`text-sm font-medium tracking-wide transition-colors relative group ${
                  path === link.to
                    ? "text-neon"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-neon transition-all duration-300 ${
                    path === link.to ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Currency switcher */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors px-2 py-1 rounded border border-white/20 hover:border-neon"
                data-ocid="nav.toggle"
              >
                {SYMBOLS[currency]} {currency}
                <ChevronDown className="h-3 w-3" />
              </button>
              {currencyOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-32 rounded border border-white/20 shadow-card-hover z-50"
                  style={{ background: "#111" }}
                >
                  {CURRENCY_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => {
                        setCurrency(opt.value);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors ${
                        currency === opt.value ? "text-neon" : "text-white/80"
                      }`}
                      data-ocid="nav.toggle"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative p-2" data-ocid="nav.link">
              <ShoppingCart className="h-5 w-5 text-white" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-neon text-background text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-white"
              data-ocid="nav.toggle"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t border-white/10"
          style={{ background: "#0a0a0a" }}
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.link"
                className={`block text-base font-medium py-2 border-b border-white/10 ${
                  path === link.to ? "text-neon" : "text-white/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <p className="text-xs text-white/40 mb-2">Currency</p>
              <div className="flex gap-2 flex-wrap">
                {CURRENCY_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => {
                      setCurrency(opt.value);
                    }}
                    className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                      currency === opt.value
                        ? "border-neon text-neon"
                        : "border-white/20 text-white/60 hover:border-white/40"
                    }`}
                    data-ocid="nav.toggle"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
