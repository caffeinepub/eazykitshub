import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useGetAllJerseys } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { Heart, Search, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const CATEGORIES = ["All", "Club", "National", "Retro", "Polo"];

const STATIC_STORE = [
  {
    id: "s1",
    name: "Arsenal Home Jersey 2025/26",
    team: "Arsenal",
    priceCents: BigInt(1200000),
    imageUrl: "/assets/generated/jersey-red-10.dim_600x700.jpg",
    inStock: true,
    featured: true,
    badge: "HOT",
    category: "Club",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Official Arsenal Home Jersey",
  },
  {
    id: "s2",
    name: "Chelsea Away Jersey 2025/26",
    team: "Chelsea",
    priceCents: BigInt(1150000),
    imageUrl: "/assets/generated/jersey-blue-7.dim_600x700.jpg",
    inStock: true,
    featured: false,
    badge: "NEW",
    category: "Club",
    sizes: ["S", "M", "L", "XL"],
    description: "Chelsea Away Kit",
  },
  {
    id: "s3",
    name: "Nigeria Super Eagles 2026",
    team: "Nigeria",
    priceCents: BigInt(1300000),
    imageUrl: "/assets/generated/jersey-green-9.dim_600x700.jpg",
    inStock: true,
    featured: true,
    badge: "LIMITED",
    category: "National",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Super Eagles AFCON Jersey",
  },
  {
    id: "s4",
    name: "Real Madrid Home 2025/26",
    team: "Real Madrid",
    priceCents: BigInt(1400000),
    imageUrl: "/assets/generated/jersey-black-23.dim_600x700.jpg",
    inStock: true,
    featured: true,
    badge: "HOT",
    category: "Club",
    sizes: ["S", "M", "L", "XL"],
    description: "Real Madrid UCL Edition",
  },
  {
    id: "s5",
    name: "PSG Third Jersey 2025/26",
    team: "PSG",
    priceCents: BigInt(1100000),
    imageUrl: "/assets/generated/jersey-orange-14.dim_600x700.jpg",
    inStock: true,
    featured: false,
    badge: "NEW",
    category: "Club",
    sizes: ["M", "L", "XL", "XXL"],
    description: "PSG Third Kit",
  },
  {
    id: "s6",
    name: "Brazil Retro 1970 World Cup",
    team: "Brazil",
    priceCents: BigInt(1800000),
    imageUrl: "/assets/generated/jersey-green-9.dim_600x700.jpg",
    inStock: true,
    featured: false,
    badge: "RETRO",
    category: "Retro",
    sizes: ["S", "M", "L", "XL"],
    description: "Classic Pele era Brazil kit",
  },
  {
    id: "s7",
    name: "Barcelona Third Jersey",
    team: "Barcelona",
    priceCents: BigInt(1250000),
    imageUrl: "/assets/generated/jersey-blue-7.dim_600x700.jpg",
    inStock: true,
    featured: false,
    badge: "NEW",
    category: "Club",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Barca Third Kit 2025",
  },
  {
    id: "s8",
    name: "Man City Home 2025/26",
    team: "Man City",
    priceCents: BigInt(1350000),
    imageUrl: "/assets/generated/jersey-blue-7.dim_600x700.jpg",
    inStock: false,
    featured: false,
    badge: "PRE-ORDER",
    category: "Club",
    sizes: ["S", "M", "L", "XL"],
    description: "City Sky Blue Home Kit",
  },
];

function JerseyCardSkeleton() {
  return (
    <div
      className="rounded-xl overflow-hidden border border-white/10"
      style={{ background: "#111" }}
    >
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();

  const { data: backendJerseys, isLoading } = useGetAllJerseys();

  const jerseys = useMemo(() => {
    if (backendJerseys && backendJerseys.length > 0) {
      return backendJerseys.map((j) => ({
        id: j.id,
        name: j.name,
        team: j.team,
        priceCents: j.priceCents,
        imageUrl: j.imageId
          ? j.imageId.getDirectURL()
          : "/assets/generated/jersey-blue-7.dim_600x700.jpg",
        inStock: j.inStock,
        featured: j.featured,
        badge: j.featured ? "FEATURED" : "",
        category: "Club",
        sizes: j.sizes,
        description: j.description,
      }));
    }
    return STATIC_STORE;
  }, [backendJerseys]);

  const filtered = useMemo(() => {
    return jerseys.filter((j) => {
      const matchCat =
        activeCategory === "All" || j.category === activeCategory;
      const matchSearch =
        !search ||
        j.name.toLowerCase().includes(search.toLowerCase()) ||
        j.team.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [jerseys, activeCategory, search]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const badgeColor: Record<string, string> = {
    HOT: "bg-red-500",
    NEW: "bg-neon text-black",
    LIMITED: "bg-orange-500",
    RETRO: "bg-purple-500",
    FEATURED: "bg-yellow-500 text-black",
    "PRE-ORDER": "bg-blue-500",
  };

  return (
    <main className="pt-20 min-h-screen">
      {/* Header */}
      <section
        className="py-12 px-4"
        style={{ background: "linear-gradient(to bottom, #0d0d0d, #0a0a0a)" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-neon text-sm font-medium tracking-widest mb-2">
              THE COLLECTION
            </p>
            <h1 className="font-display text-6xl sm:text-7xl text-white mb-6">
              ALL JERSEYS
            </h1>
            <p className="text-white/50 max-w-xl">
              Premium football jerseys for every fan. Fans Version & Player
              Version available.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div
        className="sticky top-16 z-30 border-b border-white/10 backdrop-blur-md"
        style={{ background: "rgba(10,10,10,0.95)" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap text-sm px-4 py-1.5 rounded-full border transition-all ${
                  activeCategory === cat
                    ? "border-neon text-neon bg-neon/10"
                    : "border-white/20 text-white/60 hover:border-white/40"
                }`}
                data-ocid="store.tab"
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search jerseys..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-neon h-9 text-sm"
              data-ocid="store.search_input"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {isLoading ? (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            data-ocid="store.loading_state"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <JerseyCardSkeleton key={n} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" data-ocid="store.empty_state">
            <p className="font-display text-3xl text-white/30 mb-2">
              NO JERSEYS FOUND
            </p>
            <p className="text-white/30 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((jersey, i) => (
              <motion.div
                key={jersey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-neon/50 transition-all duration-300 hover-lift"
                style={{ background: "#111" }}
                data-ocid={`store.item.${i + 1}`}
              >
                <Link to="/jersey/$id" params={{ id: jersey.id }}>
                  <div className="relative overflow-hidden aspect-[3/4]">
                    <img
                      src={jersey.imageUrl}
                      alt={jersey.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {jersey.badge && (
                      <span
                        className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded ${badgeColor[jersey.badge] ?? "bg-white/20"} text-white`}
                      >
                        {jersey.badge}
                      </span>
                    )}
                    {!jersey.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-xs font-bold px-3 py-1 border border-white/40 text-white/60 rounded">
                          OUT OF STOCK
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <p className="text-xs text-white/50 mb-0.5">{jersey.team}</p>
                  <p className="text-sm font-medium text-white mb-2 line-clamp-2">
                    {jersey.name}
                  </p>
                  <p className="text-neon font-bold mb-3">
                    {formatPrice(jersey.priceCents)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={!jersey.inStock}
                      className="flex-1 bg-neon text-black hover:bg-neon/90 font-semibold text-xs disabled:opacity-40"
                      onClick={() =>
                        addItem({
                          jerseyId: jersey.id,
                          jerseyName: jersey.name,
                          team: jersey.team,
                          size: jersey.sizes[0] ?? "M",
                          quantity: 1,
                          unitPrice: jersey.priceCents,
                          imageUrl: jersey.imageUrl,
                        })
                      }
                      data-ocid={`store.primary_button.${i + 1}`}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      {jersey.inStock ? "Add to Cart" : "Sold Out"}
                    </Button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(jersey.id)}
                      className="p-2 rounded border border-white/20 hover:border-red-400 transition-colors"
                      data-ocid={`store.toggle.${i + 1}`}
                    >
                      <Heart
                        className={`h-3 w-3 ${
                          wishlist.has(jersey.id)
                            ? "fill-red-500 text-red-500"
                            : "text-white/50"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
