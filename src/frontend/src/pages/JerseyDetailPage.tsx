import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useGetJersey } from "@/hooks/useQueries";
import { Link, useParams } from "@tanstack/react-router";
import {
  Award,
  ChevronRight,
  Heart,
  MessageCircle,
  Package,
  RotateCcw,
  Ruler,
  Shield,
  ShoppingCart,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const STATIC_JERSEYS: Record<
  string,
  {
    id: string;
    name: string;
    team: string;
    priceCents: bigint;
    imageUrl: string;
    inStock: boolean;
    sizes: string[];
    description: string;
  }
> = {
  s1: {
    id: "s1",
    name: "Arsenal Home Jersey 2025/26",
    team: "Arsenal",
    priceCents: BigInt(1200000),
    imageUrl: "/assets/generated/jersey-red-10.dim_600x700.jpg",
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "The iconic Arsenal home jersey for the 2025/26 season. Made with premium breathable fabric, featuring the classic red and white design. Available in Fans Version for everyday wear and Player Version for match-day authenticity.",
  },
  s2: {
    id: "s2",
    name: "Chelsea Away Jersey 2025/26",
    team: "Chelsea",
    priceCents: BigInt(1150000),
    imageUrl: "/assets/generated/jersey-blue-7.dim_600x700.jpg",
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    description:
      "Chelsea's stunning away jersey for 2025/26. Clean design with premium materials.",
  },
  s3: {
    id: "s3",
    name: "Nigeria Super Eagles 2026",
    team: "Nigeria",
    priceCents: BigInt(1300000),
    imageUrl: "/assets/generated/jersey-green-9.dim_600x700.jpg",
    inStock: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Rep Nigeria with the official Super Eagles jersey for AFCON 2026. Premium quality, authentic design.",
  },
  s4: {
    id: "s4",
    name: "Real Madrid Home 2025/26",
    team: "Real Madrid",
    priceCents: BigInt(1400000),
    imageUrl: "/assets/generated/jersey-black-23.dim_600x700.jpg",
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    description:
      "Real Madrid's iconic home jersey for the 2025/26 season. Champions League edition.",
  },
  s5: {
    id: "s5",
    name: "PSG Third Jersey 2025/26",
    team: "PSG",
    priceCents: BigInt(1100000),
    imageUrl: "/assets/generated/jersey-orange-14.dim_600x700.jpg",
    inStock: true,
    sizes: ["M", "L", "XL", "XXL"],
    description:
      "PSG's bold third jersey for 2025/26. Eye-catching design with premium construction.",
  },
};

const RELATED = [
  {
    id: "s2",
    name: "Chelsea Away",
    imageUrl: "/assets/generated/jersey-blue-7.dim_600x700.jpg",
    priceCents: BigInt(1150000),
  },
  {
    id: "s3",
    name: "Nigeria Eagles",
    imageUrl: "/assets/generated/jersey-green-9.dim_600x700.jpg",
    priceCents: BigInt(1300000),
  },
  {
    id: "s4",
    name: "Real Madrid",
    imageUrl: "/assets/generated/jersey-black-23.dim_600x700.jpg",
    priceCents: BigInt(1400000),
  },
];

function SizeChartModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg border-white/20"
        style={{ background: "#111" }}
        data-ocid="size_chart.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-white tracking-wide">
            SIZE GUIDE
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="py-2 px-3 text-left text-white/50">Size</th>
                <th className="py-2 px-3 text-center text-white/50">
                  Chest (cm)
                </th>
                <th className="py-2 px-3 text-center text-white/50">
                  Waist (cm)
                </th>
                <th className="py-2 px-3 text-center text-white/50">
                  Hip (cm)
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["S", "86-91", "71-76", "86-91"],
                ["M", "91-96", "76-81", "91-96"],
                ["L", "96-101", "81-86", "96-101"],
                ["XL", "101-107", "86-91", "101-107"],
                ["XXL", "107-114", "91-97", "107-114"],
              ].map(([size, chest, waist, hip]) => (
                <tr key={size} className="border-b border-white/10">
                  <td className="py-3 px-3 font-bold text-neon">{size}</td>
                  <td className="py-3 px-3 text-center text-white/80">
                    {chest}
                  </td>
                  <td className="py-3 px-3 text-center text-white/80">
                    {waist}
                  </td>
                  <td className="py-3 px-3 text-center text-white/80">{hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-white/40 mt-2">
          Measurements are in centimetres. For a comfortable fit, choose your
          size based on chest measurement.
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default function JerseyDetailPage() {
  const { id } = useParams({ from: "/public-layout/jersey/$id" });
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState("");
  const [version, setVersion] = useState<"fans" | "player">("fans");
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [zoom, setZoom] = useState(false);

  const { data: backendJersey, isLoading } = useGetJersey(id);

  const jersey = backendJersey ?? STATIC_JERSEYS[id];
  const imageUrl = backendJersey?.imageId
    ? backendJersey.imageId.getDirectURL()
    : (STATIC_JERSEYS[id]?.imageUrl ??
      "/assets/generated/jersey-blue-7.dim_600x700.jpg");

  const basePriceCents = jersey?.priceCents ?? BigInt(1200000);
  const adjustedPrice =
    version === "player" ? basePriceCents + BigInt(500000) : basePriceCents;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!jersey) return;
    addItem({
      jerseyId: jersey.id,
      jerseyName: jersey.name,
      team: jersey.team,
      size: selectedSize,
      quantity,
      unitPrice: adjustedPrice,
      imageUrl,
    });
    toast.success(`Added ${jersey.name} (${selectedSize}) to cart!`);
  };

  if (isLoading && !STATIC_JERSEYS[id]) {
    return (
      <main className="pt-20 max-w-7xl mx-auto px-4 py-12">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          data-ocid="product.loading_state"
        >
          <Skeleton className="aspect-[3/4] w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (!jersey) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center" data-ocid="product.error_state">
          <p className="font-display text-4xl text-white/30">
            JERSEY NOT FOUND
          </p>
          <Link to="/store">
            <Button className="mt-4 bg-neon text-black">Back to Store</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen">
      <SizeChartModal
        open={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-white/40 mb-8">
          <Link to="/" className="hover:text-neon transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/store" className="hover:text-neon transition-colors">
            Store
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white/60">{jersey.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            <div
              className={`relative rounded-xl overflow-hidden border border-white/10 cursor-zoom-in aspect-[3/4] ${
                zoom
                  ? "fixed inset-4 z-50 cursor-zoom-out aspect-auto rounded-2xl"
                  : ""
              }`}
              onClick={() => setZoom(!zoom)}
              onKeyDown={(e) => e.key === "Enter" && setZoom(!zoom)}
              style={{ background: "#111" }}
            >
              {zoom && <div className="absolute inset-0 bg-black/80 z-[-1]" />}
              <img
                src={imageUrl}
                alt={jersey.name}
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  zoom ? "scale-110" : "hover:scale-105"
                }`}
              />
              <div className="absolute top-3 right-3 bg-black/50 text-white/50 text-xs px-2 py-1 rounded">
                {zoom ? "Click to close" : "Click to zoom"}
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <p className="text-neon text-sm font-medium tracking-widest mb-1">
                {jersey.team}
              </p>
              <h1 className="font-display text-4xl sm:text-5xl text-white mb-3">
                {jersey.name}
              </h1>
              <p className="text-3xl font-bold text-neon mb-2">
                {formatPrice(adjustedPrice)}
              </p>
              <p className="text-white/50 text-sm">{jersey.description}</p>
            </div>

            {/* Version selector */}
            <div>
              <p className="text-sm font-medium text-white/70 mb-2">Version</p>
              <div className="flex gap-3">
                {(["fans", "player"] as const).map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setVersion(v)}
                    className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all capitalize ${
                      version === v
                        ? "border-neon text-neon bg-neon/10"
                        : "border-white/20 text-white/60 hover:border-white/40"
                    }`}
                    data-ocid="product.toggle"
                  >
                    {v === "fans" ? "Fans Version" : "Player Version"}
                    {v === "player" && (
                      <span className="block text-xs mt-0.5 opacity-70">
                        +₦5,000
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-white/70">Size</p>
                <button
                  type="button"
                  onClick={() => setSizeChartOpen(true)}
                  className="text-xs text-neon hover:underline flex items-center gap-1"
                  data-ocid="product.button"
                >
                  <Ruler className="h-3 w-3" /> View Size Guide
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(jersey.sizes ?? ["S", "M", "L", "XL", "XXL"]).map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 w-12 rounded border text-sm font-bold transition-all ${
                      selectedSize === size
                        ? "border-neon text-neon bg-neon/10"
                        : "border-white/20 text-white/60 hover:border-white/40"
                    }`}
                    data-ocid="product.button"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-sm font-medium text-white/70 mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-9 w-9 rounded border border-white/20 text-white hover:border-neon transition-colors flex items-center justify-center"
                  data-ocid="product.button"
                >
                  -
                </button>
                <span className="text-white font-bold w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-9 w-9 rounded border border-white/20 text-white hover:border-neon transition-colors flex items-center justify-center"
                  data-ocid="product.button"
                >
                  +
                </button>
              </div>
            </div>

            {/* Bundle offer */}
            <div className="p-3 rounded-lg border border-neon/30 bg-neon/5 text-sm">
              <span className="text-neon font-medium">🎉 Bundle Offer: </span>
              <span className="text-white/70">
                Buy 2 jerseys and get 15% off your order!
              </span>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!jersey.inStock}
                className="flex-1 bg-neon text-black font-bold text-base hover:bg-neon/90 h-14"
                data-ocid="product.primary_button"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {jersey.inStock ? "ADD TO CART" : "OUT OF STOCK"}
              </Button>
              <button
                type="button"
                onClick={() => setWishlisted(!wishlisted)}
                className="h-14 w-14 rounded-lg border border-white/20 hover:border-red-400 transition-colors flex items-center justify-center"
                data-ocid="product.toggle"
              >
                <Heart
                  className={`h-5 w-5 ${wishlisted ? "fill-red-500 text-red-500" : "text-white/50"}`}
                />
              </button>
            </div>

            {/* WhatsApp order */}
            <a
              href={`https://wa.me/2348134445712?text=Hi! I want to order ${encodeURIComponent(jersey.name)} - Size ${selectedSize || "TBD"} (${version === "player" ? "Player" : "Fans"} Version)`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-green-500/40 text-green-400 hover:bg-green-500/10 transition-colors text-sm font-medium"
              data-ocid="product.button"
            >
              <MessageCircle className="h-4 w-4" />
              Order via WhatsApp
            </a>

            {/* Delivery estimate */}
            <div
              className="p-4 rounded-lg border border-white/10"
              style={{ background: "#111" }}
            >
              <p className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Package className="h-4 w-4 text-neon" /> Delivery Estimate
              </p>
              <div className="space-y-1 text-xs text-white/50">
                <p>🇳🇬 Nigeria: 2–4 business days</p>
                <p>🌍 Africa: 5–10 business days</p>
                <p>🌎 Worldwide: 7–14 business days</p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex gap-4 flex-wrap">
              {[
                {
                  icon: <Shield className="h-4 w-4" />,
                  text: "Secure Payment",
                },
                {
                  icon: <RotateCcw className="h-4 w-4" />,
                  text: "14-Day Returns",
                },
                {
                  icon: <Award className="h-4 w-4" />,
                  text: "Authentic Quality",
                },
              ].map((badge) => (
                <div
                  key={badge.text}
                  className="flex items-center gap-1.5 text-xs text-white/50"
                >
                  <span className="text-neon">{badge.icon}</span>
                  {badge.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Complete The Look */}
        <section className="mt-20">
          <h2 className="font-display text-4xl text-white mb-8">
            COMPLETE THE LOOK
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {RELATED.filter((r) => r.id !== id)
              .slice(0, 3)
              .map((r, i) => (
                <Link
                  key={r.id}
                  to="/jersey/$id"
                  params={{ id: r.id }}
                  data-ocid={`related.item.${i + 1}`}
                >
                  <div
                    className="group rounded-xl overflow-hidden border border-white/10 hover:border-neon/40 transition-all hover-lift"
                    style={{ background: "#111" }}
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={r.imageUrl}
                        alt={r.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-white font-medium">{r.name}</p>
                      <p className="text-neon text-sm font-bold">
                        {formatPrice(r.priceCents)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>

      {/* Sticky mobile CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 p-4 border-t border-white/10 backdrop-blur-md md:hidden"
        style={{ background: "rgba(10,10,10,0.95)" }}
      >
        <Button
          onClick={handleAddToCart}
          disabled={!jersey.inStock}
          className="w-full bg-neon text-black font-bold h-13 text-base hover:bg-neon/90"
          data-ocid="product.primary_button"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {selectedSize
            ? `ADD TO CART — ${formatPrice(adjustedPrice)}`
            : "SELECT A SIZE"}
        </Button>
      </div>
    </main>
  );
}
