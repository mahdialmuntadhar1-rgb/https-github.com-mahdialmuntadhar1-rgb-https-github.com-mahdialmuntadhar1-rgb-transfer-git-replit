/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Business {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  category_id: string;
  city_id: string;
  address: string;
  phone: string;
  email?: string;
  website: string;
  rating: number;
  image_url: string;
  opening_hours?: string;
  is_verified?: boolean;
  owner_id?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_ar: string;
  icon: string;
  color?: string;
}

export interface City {
  id: string;
  name: string;
  name_ar: string;
}

export type View = 'home' | 'list' | 'dashboard' | 'login' | 'register';
export type DashboardSection = 'listings' | 'add' | 'stats' | 'settings';
