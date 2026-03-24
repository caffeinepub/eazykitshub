import AdminRoute from "@/components/AdminRoute";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import BlogPage from "@/pages/BlogPage";
// Pages
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import FAQPage from "@/pages/FAQPage";
import HomePage from "@/pages/HomePage";
import JerseyDetailPage from "@/pages/JerseyDetailPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import ReturnsPage from "@/pages/ReturnsPage";
import ShippingPage from "@/pages/ShippingPage";
import SizeGuidePage from "@/pages/SizeGuidePage";
import StorePage from "@/pages/StorePage";

// Admin
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import JerseyFormPage from "@/pages/admin/JerseyFormPage";
import ManageJerseysPage from "@/pages/admin/ManageJerseysPage";

// ── Floating WhatsApp Button ──
function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/2348134445712"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:bg-green-400 transition-colors"
      style={{ boxShadow: "0 4px 20px rgba(34,197,94,0.5)" }}
      aria-label="Chat on WhatsApp"
      data-ocid="whatsapp.button"
    >
      <MessageCircle className="h-7 w-7 text-white" />
    </a>
  );
}

// ── Layouts ──
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

function AdminLayout() {
  return (
    <AdminRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </div>
    </AdminRoute>
  );
}

// ── Routes ──
const rootRoute = createRootRoute();

const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public-layout",
  component: PublicLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/",
  component: HomePage,
});

const storeRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/store",
  component: StorePage,
});

const jerseyDetailRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/jersey/$id",
  component: JerseyDetailPage,
});

const cartRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/order-confirmation",
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: (search.orderId as string) || "",
  }),
  component: OrderConfirmationPage,
});

const blogRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/blog",
  component: BlogPage,
});

const faqRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/faq",
  component: FAQPage,
});

const shippingRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/shipping",
  component: ShippingPage,
});

const returnsRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/returns",
  component: ReturnsPage,
});

const sizeGuideRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/size-guide",
  component: SizeGuidePage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/admin/login",
  component: AdminLoginPage,
});

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin-layout",
  component: AdminLayout,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin",
  component: AdminDashboardPage,
});

const adminJerseysRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/jerseys",
  component: ManageJerseysPage,
});

const adminNewJerseyRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/jerseys/new",
  component: JerseyFormPage,
});

const adminEditJerseyRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/jerseys/$id/edit",
  component: JerseyFormPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/orders",
  component: AdminOrdersPage,
});

// ── Router ──
const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    homeRoute,
    storeRoute,
    jerseyDetailRoute,
    cartRoute,
    checkoutRoute,
    orderConfirmationRoute,
    blogRoute,
    faqRoute,
    shippingRoute,
    returnsRoute,
    sizeGuideRoute,
    adminLoginRoute,
  ]),
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminJerseysRoute,
    adminNewJerseyRoute,
    adminEditJerseyRoute,
    adminOrdersRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ── App ──
export default function App() {
  return (
    <CurrencyProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <Toaster />
      </CartProvider>
    </CurrencyProvider>
  );
}
