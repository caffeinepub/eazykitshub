import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddJersey,
  useGetJersey,
  useUpdateJersey,
} from "@/hooks/useQueries";
import { formatPrice } from "@/utils/format";
import { generateId } from "@/utils/format";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Image, Loader2, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormState {
  name: string;
  team: string;
  description: string;
  price: string;
  sizes: string[];
  inStock: boolean;
  featured: boolean;
}

interface FormErrors {
  name?: string;
  team?: string;
  description?: string;
  price?: string;
  sizes?: string;
}

export default function JerseyFormPage() {
  const params = useParams({ strict: false }) as { id?: string };
  const jerseyId = params.id;
  const isEdit = !!jerseyId;
  const navigate = useNavigate();

  const { data: existingJersey, isLoading: loadingJersey } = useGetJersey(
    jerseyId || "",
  );
  const addJersey = useAddJersey();
  const updateJersey = useUpdateJersey();

  const [form, setForm] = useState<FormState>({
    name: "",
    team: "",
    description: "",
    price: "",
    sizes: ["M", "L", "XL"],
    inStock: true,
    featured: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageBlob, setImageBlob] = useState<ExternalBlob | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form when editing
  useEffect(() => {
    if (existingJersey && isEdit) {
      setForm({
        name: existingJersey.name,
        team: existingJersey.team,
        description: existingJersey.description,
        price: (Number(existingJersey.priceCents) / 100).toFixed(2),
        sizes: existingJersey.sizes,
        inStock: existingJersey.inStock,
        featured: existingJersey.featured,
      });
      if (existingJersey.imageId) {
        setImageBlob(existingJersey.imageId);
        setImagePreview(existingJersey.imageId.getDirectURL());
      }
    }
  }, [existingJersey, isEdit]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const arrayBuffer = ev.target?.result as ArrayBuffer;
      const uint8 = new Uint8Array(arrayBuffer);

      setIsUploading(true);
      setUploadProgress(0);

      const blob = ExternalBlob.fromBytes(uint8).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });

      setImageBlob(blob);
      setImagePreview(URL.createObjectURL(file));
      setIsUploading(false);
      setUploadProgress(100);
    };
    reader.readAsArrayBuffer(file);
  };

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.team.trim()) newErrors.team = "Team is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (
      !form.price ||
      Number.isNaN(Number.parseFloat(form.price)) ||
      Number.parseFloat(form.price) <= 0
    ) {
      newErrors.price = "Enter a valid price";
    }
    if (form.sizes.length === 0) newErrors.sizes = "Select at least one size";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const priceCents = BigInt(Math.round(Number.parseFloat(form.price) * 100));

    const jerseyData = {
      id: isEdit ? jerseyId! : generateId(),
      name: form.name,
      team: form.team,
      description: form.description,
      priceCents,
      sizes: form.sizes,
      inStock: form.inStock,
      featured: form.featured,
      imageId: imageBlob ?? undefined,
      createdAt: BigInt(Date.now() * 1_000_000),
    };

    try {
      if (isEdit) {
        await updateJersey.mutateAsync(jerseyData);
        toast.success("Jersey updated!");
      } else {
        await addJersey.mutateAsync(jerseyData);
        toast.success("Jersey added!");
      }
      navigate({ to: "/admin/jerseys" });
    } catch {
      toast.error(`Failed to ${isEdit ? "update" : "add"} jersey`);
    }
  };

  const isPending = addJersey.isPending || updateJersey.isPending;

  if (isEdit && loadingJersey) {
    return (
      <main className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-crimson" />
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => navigate({ to: "/admin/jerseys" })}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Jerseys
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-crimson font-bold text-xs tracking-[0.3em] uppercase mb-2">
            {isEdit ? "Edit Jersey" : "New Jersey"}
          </p>
          <h1 className="font-display text-4xl mb-8">
            {isEdit ? "Edit Jersey" : "Add Jersey"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-bold uppercase tracking-wider"
              >
                Jersey Name
              </Label>
              <Input
                id="name"
                data-ocid="admin.jersey_name_input"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Real Madrid Home Kit 2024"
                className={`bg-surface-2 border-border focus:border-crimson ${errors.name ? "border-destructive" : ""}`}
              />
              {errors.name && (
                <p className="text-destructive text-xs">{errors.name}</p>
              )}
            </div>

            {/* Team */}
            <div className="space-y-2">
              <Label
                htmlFor="team"
                className="text-sm font-bold uppercase tracking-wider"
              >
                Team
              </Label>
              <Input
                id="team"
                value={form.team}
                onChange={(e) =>
                  setForm((p) => ({ ...p, team: e.target.value }))
                }
                placeholder="e.g. Real Madrid"
                className={`bg-surface-2 border-border focus:border-crimson ${errors.team ? "border-destructive" : ""}`}
              />
              {errors.team && (
                <p className="text-destructive text-xs">{errors.team}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="desc"
                className="text-sm font-bold uppercase tracking-wider"
              >
                Description
              </Label>
              <Textarea
                id="desc"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Describe the jersey..."
                rows={3}
                className={`bg-surface-2 border-border focus:border-crimson resize-none ${errors.description ? "border-destructive" : ""}`}
              />
              {errors.description && (
                <p className="text-destructive text-xs">{errors.description}</p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-sm font-bold uppercase tracking-wider"
              >
                Price (USD)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="price"
                  data-ocid="admin.jersey_price_input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                  placeholder="49.99"
                  className={`pl-8 bg-surface-2 border-border focus:border-crimson ${errors.price ? "border-destructive" : ""}`}
                />
              </div>
              {errors.price && (
                <p className="text-destructive text-xs">{errors.price}</p>
              )}
              {form.price && !Number.isNaN(Number.parseFloat(form.price)) && (
                <p className="text-xs text-muted-foreground">
                  Display price:{" "}
                  {formatPrice(
                    BigInt(Math.round(Number.parseFloat(form.price) * 100)),
                  )}
                </p>
              )}
            </div>

            {/* Sizes */}
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-wider">
                Available Sizes
              </Label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-sm border text-sm font-bold transition-all ${
                      form.sizes.includes(size)
                        ? "border-crimson bg-crimson/10 text-foreground"
                        : "border-border bg-surface-2 text-muted-foreground hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {errors.sizes && (
                <p className="text-destructive text-xs">{errors.sizes}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-bold uppercase tracking-wider">
                Jersey Image
              </Label>
              <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="w-32 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-surface-2 border border-border flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    data-ocid="admin.jersey_image_upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    data-ocid="admin.jersey_image_upload"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full rounded-sm border-dashed border-border hover:border-crimson hover:bg-crimson/5"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading
                      ? `Uploading ${uploadProgress}%...`
                      : "Upload Image"}
                  </Button>

                  {imagePreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setImageBlob(null);
                        setImagePreview("");
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="w-full text-muted-foreground hover:text-destructive"
                    >
                      <X className="mr-2 h-3.5 w-3.5" />
                      Remove Image
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, or WebP. Max 10MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between py-3 border-t border-border">
                <div>
                  <Label className="font-bold">In Stock</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Allow customers to purchase this jersey
                  </p>
                </div>
                <Switch
                  checked={form.inStock}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, inStock: v }))
                  }
                />
              </div>
              <div className="flex items-center justify-between py-3 border-t border-border">
                <div>
                  <Label className="font-bold">Featured</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Show on the homepage featured section
                  </p>
                </div>
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, featured: v }))
                  }
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                data-ocid="admin.save_jersey_button"
                disabled={isPending}
                className="flex-1 gradient-crimson text-white border-0 font-bold rounded-sm hover:opacity-90 shadow-glow py-5"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? "Updating..." : "Adding..."}
                  </>
                ) : isEdit ? (
                  "Save Changes"
                ) : (
                  "Add Jersey"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                className="rounded-sm"
              >
                <Link to="/admin/jerseys">Cancel</Link>
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
