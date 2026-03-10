import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  dishId: string;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
  remark?: string;
}

interface CartState {
  items: CartItem[];
  tableNo: string;
  customerName: string;
  phone: string;
  remark: string;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  updateRemark: (dishId: string, remark: string) => void;
  clearCart: () => void;
  
  // Order info
  setTableNo: (tableNo: string) => void;
  setCustomerName: (name: string) => void;
  setPhone: (phone: string) => void;
  setRemark: (remark: string) => void;
  
  // Computed
  getTotalAmount: () => number;
  getTotalCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tableNo: '',
      customerName: '',
      phone: '',
      remark: '',
      
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(i => i.dishId === item.dishId);
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.dishId === item.dishId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              )
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },
      
      removeItem: (dishId) => {
        set((state) => ({
          items: state.items.filter(i => i.dishId !== dishId)
        }));
      },
      
      updateQuantity: (dishId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(dishId);
          return;
        }
        set((state) => ({
          items: state.items.map(i =>
            i.dishId === dishId ? { ...i, quantity } : i
          )
        }));
      },
      
      updateRemark: (dishId, remark) => {
        set((state) => ({
          items: state.items.map(i =>
            i.dishId === dishId ? { ...i, remark } : i
          )
        }));
      },
      
      clearCart: () => {
        set({ items: [], remark: '' });
      },
      
      setTableNo: (tableNo) => set({ tableNo }),
      setCustomerName: (customerName) => set({ customerName }),
      setPhone: (phone) => set({ phone }),
      setRemark: (remark) => set({ remark }),
      
      getTotalAmount: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      
      getTotalCount: () => {
        return get().items.reduce(
          (count, item) => count + item.quantity,
          0
        );
      }
    }),
    {
      name: 'order-cart'
    }
  )
);
