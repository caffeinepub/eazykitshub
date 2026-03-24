import { CheckCircle, MessageCircle, RotateCcw, XCircle } from "lucide-react";
import { motion } from "motion/react";

export default function ReturnsPage() {
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
              PEACE OF MIND
            </p>
            <h1 className="font-display text-6xl sm:text-7xl text-white mb-4">
              RETURNS POLICY
            </h1>
            <p className="text-white/50">
              14-day hassle-free returns on all orders.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-xl border border-neon/30 bg-neon/5 text-center"
        >
          <RotateCcw className="h-12 w-12 text-neon mx-auto mb-3" />
          <h2 className="font-display text-4xl text-white mb-2">
            14-DAY RETURN WINDOW
          </h2>
          <p className="text-white/60">
            Return or exchange within 14 days of receiving your order. No
            questions asked.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl border border-white/10"
            style={{ background: "#111" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-neon" />
              <h3 className="font-display text-xl text-white">
                ELIGIBLE FOR RETURN
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-white/60">
              {[
                "Unworn and unwashed jerseys",
                "Original tags still attached",
                "Original packaging included",
                "Returned within 14 days",
                "Manufacturing defects",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-neon text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl border border-white/10"
            style={{ background: "#111" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="h-5 w-5 text-red-400" />
              <h3 className="font-display text-xl text-white">NOT ELIGIBLE</h3>
            </div>
            <ul className="space-y-2 text-sm text-white/60">
              {[
                "Worn or washed items",
                "Items returned after 14 days",
                "Customised / printed jerseys",
                "Items without original tags",
                "Damaged by customer",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-red-400 text-xs">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl border border-white/10"
          style={{ background: "#111" }}
        >
          <h3 className="font-display text-2xl text-white mb-4">
            HOW TO RETURN
          </h3>
          <ol className="space-y-3">
            {[
              "Contact us via WhatsApp (+234 813 444 5712) or email (Eazykits007@gmail.com) within 14 days.",
              "We will provide a return address and instructions.",
              "Pack the jersey securely in its original packaging.",
              "Ship the item back at your cost (we cover return shipping for defective items).",
              "Receive your refund or exchange within 3–5 business days of us receiving the return.",
            ].map((step, i) => (
              <li
                key={step.slice(0, 20)}
                className="flex gap-3 text-sm text-white/60"
              >
                <span className="h-6 w-6 rounded-full bg-neon/20 border border-neon/40 text-neon text-xs flex items-center justify-center flex-shrink-0 font-bold">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </motion.div>

        <div className="text-center">
          <a
            href="https://wa.me/2348134445712?text=Hi! I need help with a return."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-3 rounded-lg hover:bg-green-500/20 transition-colors text-sm font-medium"
          >
            <MessageCircle className="h-4 w-4" />
            Start a Return via WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
