import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrder } from "@/hooks/useQueries";
import { formatDate, formatPrice } from "@/utils/format";
import { Link, useSearch } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Package } from "lucide-react";
import { motion } from "motion/react";

export default function OrderConfirmationPage() {
  const { orderId } = useSearch({ from: "/public-layout/order-confirmation" });
  const { data: order, isLoading } = useGetOrder(orderId || "");

  return (
    <main className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6"
        >
          <CheckCircle2 className="h-10 w-10 text-green-400" />
        </motion.div>

        <p className="text-crimson font-bold text-xs tracking-[0.3em] uppercase mb-3">
          Order Placed!
        </p>
        <h1 className="font-display text-4xl md:text-5xl mb-4">Thank You!</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Your order has been confirmed and is being processed. We'll send you a
          confirmation email shortly.
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="inline-flex items-center gap-2 bg-surface-2 border border-border rounded-sm px-4 py-2 mb-8">
            <Package className="h-4 w-4 text-crimson" />
            <span className="text-sm text-muted-foreground">Order ID:</span>
            <span className="font-mono text-sm font-bold text-foreground">
              {orderId}
            </span>
          </div>
        )}

        {/* Order Details */}
        {orderId && (
          <div className="text-left bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="font-display text-xl mb-4">Order Details</h2>

            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : order ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-0.5">Customer</p>
                    <p className="font-semibold">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-0.5">Email</p>
                    <p className="font-semibold">{order.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-0.5">Status</p>
                    <p className="font-semibold capitalize text-gold">
                      {order.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-0.5">Date</p>
                    <p className="font-semibold">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border mb-4" />

                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div
                      key={`${item.jerseyId}-${item.size}-${i}`}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.jerseyName} × {Number(item.quantity)}{" "}
                        <span className="text-muted-foreground/60">
                          ({item.size})
                        </span>
                      </span>
                      <span className="font-semibold">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-border mt-4 mb-3" />

                <div className="flex justify-between font-display text-lg">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>

                <div className="mt-3 text-sm text-muted-foreground">
                  <p>Shipping to: {order.shippingAddress}</p>
                </div>
              </>
            ) : null}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="gradient-crimson text-white border-0 font-bold rounded-sm hover:opacity-90 shadow-glow"
          >
            <Link to="/store">
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-sm">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
