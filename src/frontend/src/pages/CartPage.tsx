import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { motion } from "motion/react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } =
    useCart();
  const { formatPrice } = useCurrency();

  const hasBundleDiscount = totalItems >= 2;
  const discountAmount = hasBundleDiscount
    ? (totalPrice * BigInt(15)) / BigInt(100)
    : BigInt(0);
  const finalTotal = totalPrice - discountAmount;

  if (items.length === 0) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          data-ocid="cart.empty_state"
        >
          <ShoppingBag className="h-16 w-16 text-white/20 mx-auto mb-4" />
          <h1 className="font-display text-5xl text-white mb-3">
            YOUR CART IS EMPTY
          </h1>
          <p className="text-white/50 mb-8">
            Looks like you haven’t added any jerseys yet.
          </p>
          <Link to="/store">
            <Button
              className="bg-neon text-black font-bold px-10 hover:bg-neon/90"
              data-ocid="cart.primary_button"
            >
              Shop Now
            </Button>
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-6xl text-white mb-8"
        >
          YOUR CART
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={`${item.jerseyId}-${item.size}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                style={{ background: "#111" }}
                data-ocid={`cart.item.${i + 1}`}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.jerseyName}
                    className="h-24 w-20 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/50 mb-0.5">{item.team}</p>
                  <p className="text-sm font-medium text-white mb-0.5 truncate">
                    {item.jerseyName}
                  </p>
                  <p className="text-xs text-white/40 mb-2">
                    Size: {item.size}
                  </p>
                  <p className="text-neon font-bold">
                    {formatPrice(item.unitPrice * BigInt(item.quantity))}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    type="button"
                    onClick={() => removeItem(item.jerseyId, item.size)}
                    className="p-1.5 text-white/30 hover:text-red-400 transition-colors"
                    data-ocid={`cart.delete_button.${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.jerseyId,
                          item.size,
                          item.quantity - 1,
                        )
                      }
                      className="h-7 w-7 rounded border border-white/20 text-white hover:border-neon transition-colors flex items-center justify-center"
                      data-ocid={`cart.button.${i + 1}`}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-white text-sm w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.jerseyId,
                          item.size,
                          item.quantity + 1,
                        )
                      }
                      className="h-7 w-7 rounded border border-white/20 text-white hover:border-neon transition-colors flex items-center justify-center"
                      data-ocid={`cart.button.${i + 1}`}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Bundle prompt */}
            {!hasBundleDiscount && (
              <div className="p-4 rounded-xl border border-neon/30 bg-neon/5 text-sm">
                <span className="text-neon font-medium">
                  💬 Add 1 more jersey
                </span>
                <span className="text-white/70">
                  {" "}
                  to unlock 15% bundle discount!
                </span>
              </div>
            )}
            {hasBundleDiscount && (
              <div
                className="p-4 rounded-xl border border-neon/30 bg-neon/10 text-sm"
                data-ocid="cart.success_state"
              >
                <span className="text-neon font-medium">
                  🎉 15% bundle discount applied!
                </span>
                <span className="text-white/70">
                  {" "}
                  You’re saving {formatPrice(discountAmount)}
                </span>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-xl border border-white/10 sticky top-24"
              style={{ background: "#111" }}
            >
              <h2 className="font-display text-2xl text-white mb-6">
                ORDER SUMMARY
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="text-white">{formatPrice(totalPrice)}</span>
                </div>
                {hasBundleDiscount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neon">Bundle Discount (15%)</span>
                    <span className="text-neon">
                      -{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Shipping</span>
                  <span className="text-white/60">Calculated at checkout</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-white font-medium">Total</span>
                  <span className="text-neon font-bold text-lg">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>
              <Link to="/checkout">
                <Button
                  className="w-full bg-neon text-black font-bold h-12 hover:bg-neon/90 text-base"
                  data-ocid="cart.primary_button"
                >
                  Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/store" className="block mt-3">
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white/60 hover:border-neon hover:text-neon"
                  data-ocid="cart.secondary_button"
                >
                  Continue Shopping
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
