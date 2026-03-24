import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Jersey {
    id: string;
    featured: boolean;
    inStock: boolean;
    name: string;
    createdAt: Time;
    team: string;
    description: string;
    sizes: Array<string>;
    imageId?: ExternalBlob;
    priceCents: bigint;
}
export interface OrderItem {
    jerseyId: string;
    jerseyName: string;
    size: string;
    quantity: bigint;
    unitPrice: bigint;
}
export interface NewOrder {
    customerName: string;
    shippingAddress: string;
    items: Array<OrderItem>;
    customerEmail: string;
}
export interface Order {
    id: string;
    customerName: string;
    status: OrderStatus;
    createdAt: Time;
    totalAmount: bigint;
    shippingAddress: string;
    items: Array<OrderItem>;
    customerEmail: string;
}
export enum OrderStatus {
    shipped = "shipped",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addJersey(jersey: Jersey): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteJersey(id: string): Promise<void>;
    getAllJerseys(): Promise<Array<Jersey>>;
    getAllOrders(): Promise<Array<Order>>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedJerseys(): Promise<Array<Jersey>>;
    getJersey(id: string): Promise<Jersey>;
    getOrder(id: string): Promise<Order>;
    initializeSampleData(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    submitOrder(newOrder: NewOrder): Promise<string>;
    toggleFeatured(id: string): Promise<void>;
    toggleInStock(id: string): Promise<void>;
    updateJersey(jersey: Jersey): Promise<void>;
    updateOrderStatus(id: string, status: OrderStatus): Promise<void>;
}
