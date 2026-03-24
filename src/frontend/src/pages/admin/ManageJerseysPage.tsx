import JerseyPlaceholder from "@/components/JerseyPlaceholder";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteJersey,
  useGetAllJerseys,
  useToggleFeatured,
  useToggleInStock,
} from "@/hooks/useQueries";
import { formatPrice } from "@/utils/format";
import { Link } from "@tanstack/react-router";
import {
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  PlusCircle,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function ManageJerseysPage() {
  const { data: jerseys, isLoading } = useGetAllJerseys();
  const deleteJersey = useDeleteJersey();
  const toggleInStock = useToggleInStock();
  const toggleFeatured = useToggleFeatured();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteJersey.mutateAsync(id);
      toast.success("Jersey deleted");
    } catch {
      toast.error("Failed to delete jersey");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleInStock = async (id: string) => {
    try {
      await toggleInStock.mutateAsync(id);
      toast.success("Stock status updated");
    } catch {
      toast.error("Failed to update stock status");
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await toggleFeatured.mutateAsync(id);
      toast.success("Featured status updated");
    } catch {
      toast.error("Failed to update featured status");
    }
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-crimson font-bold text-xs tracking-[0.3em] uppercase mb-2">
            Inventory
          </p>
          <h1 className="font-display text-4xl md:text-5xl">Manage Jerseys</h1>
        </div>
        <Button
          asChild
          data-ocid="admin.add_jersey_button"
          className="gradient-crimson text-white border-0 font-bold rounded-sm hover:opacity-90 shadow-glow"
        >
          <Link to="/admin/jerseys/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Jersey
          </Link>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
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
            <Table data-ocid="admin.jerseys_table">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider w-16">
                    Image
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                    Name
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">
                    Team
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider hidden sm:table-cell">
                    Price
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">
                    Sizes
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase tracking-wider text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jerseys?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-16 text-muted-foreground"
                    >
                      No jerseys yet. Add your first jersey!
                    </TableCell>
                  </TableRow>
                ) : (
                  jerseys?.map((jersey) => (
                    <TableRow
                      key={jersey.id}
                      className="border-border hover:bg-surface-2"
                    >
                      <TableCell>
                        <div className="w-12 h-14 rounded overflow-hidden bg-surface-3">
                          {jersey.imageId?.getDirectURL() ? (
                            <img
                              src={jersey.imageId.getDirectURL()}
                              alt={jersey.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <JerseyPlaceholder
                              team={jersey.team}
                              className="w-full h-full"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {jersey.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">
                        {jersey.team}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {formatPrice(jersey.priceCents)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {jersey.sizes.map((s) => (
                            <Badge
                              key={s}
                              variant="outline"
                              className="text-xs px-1.5 py-0"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={jersey.inStock ? "default" : "destructive"}
                            className="text-xs w-fit"
                          >
                            {jersey.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                          {jersey.featured && (
                            <Badge className="bg-gold/20 text-gold border-gold/30 text-xs w-fit">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Toggle Stock */}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleToggleInStock(jersey.id)}
                            title={
                              jersey.inStock
                                ? "Mark Out of Stock"
                                : "Mark In Stock"
                            }
                            className="h-8 w-8 hover:bg-surface-3"
                          >
                            {jersey.inStock ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-green-400" />
                            )}
                          </Button>

                          {/* Toggle Featured */}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleToggleFeatured(jersey.id)}
                            title={
                              jersey.featured
                                ? "Remove from Featured"
                                : "Mark as Featured"
                            }
                            className="h-8 w-8 hover:bg-surface-3"
                          >
                            {jersey.featured ? (
                              <StarOff className="h-4 w-4 text-gold" />
                            ) : (
                              <Star className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>

                          {/* Edit */}
                          <Button
                            size="icon"
                            variant="ghost"
                            asChild
                            className="h-8 w-8 hover:bg-surface-3"
                          >
                            <Link
                              to="/admin/jerseys/$id/edit"
                              params={{ id: jersey.id }}
                            >
                              <Pencil className="h-4 w-4 text-muted-foreground" />
                            </Link>
                          </Button>

                          {/* Delete */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 hover:bg-destructive/10"
                              >
                                {deletingId === jersey.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                                ) : (
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Jersey?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "{jersey.name}".
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel data-ocid="admin.cancel_button">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  data-ocid="admin.confirm_button"
                                  onClick={() => handleDelete(jersey.id)}
                                  className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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
