import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllJerseys, useGetAllOrders } from "@/hooks/useQueries";
import { formatDate, formatPrice } from "@/utils/format";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Package,
  PlusCircle,
  ShirtIcon,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

export default function AdminDashboardPage() {
  const { data: jerseys, isLoading: jerseysLoading } = useGetAllJerseys();
  const { data: orders, isLoading: ordersLoading } = useGetAllOrders();

  const totalRevenue =
    orders?.reduce((sum, o) => sum + o.totalAmount, BigInt(0)) ?? BigInt(0);

  const pendingOrders =
    orders?.filter((o) => o.status === "pending").length ?? 0;

  const stats = [
    {
      label: "Total Jerseys",
      value: jerseys?.length ?? 0,
      icon: ShirtIcon,
      loading: jerseysLoading,
    },
    {
      label: "Total Orders",
      value: orders?.length ?? 0,
      icon: Package,
      loading: ordersLoading,
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      loading: ordersLoading,
    },
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      loading: ordersLoading,
    },
  ];

  const recentOrders = orders?.slice(0, 5) ?? [];

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-crimson font-bold text-xs tracking-[0.3em] uppercase mb-2">
            Admin
          </p>
          <h1 className="font-display text-4xl md:text-5xl">Dashboard</h1>
        </div>
        <Button
          asChild
          data-ocid="admin.add_jersey_button"
          className="gradient-crimson text-white border-0 font-bold rounded-sm hover:opacity-90 shadow-glow hidden sm:flex"
        >
          <Link to="/admin/jerseys/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Jersey
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, loading }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-lg p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="font-display text-3xl">{value}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <Link
          to="/admin/jerseys"
          className="group flex items-center justify-between bg-card border border-border rounded-lg p-5 hover:border-crimson/50 transition-colors"
        >
          <div>
            <p className="font-display font-bold text-lg">Manage Jerseys</p>
            <p className="text-muted-foreground text-sm">
              Add, edit, and manage your inventory
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-crimson group-hover:translate-x-1 transition-all" />
        </Link>
        <Link
          to="/admin/orders"
          className="group flex items-center justify-between bg-card border border-border rounded-lg p-5 hover:border-crimson/50 transition-colors"
        >
          <div>
            <p className="font-display font-bold text-lg">View Orders</p>
            <p className="text-muted-foreground text-sm">
              Track and update order statuses
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-crimson group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {ordersLoading ? (
            <div className="p-4 space-y-3">
              {["s1", "s2", "s3"].map((k) => (
                <Skeleton key={k} className="h-12 w-full" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              No orders yet
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between px-5 py-4 text-sm hover:bg-surface-2 transition-colors"
                >
                  <div>
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-muted-foreground text-xs">
                      {order.customerEmail} • {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <Badge
                      variant={
                        order.status === "pending"
                          ? "outline"
                          : order.status === "delivered"
                            ? "default"
                            : "secondary"
                      }
                      className="capitalize text-xs"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
