import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllOrders, useUpdateOrderStatus } from "@/hooks/useQueries";
import { formatDate, formatPrice } from "@/utils/format";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { OrderStatus } from "../../backend.d";

const STATUS_OPTIONS: OrderStatus[] = [
  OrderStatus.pending,
  OrderStatus.confirmed,
  OrderStatus.shipped,
  OrderStatus.delivered,
];

const STATUS_COLORS: Record<string, string> = {
  pending: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  confirmed: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  shipped: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  delivered: "text-green-400 bg-green-400/10 border-green-400/30",
};

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useGetAllOrders();
  const updateOrderStatus = useUpdateOrderStatus();

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus.mutateAsync({ id: orderId, status });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update order status");
    }
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <p className="text-crimson font-bold text-xs tracking-[0.3em] uppercase mb-2">
          Management
        </p>
        <h1 className="font-display text-4xl md:text-5xl">Orders</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-card border border-border rounded-lg overflow-hidden"
      >
        {isLoading ? (
          <div className="p-4 space-y-3">
            {["s1", "s2", "s3", "s4", "s5"].map((k) => (
              <Skeleton key={k} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table data-ocid="admin.orders_table">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                    Order ID
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                    Customer
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">
                    Items
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">
                    Total
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">
                    Date
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-16 text-muted-foreground"
                    >
                      No orders yet
                    </TableCell>
                  </TableRow>
                ) : (
                  orders?.map((order, index) => (
                    <TableRow
                      key={order.id}
                      className="border-border hover:bg-surface-2"
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{order.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-sm">
                            {order.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.customerEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="space-y-0.5">
                          {order.items.slice(0, 2).map((item, i) => (
                            <p
                              key={`${item.jerseyId}-${item.size}-${i}`}
                              className="text-xs text-muted-foreground"
                            >
                              {item.jerseyName} ×{Number(item.quantity)} (
                              {item.size})
                            </p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-muted-foreground/60">
                              +{order.items.length - 2} more
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell font-display font-bold">
                        {formatPrice(order.totalAmount)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(v) =>
                            handleStatusChange(order.id, v as OrderStatus)
                          }
                        >
                          <SelectTrigger
                            data-ocid={`admin.order_status_select.${index + 1}`}
                            className={`w-32 h-7 text-xs border rounded-sm ${STATUS_COLORS[order.status] || ""}`}
                          >
                            {updateOrderStatus.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((status) => (
                              <SelectItem
                                key={status}
                                value={status}
                                className="text-xs capitalize"
                              >
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>
    </main>
  );
}
