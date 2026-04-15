export interface Restaurant {
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  whatsapp_number: string;
  instagram_url: string | null;
  phone_number: string | null;
  currency_code: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  restaurant_id: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface ItemVariant {
  name: string;
  price: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: string;
  image_url: string | null;
  category_id: string;
  restaurant_id: string;
  is_available: boolean;
  order: number;
  variants: ItemVariant[];
  created_at: string;
}

export type OfferType = 'percentage' | 'fixed_amount';

export interface Offer {
  id: string;
  title: string;
  description: string | null;
  discount_type: OfferType;
  discount_value: string;
  applicable_items: string[];
  start_date: string;
  end_date: string;
  restaurant_id: string;
  is_active: boolean;
  created_at: string;
}

export interface PublicMenuResponse {
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
  offers: Offer[];
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  variantName?: string;   // selected variant label
  variantPrice?: string;  // selected variant price
}

export interface OrderPayload {
  customer_name: string;
  customer_phone: string;
  items: { item_id: string; quantity: number; variant_name?: string }[];
  notes?: string;
}

export interface OrderResult {
  whatsapp_link: string;
  order_id: string;
  total: string;
  discount_amount: string;
  original_total: string;
}

export interface Review {
  id: string;
  restaurant_id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ReviewsListResponse {
  reviews: Review[];
  total: number;
  average_rating: number;
}

export interface ReviewCreate {
  customer_name: string;
  rating: number;
  comment?: string;
}
