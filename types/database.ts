export type CustomerStatus = "active" | "inactive" | "archived";

export type ServiceAccountStatus =
  | "active"
  | "full"
  | "maintenance"
  | "inactive"
  | "archived";

export type Customer = {
  id: string;
  name: string;
  contact_label: string | null;
  phone: string | null;
  email: string | null;
  status: CustomerStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ServiceAccount = {
  id: string;
  label: string;
  service_name: string;
  account_identifier: string | null;
  credential_reference: string | null;
  total_slots: number;
  used_slots: number;
  status: ServiceAccountStatus;
  renewal_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CustomerInsert = {
  id?: string;
  name: string;
  contact_label?: string | null;
  phone?: string | null;
  email?: string | null;
  status?: CustomerStatus;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CustomerUpdate = Partial<CustomerInsert>;

export type ServiceAccountInsert = {
  id?: string;
  label: string;
  service_name: string;
  account_identifier?: string | null;
  credential_reference?: string | null;
  total_slots?: number;
  used_slots?: number;
  status?: ServiceAccountStatus;
  renewal_date?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ServiceAccountUpdate = Partial<ServiceAccountInsert>;

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: Customer;
        Insert: CustomerInsert;
        Update: CustomerUpdate;
        Relationships: [];
      };
      service_accounts: {
        Row: ServiceAccount;
        Insert: ServiceAccountInsert;
        Update: ServiceAccountUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
