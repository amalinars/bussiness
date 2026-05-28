export type Customer = {
  id: string;
  fullName: string;
  phoneNumber?: string;
  email?: string;
  notes?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export type Platform = {
  id: string;
  name: string;
  category: "streaming" | "productivity" | "cloud" | "other";
  monthlyCost: number;
  currency: "IDR" | "USD";
  maxSlots: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export type ServiceAccount = {
  id: string;
  platformId: string;
  label: string;
  loginEmail: string;
  renewalDate: string;
  slotCapacity: number;
  status: "active" | "expiring" | "inactive";
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type SubscriptionSlot = {
  id: string;
  customerId: string;
  serviceAccountId: string;
  slotName: string;
  startDate: string;
  endDate: string;
  price: number;
  currency: "IDR" | "USD";
  status: "active" | "expiring" | "ended";
  createdAt: string;
  updatedAt: string;
};

export type Payment = {
  id: string;
  customerId: string;
  subscriptionSlotId: string;
  amount: number;
  currency: "IDR" | "USD";
  billingPeriodStart: string;
  billingPeriodEnd: string;
  paidAt?: string;
  status: "unpaid" | "paid" | "overdue";
  createdAt: string;
  updatedAt: string;
};

export type ReminderLog = {
  id: string;
  customerId: string;
  subscriptionSlotId?: string;
  paymentId?: string;
  channel: "manual" | "whatsapp" | "telegram" | "email";
  message: string;
  status: "pending" | "sent" | "failed";
  scheduledFor?: string;
  sentAt?: string;
  createdAt: string;
};
