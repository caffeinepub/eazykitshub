import { Ruler } from "lucide-react";
import { motion } from "motion/react";

export default function SizeGuidePage() {
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
              FIT PERFECTLY
            </p>
            <h1 className="font-display text-6xl sm:text-7xl text-white mb-4">
              SIZE GUIDE
            </h1>
            <p className="text-white/50">
              Find your perfect fit with our detailed size chart.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* How to measure */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-display text-3xl text-white mb-6">
            HOW TO MEASURE
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Ruler className="h-6 w-6" />,
                title: "Chest",
                desc: "Measure around the fullest part of your chest, keeping the tape level.",
              },
              {
                icon: <Ruler className="h-6 w-6" />,
                title: "Waist",
                desc: "Measure around your natural waistline, at the narrowest part.",
              },
              {
                icon: <Ruler className="h-6 w-6" />,
                title: "Hips",
                desc: "Measure around the fullest part of your hips, keeping the tape level.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-xl border border-white/10 hover:border-neon/30 transition-colors"
                style={{ background: "#111" }}
              >
                <div className="text-neon mb-2">{item.icon}</div>
                <h3 className="font-display text-xl text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Size chart */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="font-display text-3xl text-white mb-6">
            JERSEY SIZE CHART (cm)
          </h2>
          <div className="rounded-xl overflow-hidden border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#111" }}>
                  <th className="py-3 px-5 text-left text-neon font-display text-lg">
                    Size
                  </th>
                  <th className="py-3 px-5 text-center text-white/50">Chest</th>
                  <th className="py-3 px-5 text-center text-white/50">Waist</th>
                  <th className="py-3 px-5 text-center text-white/50">Hips</th>
                  <th className="py-3 px-5 text-center text-white/50">
                    Height
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["S", "86–91", "71–76", "86–91", "165–170"],
                  ["M", "91–96", "76–81", "91–96", "170–175"],
                  ["L", "96–101", "81–86", "96–101", "175–180"],
                  ["XL", "101–107", "86–91", "101–107", "180–185"],
                  ["XXL", "107–114", "91–97", "107–114", "185–192"],
                ].map(([size, chest, waist, hips, height], i) => (
                  <tr key={size} className="border-t border-white/10">
                    <td
                      className="py-4 px-5 font-bold text-neon font-display text-lg"
                      style={{ background: i % 2 === 0 ? "#111" : "#131313" }}
                    >
                      {size}
                    </td>
                    <td
                      className="py-4 px-5 text-center text-white/70"
                      style={{ background: i % 2 === 0 ? "#111" : "#131313" }}
                    >
                      {chest}
                    </td>
                    <td
                      className="py-4 px-5 text-center text-white/70"
                      style={{ background: i % 2 === 0 ? "#111" : "#131313" }}
                    >
                      {waist}
                    </td>
                    <td
                      className="py-4 px-5 text-center text-white/70"
                      style={{ background: i % 2 === 0 ? "#111" : "#131313" }}
                    >
                      {hips}
                    </td>
                    <td
                      className="py-4 px-5 text-center text-white/70"
                      style={{ background: i % 2 === 0 ? "#111" : "#131313" }}
                    >
                      {height}
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
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display text-3xl text-white mb-6">
            FANS VS PLAYER FIT
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              className="p-6 rounded-xl border border-white/10"
              style={{ background: "#111" }}
            >
              <h3 className="font-display text-xl text-white mb-3">
                FANS VERSION
              </h3>
              <p className="text-sm text-white/60 mb-3">
                Relaxed comfort fit. If you’re between sizes, size up for a more
                comfortable feel. Great for everyday wear and stadium matchdays.
              </p>
              <p className="text-xs text-neon">
                → Order your usual size or one size up for extra comfort
              </p>
            </div>
            <div className="p-6 rounded-xl border border-neon/30 bg-neon/5">
              <h3 className="font-display text-xl text-neon mb-3">
                PLAYER VERSION
              </h3>
              <p className="text-sm text-white/60 mb-3">
                Slim athletic cut. Designed to fit like a professional player’s
                match-day kit. If you’re between sizes, order one size up.
              </p>
              <p className="text-xs text-neon">
                → Order your usual size — slim athletic cut fits true to size
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
