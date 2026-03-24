import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";

const FAQS = [
  {
    category: "Ordering",
    questions: [
      {
        q: "How do I place an order?",
        a: "Browse our store, select your jersey, choose your size and version (Fans or Player), then add to cart and proceed to checkout. You can also order directly via WhatsApp at +234 813 444 5712.",
      },
      {
        q: "Can I order without creating an account?",
        a: "Yes! We offer guest checkout. Simply fill in your name, email, and shipping address at checkout.",
      },
      {
        q: "Do you accept pre-orders for upcoming jerseys?",
        a: 'Yes! We accept pre-orders for upcoming kit releases. Look for the "PRE-ORDER" badge on product listings.',
      },
    ],
  },
  {
    category: "Sizing",
    questions: [
      {
        q: "What sizes do you offer?",
        a: "We stock Small, Medium, Large, XL, and XXL for most jerseys. See our full Size Guide for detailed measurements.",
      },
      {
        q: "What is the difference between Fans and Player Version?",
        a: "Fans Version has a relaxed comfort fit, great for everyday wear. Player Version has a slim athletic fit with authentic match-grade material — the same standard as professional players.",
      },
      {
        q: "What if my size is out of stock?",
        a: "Join our WhatsApp notification list and we’ll alert you when your size is restocked. You can also pre-order.",
      },
    ],
  },
  {
    category: "Shipping",
    questions: [
      {
        q: "How long does delivery take?",
        a: "Nigeria: 2–4 business days. Africa: 5–10 business days. Worldwide: 7–14 business days.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes! We ship to over 50 countries worldwide. We’re based in Nigeria but serve global football fans.",
      },
      {
        q: "How can I track my order?",
        a: "Once dispatched, you’ll receive a tracking number via email or WhatsApp. You can use it to track your delivery in real-time.",
      },
    ],
  },
  {
    category: "Returns & Payments",
    questions: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 14 days of delivery. Jerseys must be unworn, unwashed, and in original condition with tags attached.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept card payments, bank transfer (Nigeria), and WhatsApp orders. All transactions are SSL secured.",
      },
      {
        q: "Is it safe to pay online?",
        a: "Absolutely. Our checkout is SSL encrypted. We use industry-standard security to protect your payment information.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="pt-20 min-h-screen">
      <section
        className="py-16 px-4"
        style={{ background: "linear-gradient(to bottom, #0d0d0d, #0a0a0a)" }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-neon text-sm font-medium tracking-widest mb-2">
              GOT QUESTIONS?
            </p>
            <h1 className="font-display text-6xl sm:text-7xl text-white mb-4">
              FAQ
            </h1>
            <p className="text-white/50">
              Everything you need to know about Eazykitshub.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
        {FAQS.map((section, si) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.1 }}
          >
            <h2 className="font-display text-3xl text-neon mb-4">
              {section.category}
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {section.questions.map((faq, fi) => (
                <AccordionItem
                  key={faq.q.slice(0, 20)}
                  value={`${si}-${fi}`}
                  className="border border-white/10 rounded-lg px-4 hover:border-neon/30 transition-colors"
                  style={{ background: "#111" }}
                  data-ocid={`faq.item.${si + 1}`}
                >
                  <AccordionTrigger className="text-sm font-medium text-white hover:text-neon hover:no-underline py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-white/60 pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
