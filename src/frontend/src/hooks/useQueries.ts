import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Jersey as BackendJersey } from "../backend";
import type { NewOrder, Order, OrderStatus } from "../backend.d";
import { useActor } from "./useActor";

// ─── Jersey Queries ───────────────────────────────────────────────────────────

export function useGetAllJerseys() {
  const { actor, isFetching } = useActor();
  return useQuery<BackendJersey[]>({
    queryKey: ["jerseys"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJerseys();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedJerseys() {
  const { actor, isFetching } = useActor();
  return useQuery<BackendJersey[]>({
    queryKey: ["jerseys", "featured"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedJerseys();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetJersey(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<BackendJersey>({
    queryKey: ["jersey", id],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getJersey(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

// ─── Order Queries ────────────────────────────────────────────────────────────

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrder(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Order>({
    queryKey: ["order", id],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getOrder(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

// ─── Admin Queries ────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Jersey Mutations ─────────────────────────────────────────────────────────

export function useAddJersey() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jersey: BackendJersey) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addJersey(jersey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jerseys"] });
    },
  });
}

export function useUpdateJersey() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jersey: BackendJersey) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateJersey(jersey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jerseys"] });
    },
  });
}

export function useDeleteJersey() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteJersey(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jerseys"] });
    },
  });
}

export function useToggleInStock() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.toggleInStock(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jerseys"] });
    },
  });
}

export function useToggleFeatured() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.toggleFeatured(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jerseys"] });
    },
  });
}

// ─── Order Mutations ──────────────────────────────────────────────────────────

export function useSubmitOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newOrder: NewOrder) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitOrder(newOrder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useInitializeSampleData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.initializeSampleData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jerseys"] });
    },
  });
}
