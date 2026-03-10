'use client';

import { useState, useEffect, useCallback } from 'react';
import { Category, Dish } from './types';
import { CategoryNav } from './CategoryNav';
import { DishCard } from './DishCard';
import { CartSheet } from './CartSheet';
import { CheckoutDialog } from './CheckoutDialog';
import { OrderSuccessDialog } from './OrderSuccessDialog';
import { useCartStore } from '@/stores/cart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Loader2, Utensils } from 'lucide-react';

export function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [orderNo, setOrderNo] = useState('');
  const { getTotalAmount, getTotalCount } = useCartStore();

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
      if (data.length > 0 && !activeCategory) {
        setActiveCategory(data[0].id);
      }
    } catch (error) {
      console.error('获取菜单失败:', error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCheckout = () => {
    setCheckoutOpen(true);
  };

  const handleOrderSuccess = (no: string) => {
    setOrderNo(no);
    setSuccessOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentCategory = categories.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Utensils className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">美食点餐</h1>
          </div>
          <CartSheet onCheckout={handleCheckout} />
        </div>
      </header>

      {/* Category Navigation */}
      <CategoryNav
        categories={categories}
        activeId={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* Menu Content */}
      <main className="flex-1 p-4">
        {currentCategory && currentCategory.dishes.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{currentCategory.icon}</span>
              <h2 className="text-lg font-semibold">{currentCategory.name}</h2>
              <Badge variant="secondary">{currentCategory.dishes.length}道菜</Badge>
            </div>
            {currentCategory.dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Utensils className="h-16 w-16 mb-4 opacity-50" />
            <p>暂无菜品</p>
          </div>
        )}
      </main>

      {/* Bottom Cart Bar */}
      {getTotalCount() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-30">
          <div className="max-w-lg mx-auto flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span className="font-semibold">¥{getTotalAmount().toFixed(2)}</span>
                <Badge variant="secondary">{getTotalCount()}件</Badge>
              </div>
            </div>
            <Button onClick={handleCheckout}>
              去结算
            </Button>
          </div>
        </div>
      )}

      {/* Checkout Dialog */}
      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        onSuccess={handleOrderSuccess}
      />

      {/* Success Dialog */}
      <OrderSuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        orderNo={orderNo}
      />
    </div>
  );
}
