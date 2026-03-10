export interface Category {
  id: string;
  name: string;
  icon: string | null;
  sort: number;
  dishes: Dish[];
}

export interface Dish {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  categoryId: string;
  available: boolean;
  recommend: boolean;
  spicy: number;
  sort: number;
  category?: {
    id: string;
    name: string;
  };
}

export interface Order {
  id: string;
  orderNo: string;
  tableNo: string | null;
  customerName: string | null;
  phone: string | null;
  remark: string | null;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  dishId: string;
  quantity: number;
  price: number;
  remark: string | null;
  dish: {
    id: string;
    name: string;
    price: number;
  };
}
