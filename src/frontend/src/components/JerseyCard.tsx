import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/format";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { Jersey } from "../backend.d";
import JerseyPlaceholder from "./JerseyPlaceholder";

interface JerseyCardProps {
  jersey: Jersey;
  index?: number;
}

export default function JerseyCard({ jersey, index = 0 }: JerseyCardProps) {
  const imageUrl = jersey.imageId?.getDirectURL();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Link to="/jersey/$id" params={{ id: jersey.id }} className="group block">
        <div className="card-hover shine-effect rounded-lg overflow-hidden border border-border bg-card shadow-card">
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-surface-2">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={jersey.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <JerseyPlaceholder team={jersey.team} className="w-full h-full" />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {jersey.featured && (
                <Badge className="bg-gold text-accent-foreground text-xs font-bold">
                  Featured
                </Badge>
              )}
              {!jersey.inStock && (
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-crimson mb-1">
              {jersey.team}
            </p>
            <h3 className="font-display text-base font-bold text-foreground leading-tight mb-2 line-clamp-2">
              {jersey.name}
            </h3>
            <div className="flex items-center justify-between">
              <span className="font-display text-xl text-foreground">
                {formatPrice(jersey.priceCents)}
              </span>
              <span className="text-xs text-muted-foreground">
                {jersey.sizes.length} sizes
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
