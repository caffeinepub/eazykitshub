import { Clock, Globe, Truck } from "lucide-react";
import { motion } from "motion/react";

export default function ShippingPage() {
  return (
    <main className="pt-20 min-h-screen">
      <section
        className="py-16 px-4"
        style={{ background: "linear-gradient(to bottom, #0d0d0d, #0a0a0a)" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-neon text-sm font-medium tracking-widest mb-2">
              DELIVERY INFO
            </p>
            <h1 className="font-display text-6xl sm:text-7xl text-white mb-4">
              SHIPPING POLICY
            </h1>
            <p className="text-white/50">
              Based in Nigeria. Delivering football passion worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* Rates table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-display text-3xl text-white mb-6">
            SHIPPING RATES & TIMES
          </h2>
          <div className="rounded-xl overflow-hidden border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#111" }}>
                  <th className="py-3 px-5 text-left text-white/50">Region</th>
                  <th className="py-3 px-5 text-center text-white/50">
                    Estimated Time
                  </th>
                  <th className="py-3 px-5 text-center text-white/50">
                    Shipping Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    region: "🇳🇬 Nigeria",
                    time: "2–4 business days",
                    cost: "₦1,500 – ₦3,000",
                  },
                  {
                    region: "🌍 West Africa",
                    time: "4–7 business days",
                    cost: "₦4,000 – ₦6,000",
                  },
                  {
                    region: "🌍 East & Southern Africa",
                    time: "5–10 business days",
                    cost: "₦5,000 – ₦8,000",
                  },
                  {
                    region: "🇬🇧 United Kingdom",
                    time: "7–12 business days",
                    cost: "₦8,000 – ₦12,000",
                  },
                  {
                    region: "🇺🇸 United States",
                    time: "8–14 business days",
                    cost: "₦8,000 – ₦14,000",
                  },
                  {
                    region: "🇪🇺 Europe",
                    time: "8–14 business days",
                    cost: "₦8,000 – ₦12,000",
                  },
                  {
                    region: "🌏 Rest of World",
                    time: "10–18 business days",
                    cost: "₦10,000 – ₦18,000",
                  },
                ].map(({ region, time, cost }, i) => (
                  <tr key={region} className="border-t border-white/10">
                    <td
                      className="py-4 px-5 text-white/80"
                      style={{ background: i % 2 === 0 ? "#111" : "#131313" }}
                    >
                      {region}
                    </td>
                    <td
                      className="py-4 px-5 text-center text-white/60"
                      style={{ background: i % 2 === 0 ? "#111" : "#131313" }}
                    >
                      {time}
                    </td>
                    <td
                      className="py-4 px-5 text-center text-neon font-medium"
                      style={{ background: i % 2 === 0 ? "#111" : "#131313" }}
                    >
                      {cost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {[
            {
              icon: <Truck className="h-8 w-8" />,
              title: "Order Tracking",
              text: "Receive a tracking number via email or WhatsApp once your order is dispatched.",
            },
            {
              icon: <Globe className="h-8 w-8" />,
              title: "International Shipping",
              text: "We ship to 50+ countries. All international orders are fully insured.",
            },
            {
              icon: <Clock className="h-8 w-8" />,
              title: "Processing Time",
              text: "Orders are processed within 24–48 hours of payment confirmation.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-xl border border-white/10 text-center hover:border-neon/30 transition-colors"
              style={{ background: "#111" }}
            >
              <div className="text-neon flex justify-center mb-3">
                {item.icon}
              </div>
              <h3 className="font-display text-xl text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-white/50">{item.text}</p>
            </div>
          ))}
        </motion.section>
      </div>
    </main>
  );
}
