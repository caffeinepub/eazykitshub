import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useGetFeaturedJerseys } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Headphones,
  Heart,
  Shield,
  ShoppingCart,
  Star,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ── Static product data ──
const STATIC_JERSEYS = [
  {
    id: "s1",
    name: "Arsenal Home Jersey 2025/26",
    team: "Arsenal",
    priceCents: BigInt(1200000),
    originalCents: BigInt(1400000),
    imageUrl: "/assets/generated/jersey-red-10.dim_600x700.jpg",
    stock: 4,
    badge: "HOT",
    category: "club",
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "s2",
    name: "Chelsea Away Jersey 2025/26",
    team: "Chelsea",
    priceCents: BigInt(1150000),
    originalCents: BigInt(1350000),
    imageUrl: "/assets/generated/jersey-blue-7.dim_600x700.jpg",
    stock: 8,
    badge: "NEW",
    category: "club",
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "s3",
    name: "Nigeria Super Eagles 2026",
    team: "Nigeria",
    priceCents: BigInt(1300000),
    originalCents: BigInt(1500000),
    imageUrl: "/assets/generated/jersey-green-9.dim_600x700.jpg",
    stock: 3,
    badge: "LIMITED",
    category: "national",
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "s4",
    name: "Real Madrid Home 2025/26",
    team: "Real Madrid",
    priceCents: BigInt(1400000),
    originalCents: BigInt(1650000),
    imageUrl: "/assets/generated/jersey-black-23.dim_600x700.jpg",
    stock: 12,
    badge: "HOT",
    category: "club",
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "s5",
    name: "PSG Third Jersey 2025/26",
    team: "PSG",
    priceCents: BigInt(1100000),
    originalCents: BigInt(1300000),
    imageUrl: "/assets/generated/jersey-orange-14.dim_600x700.jpg",
    stock: 7,
    badge: "NEW",
    category: "club",
    inStock: true,
    sizes: ["M", "L", "XL", "XXL"],
  },
];

const CAROUSEL_TABS = [
  "Best Buy",
  "Trending",
  "Limited Stock",
  "Editor's Pick",
];

const REVIEWS = [
  {
    name: "Chukwuemeka A.",
    location: "Lagos, Nigeria",
    rating: 5,
    text: "The quality blew my mind. Got the Arsenal home jersey and it feels exactly like the one I saw at Old Trafford. Fast delivery too!",
    avatar: "CA",
  },
  {
    name: "James O.",
    location: "London, UK",
    rating: 5,
    text: "Ordered from London and it arrived in 9 days. The stitching is clean, the fabric is premium. 100% recommend Eazykitshub!",
    avatar: "JO",
  },
  {
    name: "Fatima B.",
    location: "Abuja, Nigeria",
    rating: 5,
    text: "Best jersey store in Nigeria, period. The Super Eagles Player Version is absolutely top-tier. Will be ordering again soon.",
    avatar: "FB",
  },
];

const LIVE_NOTIFICATIONS = [
  "Someone in Lagos just bought Arsenal Home Jersey ⚽",
  "Someone in London just bought Chelsea Away Jersey 💙",
  "Someone in Abuja just bought Nigeria Super Eagles 🇳🇬",
  "Someone in Paris just bought PSG Third Jersey 🧡",
  "Someone in Madrid just bought Real Madrid Home Jersey ⭐",
  "Someone in Accra just bought Barcelona Third Jersey 💙❤️",
];

const CLUBS = [
  "Arsenal",
  "Chelsea",
  "Man City",
  "Barcelona",
  "Real Madrid",
  "PSG",
  "Nigeria",
  "Brazil",
];

function LiveNotification() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % LIVE_NOTIFICATIONS.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="fixed bottom-24 left-4 z-40 max-w-xs"
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-neon/30 shadow-neon text-sm"
            style={{ background: "#111" }}
          >
            <span className="text-neon text-lg">📦</span>
            <span className="text-white/90">{LIVE_NOTIFICATIONS[index]}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProductCard({
  jersey,
  index,
}: { jersey: (typeof STATIC_JERSEYS)[0]; index: number }) {
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const [wishlisted, setWishlisted] = useState(false);

  const discount = Math.round(
    ((Number(jersey.originalCents) - Number(jersey.priceCents)) /
      Number(jersey.originalCents)) *
      100,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-neon/50 transition-all duration-300 hover-lift"
      style={{ background: "#111" }}
    >
      <Link to="/jersey/$id" params={{ id: jersey.id }}>
        <div className="relative overflow-hidden aspect-[3/4]">
          <img
            src={jersey.imageUrl}
            alt={jersey.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {jersey.badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neon text-black">
                {jersey.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500 text-white">
                -{discount}%
              </span>
            )}
          </div>

          {/* Stock urgency */}
          {jersey.stock <= 5 && (
            <div className="absolute bottom-3 left-3 text-xs text-red-400 font-medium">
              Only {jersey.stock} left!
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs text-white/50 mb-0.5">{jersey.team}</p>
        <p className="text-sm font-medium text-white mb-2 line-clamp-2">
          {jersey.name}
        </p>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-neon font-bold">
            {formatPrice(jersey.priceCents)}
          </span>
          <span className="text-white/30 text-xs line-through">
            {formatPrice(jersey.originalCents)}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-neon text-black hover:bg-neon/90 font-semibold text-xs"
            onClick={() =>
              addItem({
                jerseyId: jersey.id,
                jerseyName: jersey.name,
                team: jersey.team,
                size: "M",
                quantity: 1,
                unitPrice: jersey.priceCents,
                imageUrl: jersey.imageUrl,
              })
            }
            data-ocid="todo.primary_button"
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Add to Cart
          </Button>
          <button
            type="button"
            onClick={() => setWishlisted(!wishlisted)}
            className="p-2 rounded border border-white/20 hover:border-red-400 transition-colors"
            data-ocid="todo.toggle"
          >
            <Heart
              className={`h-3 w-3 transition-colors ${
                wishlisted ? "fill-red-500 text-red-500" : "text-white/50"
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── AI Jersey Finder Modal ──
function JerseyFinderModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [club, setClub] = useState("");
  const [version, setVersion] = useState("");
  const [size, setSize] = useState("");
  const [done, setDone] = useState(false);

  const reset = () => {
    setStep(1);
    setClub("");
    setVersion("");
    setSize("");
    setDone(false);
  };

  const resultJersey =
    STATIC_JERSEYS.find((j) =>
      j.team.toLowerCase().includes(club.toLowerCase()),
    ) || STATIC_JERSEYS[0];
  const { formatPrice } = useCurrency();

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          onClose();
          reset();
        }
      }}
    >
      <DialogContent
        className="max-w-md border-white/20"
        style={{ background: "#111" }}
        data-ocid="jersey_finder.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-neon tracking-wide">
            {done ? "YOUR PERFECT MATCH" : "FIND YOUR JERSEY"}
          </DialogTitle>
        </DialogHeader>

        {!done ? (
          <div className="space-y-6">
            {/* Progress */}
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    s <= step ? "bg-neon" : "bg-white/20"
                  }`}
                />
              ))}
            </div>

            {step === 1 && (
              <div>
                <p className="text-white/70 text-sm mb-4">
                  What’s your favourite club?
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {CLUBS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => {
                        setClub(c);
                        setStep(2);
                      }}
                      className={`text-xs py-2 px-1 rounded border transition-all ${
                        club === c
                          ? "border-neon text-neon bg-neon/10"
                          : "border-white/20 text-white/70 hover:border-white/40"
                      }`}
                      data-ocid="jersey_finder.button"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="text-white/70 text-sm mb-4">
                  Which version do you prefer?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {["Fans Version", "Player Version"].map((v) => (
                    <button
                      type="button"
                      key={v}
                      onClick={() => {
                        setVersion(v);
                        setStep(3);
                      }}
                      className={`py-4 rounded border text-sm font-medium transition-all ${
                        version === v
                          ? "border-neon text-neon bg-neon/10"
                          : "border-white/20 text-white/70 hover:border-white/40"
                      }`}
                      data-ocid="jersey_finder.button"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="text-white/70 text-sm mb-4">What’s your size?</p>
                <div className="grid grid-cols-5 gap-2">
                  {["S", "M", "L", "XL", "XXL"].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => {
                        setSize(s);
                        setDone(true);
                      }}
                      className={`py-3 rounded border text-sm font-bold transition-all ${
                        size === s
                          ? "border-neon text-neon bg-neon/10"
                          : "border-white/20 text-white/70 hover:border-white/40"
                      }`}
                      data-ocid="jersey_finder.button"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-4">
              <img
                src={resultJersey.imageUrl}
                alt={resultJersey.name}
                className="w-28 h-32 object-cover rounded-lg"
              />
              <div>
                <p className="text-xs text-white/50 mb-1">
                  {resultJersey.team}
                </p>
                <p className="font-medium text-white mb-1">
                  {resultJersey.name}
                </p>
                <p className="text-xs text-white/50 mb-1">
                  {version} · Size {size}
                </p>
                <p className="text-neon font-bold text-lg">
                  {formatPrice(resultJersey.priceCents)}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to="/jersey/$id"
                params={{ id: resultJersey.id }}
                onClick={() => {
                  onClose();
                  reset();
                }}
                className="flex-1"
              >
                <Button
                  className="w-full bg-neon text-black font-bold hover:bg-neon/90"
                  data-ocid="jersey_finder.primary_button"
                >
                  Shop Now
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => reset()}
                className="border-white/20"
                data-ocid="jersey_finder.secondary_button"
              >
                Retake
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Main Homepage ──
export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const carouselRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ITEMS_PER_VIEW = 4;

  useEffect(() => {
    carouselRef.current = setInterval(() => {
      setCarouselIndex(
        (prev) =>
          (prev + 1) % Math.max(1, STATIC_JERSEYS.length - ITEMS_PER_VIEW + 1),
      );
    }, 3000);
    return () => {
      if (carouselRef.current) clearInterval(carouselRef.current);
    };
  }, []);

  const pauseCarousel = () => {
    if (carouselRef.current) clearInterval(carouselRef.current);
  };
  const resumeCarousel = () => {
    carouselRef.current = setInterval(() => {
      setCarouselIndex(
        (prev) =>
          (prev + 1) % Math.max(1, STATIC_JERSEYS.length - ITEMS_PER_VIEW + 1),
      );
    }, 3000);
  };

  return (
    <main className="pt-16">
      <LiveNotification />
      <JerseyFinderModal open={quizOpen} onClose={() => setQuizOpen(false)} />

      {/* ── HERO ── */}
      <section
        className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.85) 100%), url('/assets/generated/hero-jerseys.dim_1600x700.jpg') center/cover no-repeat`,
        }}
      >
        {/* Neon grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.87 0.29 128) 1px, transparent 1px), linear-gradient(90deg, oklch(0.87 0.29 128) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 text-xs text-neon font-medium px-4 py-2 rounded-full border border-neon/30 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" />
              Based in Nigeria. Shipping Worldwide.
            </span>

            <h1 className="font-display text-[clamp(4rem,14vw,10rem)] text-white leading-none mb-4 glow-neon-text">
              WEAR THE GAME.
            </h1>
            <p className="text-xl sm:text-2xl text-white/70 mb-10 max-w-2xl mx-auto font-light">
              Rep Your Club. Own The Moment. Premium football jerseys from
              Nigeria to the world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/store">
                <Button
                  size="lg"
                  className="bg-neon text-black font-bold text-base px-10 py-6 hover:bg-neon/90 animate-pulse-neon"
                  data-ocid="hero.primary_button"
                >
                  SHOP NOW
                </Button>
              </Link>
              <Link to="/store">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-neon text-neon hover:bg-neon/10 font-bold text-base px-10 py-6"
                  data-ocid="hero.secondary_button"
                >
                  SHOP RETRO COLLECTION
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <div className="h-8 w-0.5 bg-gradient-to-b from-neon to-transparent" />
        </div>
      </section>

      {/* ── BESTSELLERS ── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="font-display text-5xl sm:text-6xl text-white mb-4">
            BEST SELLERS
          </h2>
          <div className="flex gap-2 flex-wrap">
            {CAROUSEL_TABS.map((tab, i) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`text-sm px-4 py-2 rounded-full border transition-all ${
                  activeTab === i
                    ? "border-neon text-neon bg-neon/10"
                    : "border-white/20 text-white/60 hover:border-white/40"
                }`}
                data-ocid="bestsellers.tab"
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        <div
          className="relative"
          onMouseEnter={pauseCarousel}
          onMouseLeave={resumeCarousel}
        >
          <div className="overflow-hidden">
            <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {STATIC_JERSEYS.map((jersey, i) => (
                <ProductCard key={jersey.id} jersey={jersey} index={i} />
              ))}
            </motion.div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {STATIC_JERSEYS.map((jersey, i) => (
              <button
                type="button"
                key={jersey.id}
                onClick={() => setCarouselIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === carouselIndex ? "w-6 bg-neon" : "w-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/store">
            <Button
              variant="outline"
              className="border-neon text-neon hover:bg-neon/10"
              data-ocid="bestsellers.secondary_button"
            >
              View All Jerseys
            </Button>
          </Link>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-5xl sm:text-6xl text-white mb-10"
        >
          SHOP BY CATEGORY
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              name: "Fans Version",
              desc: "Comfort fit, everyday wear.",
              icon: "👕",
              color: "#1a1a1a",
            },
            {
              name: "Player Version",
              desc: "Slim athletic fit, authentic match-grade material.",
              icon: "⚽",
              color: "#0f1f0f",
            },
            {
              name: "Retro Jerseys",
              desc: "Classic throwback designs.",
              icon: "🏆",
              color: "#1a1500",
            },
            {
              name: "Jersey Polos",
              desc: "Smart casual football fashion.",
              icon: "💔",
              color: "#1a0f0f",
            },
            {
              name: "National Teams",
              desc: "Represent your nation with pride.",
              icon: "🏁",
              color: "#0f0f1a",
            },
            {
              name: "Club Teams",
              desc: "All your favourite clubs in stock.",
              icon: "🥇",
              color: "#1a1a1a",
            },
          ].map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to="/store" data-ocid="categories.link">
                <div
                  className="group p-6 rounded-xl border border-white/10 hover:border-neon/60 transition-all duration-300 cursor-pointer hover-lift h-full"
                  style={{ background: cat.color }}
                >
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="font-display text-xl text-white mb-1 group-hover:text-neon transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-white/50">{cat.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-5xl sm:text-6xl text-white mb-10 text-center"
        >
          FANS VS PLAYER VERSION
        </motion.h2>
        <div className="rounded-xl overflow-hidden border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th
                  className="py-4 px-6 text-left text-white/50 font-medium"
                  style={{ background: "#111" }}
                >
                  Feature
                </th>
                <th
                  className="py-4 px-6 text-center font-display text-xl text-white"
                  style={{ background: "#111" }}
                >
                  Fans Version
                </th>
                <th
                  className="py-4 px-6 text-center font-display text-xl text-neon glow-neon-text"
                  style={{ background: "#0f1f0f" }}
                >
                  Player Version
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Fabric", "Polyester blend", "Authentic Dri-FIT"],
                ["Fit", "Comfort / relaxed", "Slim athletic"],
                ["Breathability", "Good", "Excellent"],
                ["Match Authenticity", "Replica", "Match-grade"],
                ["Price Tier", "₦8,000 – ₦12,000", "₦15,000 – ₦25,000"],
              ].map(([feature, fans, player], i) => (
                <tr key={feature} className={i % 2 === 0 ? "" : ""}>
                  <td
                    className="py-4 px-6 text-white/60 font-medium"
                    style={{ background: i % 2 === 0 ? "#111" : "#131313" }}
                  >
                    {feature}
                  </td>
                  <td
                    className="py-4 px-6 text-center text-white/80"
                    style={{ background: i % 2 === 0 ? "#111" : "#131313" }}
                  >
                    {fans}
                  </td>
                  <td
                    className="py-4 px-6 text-center text-neon font-medium"
                    style={{ background: i % 2 === 0 ? "#0f1f0f" : "#111a11" }}
                  >
                    {player}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-5xl sm:text-6xl text-white mb-10"
        >
          WHAT OUR CUSTOMERS SAY
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="p-6 rounded-xl border border-white/10 hover:border-neon/30 transition-colors"
              style={{ background: "#111" }}
              data-ocid={`reviews.item.${i + 1}`}
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: review.rating }, (_, s) => s).map((s) => (
                  <Star key={s} className="h-4 w-4 fill-neon text-neon" />
                ))}
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                “{review.text}”
              </p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-neon/20 border border-neon/40 flex items-center justify-center text-neon text-xs font-bold">
                  {review.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {review.name}
                  </p>
                  <p className="text-xs text-white/40">{review.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 px-4" style={{ background: "#0d0d0d" }}>
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl sm:text-6xl text-white mb-12 text-center"
          >
            WHY CHOOSE EAZYKITSHUB
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Premium Quality",
                desc: "Authentic match-grade materials",
              },
              {
                icon: <DollarSign className="h-8 w-8" />,
                title: "Affordable Pricing",
                desc: "Best prices in Nigeria",
              },
              {
                icon: <Truck className="h-8 w-8" />,
                title: "Fast Delivery",
                desc: "Nigeria 2-4 days, Global 7-14 days",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Secure Payment",
                desc: "SSL encrypted checkout",
              },
              {
                icon: <Headphones className="h-8 w-8" />,
                title: "Dedicated Support",
                desc: "WhatsApp & Email support",
              },
            ].map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-xl border border-white/10 hover:border-neon/40 transition-all group hover-lift"
                style={{ background: "#111" }}
              >
                <div className="text-neon mb-3 flex justify-center group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="font-display text-base text-white mb-1">
                  {benefit.title}
                </h3>
                <p className="text-xs text-white/40">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI JERSEY FINDER ── */}
      <section
        className="py-24 px-4 text-center"
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #0f1f0f 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-neon text-sm font-medium tracking-widest mb-3">
            PERSONALISED FOR YOU
          </p>
          <h2 className="font-display text-5xl sm:text-7xl text-white mb-4">
            FIND YOUR PERFECT JERSEY
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Answer 3 quick questions and we’ll recommend the perfect jersey for
            you.
          </p>
          <Button
            size="lg"
            onClick={() => setQuizOpen(true)}
            className="bg-neon text-black font-bold text-lg px-12 py-7 hover:bg-neon/90 animate-pulse-neon"
            data-ocid="finder.primary_button"
          >
            START QUIZ
          </Button>
        </motion.div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-20 px-4" style={{ background: "#0a0a0a" }}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-neon text-sm font-medium tracking-widest mb-3">
              EXCLUSIVE DEALS
            </p>
            <h2 className="font-display text-5xl sm:text-6xl text-white mb-3">
              GET 10% OFF YOUR FIRST ORDER
            </h2>
            <p className="text-white/50 mb-8">
              Join 10,000+ football fans worldwide. No spam, only kits.
            </p>

            {subscribed ? (
              <div className="flex items-center justify-center gap-3 text-neon">
                <CheckCircle className="h-6 w-6" />
                <span className="font-medium">
                  You’re in! Check your inbox for your discount code.
                </span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setSubscribed(true);
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-neon h-12"
                  required
                  data-ocid="newsletter.input"
                />
                <Button
                  type="submit"
                  className="bg-neon text-black font-bold h-12 px-8 hover:bg-neon/90"
                  data-ocid="newsletter.submit_button"
                >
                  SUBSCRIBE
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
