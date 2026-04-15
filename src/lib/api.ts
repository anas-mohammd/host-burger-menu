import axios from 'axios';
import { PublicMenuResponse, OrderPayload, OrderResult, ReviewCreate, ReviewsListResponse } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const client = axios.create({ baseURL: BASE_URL });

// Fix image URLs that were saved with localhost origin
function fixImageUrls(data: PublicMenuResponse): PublicMenuResponse {
  const fix = (url?: string | null): string | null => {
    if (!url) return null;
    // مسار نسبي مثل /uploads/... → نضيف الـ API base
    if (url.startsWith('/uploads/')) return `${BASE_URL}${url}`;
    // رابط localhost مطلق → نستبدله بالـ API
    return url.replace(/^https?:\/\/localhost(:\d+)?/, BASE_URL);
  };
  return {
    ...data,
    restaurant: { ...data.restaurant, logo_url: fix(data.restaurant.logo_url) },
    items: data.items.map((item) => ({ ...item, image_url: fix(item.image_url) })),
    categories: data.categories.map((cat) => ({ ...cat, image_url: fix(cat.image_url) })),
  };
}

export const menuApi = {
  getMenu: async (slug: string): Promise<PublicMenuResponse> => {
    const { data } = await client.get<PublicMenuResponse>(`/public/menu/${slug}`);
    return fixImageUrls(data);
  },

  placeOrder: async (slug: string, payload: OrderPayload): Promise<OrderResult> => {
    const { data } = await client.post<OrderResult>(`/public/menu/${slug}/order`, payload);
    return data;
  },

  getReviews: async (slug: string): Promise<ReviewsListResponse> => {
    const { data } = await client.get<ReviewsListResponse>(`/public/menu/${slug}/reviews`);
    return data;
  },

  submitReview: async (slug: string, payload: ReviewCreate): Promise<void> => {
    await client.post(`/public/menu/${slug}/reviews`, payload);
  },
};
