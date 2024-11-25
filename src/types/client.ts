export interface Client {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
  form_link?: string;
}

export interface ClientFormData {
  name: string;
  phone: string;
  email: string;
} 