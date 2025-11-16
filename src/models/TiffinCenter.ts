export interface TiffinCenter {
  _id: string;
  name: string;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  description: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  phone: string;
  email?: string;
  cuisine: string[];
  menu: MenuItem[];
  rating: number;
  reviewCount: number;
  images: Array<{ url: string; publicId?: string }>;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  deliveryRadius: number;
  operatingHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;
}