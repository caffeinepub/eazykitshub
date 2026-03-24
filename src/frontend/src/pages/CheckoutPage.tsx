import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useSubmitOrder } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import {
  Building,
  CheckCircle,
  CreditCard,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

type PaymentMethod = "card" | "bank" | "whatsapp";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, totalItems } = useCart();
  const { formatPrice } = useCurrency();
  const submitOrder = useSubmitOrder();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "Nigeria",
  });
  const [payment, setPayment] = useState<PaymentMethod>("card");

  const hasBundleDiscount = totalItems >= 2;
  const discountAmount = hasBundleDiscount
    ? (totalPrice * BigInt(15)) / BigInt(100)
    : BigInt(0);
  const finalTotal = totalPrice - discountAmount;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const buildWhatsAppMessage = () => {
    const orderLines = items
      .map(
        (i) =>
          `- ${i.jerseyName} (${i.size}) x${i.quantity} = ${formatPrice(i.unitPrice * BigInt(i.quantity))}`,
      )
      .join("%0A");
    return `Hi Eazykitshub!%0A%0ANew Order:%0A${orderLines}%0A%0ATotal: ${formatPrice(finalTotal)}%0A%0AName: ${form.name}%0APhone: ${form.phone}%0AAddress: ${form.address}, ${form.country}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (payment === "whatsapp") {
      window.open(
        `https://wa.me/2348134445712?text=${buildWhatsAppMessage()}`,
        "_blank",
      );
      clearCart();
      navigate({
        to: "/order-confirmation",
        search: { orderId: `WA-${Date.now()}` },
      });
      return;
    }

    try {
      const orderId = await submitOrder.mutateAsync({
        customerName: form.name,
        customerEmail: form.email,
        shippingAddress: `${form.address}, ${form.country}`,
        items: items.map((i) => ({
          jerseyId: i.jerseyId,
          jerseyName: i.jerseyName,
          size: i.size,
          quantity: BigInt(i.quantity),
          unitPrice: i.unitPrice,
        })),
      });
      clearCart();
      navigate({ to: "/order-confirmation", search: { orderId } });
    } catch {
      toast.error(
        "Failed to place order. Please try again or order via WhatsApp.",
      );
    }
  };

  return (
    <main className="pt-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-6xl text-white mb-8"
        >
          CHECKOUT
        </motion.h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact info */}
              <div
                className="p-6 rounded-xl border border-white/10"
                style={{ background: "#111" }}
              >
                <h2 className="font-display text-2xl text-white mb-5">
                  CONTACT DETAILS
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-white/60 text-xs mb-1.5 block"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-neon"
                      data-ocid="checkout.input"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-white/60 text-xs mb-1.5 block"
                    >
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="john@email.com"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-neon"
                      data-ocid="checkout.input"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-white/60 text-xs mb-1.5 block"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+234 800 000 0000"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-neon"
                      data-ocid="checkout.input"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="country"
                      className="text-white/60 text-xs mb-1.5 block"
                    >
                      Country
                    </Label>
                    <select
                      id="country"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md border border-white/20 bg-white/5 text-white text-sm focus:border-neon focus:outline-none"
                      data-ocid="checkout.select"
                    >
                      {[
                        "Nigeria",
                        "Ghana",
                        "Kenya",
                        "South Africa",
                        "United Kingdom",
                        "United States",
                        "Germany",
                        "France",
                        "Canada",
                        "Australia",
                        "Other",
                      ].map((c) => (
                        <option
                          key={c}
                          value={c}
                          style={{ background: "#111" }}
                        >
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label
                      htmlFor="address"
                      className="text-white/60 text-xs mb-1.5 block"
                    >
                      Shipping Address *
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      placeholder="123 Street, City, State"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-neon"
                      data-ocid="checkout.input"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div
                className="p-6 rounded-xl border border-white/10"
                style={{ background: "#111" }}
              >
                <h2 className="font-display text-2xl text-white mb-5">
                  PAYMENT METHOD
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      id: "card" as const,
                      icon: <CreditCard className="h-5 w-5" />,
                      label: "Card Payment",
                      desc: "Visa, Mastercard, Verve",
                    },
                    {
                      id: "bank" as const,
                      icon: <Building className="h-5 w-5" />,
                      label: "Bank Transfer",
                      desc: "Direct bank transfer (Nigeria)",
                    },
                    {
                      id: "whatsapp" as const,
                      icon: <MessageCircle className="h-5 w-5" />,
                      label: "Order via WhatsApp",
                      desc: "Confirm & pay through WhatsApp",
                    },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPayment(method.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-all ${
                        payment === method.id
                          ? "border-neon bg-neon/10"
                          : "border-white/20 hover:border-white/40"
                      }`}
                      data-ocid="checkout.radio"
                    >
                      <span
                        className={
                          payment === method.id ? "text-neon" : "text-white/50"
                        }
                      >
                        {method.icon}
                      </span>
                      <div>
                        <p
                          className={`text-sm font-medium ${payment === method.id ? "text-neon" : "text-white"}`}
                        >
                          {method.label}
                        </p>
                        <p className="text-xs text-white/40">{method.desc}</p>
                      </div>
                      <div
                        className={`ml-auto h-4 w-4 rounded-full border-2 ${
                          payment === method.id
                            ? "border-neon bg-neon"
                            : "border-white/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {payment === "bank" && (
                  <div className="mt-4 p-4 rounded-lg border border-white/10 bg-white/5 text-sm">
                    <p className="text-white font-medium mb-2">
                      Bank Transfer Details
                    </p>
                    <p className="text-white/60">Bank: First Bank Nigeria</p>
                    <p className="text-white/60">Account: 0123456789</p>
                    <p className="text-white/60">Name: Eazykitshub Ltd</p>
                    <p className="text-xs text-white/40 mt-2">
                      Send proof of payment to Eazykits007@gmail.com
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order summary */}
            <div>
              <div
                className="p-6 rounded-xl border border-white/10 sticky top-24"
                style={{ background: "#111" }}
              >
                <h2 className="font-display text-2xl text-white mb-5">
                  YOUR ORDER
                </h2>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div
                      key={`${item.jerseyId}-${item.size}`}
                      className="flex gap-3"
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.jerseyName}
                          className="h-14 w-12 object-cover rounded flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">
                          {item.jerseyName}
                        </p>
                        <p className="text-xs text-white/40">
                          {item.size} × {item.quantity}
                        </p>
                        <p className="text-neon text-xs font-bold">
                          {formatPrice(item.unitPrice * BigInt(item.quantity))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <span className="text-white">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  {hasBundleDiscount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-neon">Bundle -15%</span>
                      <span className="text-neon">
                        -{formatPrice(discountAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-neon">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={submitOrder.isPending}
                  className="w-full bg-neon text-black font-bold h-12 mt-5 hover:bg-neon/90"
                  data-ocid="checkout.submit_button"
                >
                  {submitOrder.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : payment === "whatsapp" ? (
                    <>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Order via WhatsApp
                    </>
                  ) : (
                    "PLACE ORDER"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
