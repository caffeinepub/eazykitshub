import { ArrowRight, Calendar } from "lucide-react";
import { motion } from "motion/react";

const POSTS = [
  {
    id: 1,
    title: "2025/26 Premier League Kits Released: Full Breakdown",
    date: "March 15, 2026",
    excerpt:
      "All 20 Premier League clubs have unveiled their kits for the 2025/26 season. From Arsenal's iconic red to City's sky blue, we break down every design choice.",
    category: "Kit Releases",
    imageColor: "#1a0a0a",
  },
  {
    id: 2,
    title: "AFCON 2026 National Jerseys Preview: Africa's Finest",
    date: "February 28, 2026",
    excerpt:
      "With AFCON 2026 approaching, national teams across Africa have released stunning new kits. Nigeria, Ghana, Senegal, and more — see all the designs here.",
    category: "National Teams",
    imageColor: "#0a1a0a",
  },
  {
    id: 3,
    title: "How To Spot A Quality Football Jersey: 5 Key Signs",
    date: "January 20, 2026",
    excerpt:
      "With so many counterfeit jerseys on the market, knowing what to look for is crucial. We share 5 expert tips to verify jersey quality before you buy.",
    category: "Guide",
    imageColor: "#0a0a1a",
  },
  {
    id: 4,
    title: "Top 10 Retro Jerseys Of All Time: Football History",
    date: "December 10, 2025",
    excerpt:
      "From Brazil 1970 to Nigeria's green eagles, retro jerseys tell football's greatest stories. We rank the 10 most iconic throwback kits ever made.",
    category: "Retro",
    imageColor: "#1a1500",
  },
];

export default function BlogPage() {
  return (
    <main className="pt-20 min-h-screen">
      <section
        className="py-16 px-4"
        style={{ background: "linear-gradient(to bottom, #0d0d0d, #0a0a0a)" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-neon text-sm font-medium tracking-widest mb-2">
              THE BEAUTIFUL GAME
            </p>
            <h1 className="font-display text-6xl sm:text-7xl text-white mb-4">
              FOOTBALL KIT NEWS
            </h1>
            <p className="text-white/50 max-w-xl">
              Latest kit releases, guides, and football culture from
              Eazykitshub.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {POSTS.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-xl overflow-hidden border border-white/10 hover:border-neon/40 transition-all hover-lift"
              style={{ background: "#111" }}
              data-ocid={`blog.item.${i + 1}`}
            >
              <div
                className="h-48 flex items-end p-6"
                style={{
                  background: `linear-gradient(135deg, ${post.imageColor}, #0a0a0a)`,
                }}
              >
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-neon text-black">
                  {post.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                  <Calendar className="h-3 w-3" />
                  {post.date}
                </div>
                <h2 className="font-display text-2xl text-white mb-3 group-hover:text-neon transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-white/50 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <button
                  type="button"
                  className="flex items-center gap-2 text-neon text-sm font-medium hover:gap-3 transition-all"
                  data-ocid={`blog.link.${i + 1}`}
                >
                  Read More <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  );
}
