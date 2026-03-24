import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="border-t border-white/10 bg-background mt-auto">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src="/assets/generated/eazykitshub-logo-transparent.dim_400x120.png"
              alt="Eazykitshub"
              className="h-10 w-auto mb-4"
            />
            <p className="font-display text-2xl text-neon mb-2">
              Football Lives Here.
            </p>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Premium football jerseys from Nigeria to the world. Wear The Game.
            </p>
            <p className="text-xs text-white/40 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Based in Nigeria. Shipping Worldwide.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-lg text-white mb-4 tracking-wide">
              Shop
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/store", label: "All Jerseys" },
                { to: "/store?category=club", label: "Club Jerseys" },
                { to: "/store?category=national", label: "National Teams" },
                { to: "/store?category=retro", label: "Retro Collection" },
                { to: "/store?category=polo", label: "Jersey Polos" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to as "/"}
                    className="text-sm text-white/50 hover:text-neon transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-display text-lg text-white mb-4 tracking-wide">
              Help
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/faq", label: "FAQ" },
                { to: "/shipping", label: "Shipping Policy" },
                { to: "/returns", label: "Returns & Exchanges" },
                { to: "/size-guide", label: "Size Guide" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to as "/"}
                    className="text-sm text-white/50 hover:text-neon transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display text-lg text-white mb-4 tracking-wide">
              Connect
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/2348134445712"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/50 hover:text-neon transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  +234 813 444 5712
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/Eazykitshub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/50 hover:text-neon transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  @Eazykitshub
                </a>
              </li>
              <li>
                <a
                  href="mailto:Eazykits007@gmail.com"
                  className="flex items-center gap-2 text-sm text-white/50 hover:text-neon transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Eazykits007@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/30">
            &copy; {year} Eazykitshub. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neon transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
