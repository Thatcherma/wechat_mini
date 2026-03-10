'use client';

import { Dish } from './types';
import { useCartStore } from '@/stores/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DishCardProps {
  dish: Dish;
}

const spicyLabels = ['', '微辣', '中辣', '特辣'];

export function DishCard({ dish }: DishCardProps) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find(i => i.dishId === dish.id);

  const handleAdd = () => {
    addItem({
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image
    });
  };

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity(dish.id, cartItem.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      if (cartItem.quantity <= 1) {
        removeItem(dish.id);
      } else {
        updateQuantity(dish.id, cartItem.quantity - 1);
      }
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-3 flex gap-3">
        {/* 图片区域 */}
        <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
          {dish.image ? (
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-3xl">
              🍽️
            </div>
          )}
        </div>

        {/* 信息区域 */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-base truncate">{dish.name}</h3>
              {dish.recommend && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0">
                  推荐
                </Badge>
              )}
            </div>
            {dish.description && (
              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                {dish.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-primary font-bold text-lg">
                ¥{dish.price.toFixed(2)}
              </span>
              {dish.spicy > 0 && (
                <div className="flex items-center text-orange-500">
                  <Flame className="w-3.5 h-3.5" />
                  <span className="text-xs ml-0.5">{spicyLabels[dish.spicy]}</span>
                </div>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end items-center gap-2 mt-1">
            {cartItem ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleDecrement}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">
                  {cartItem.quantity}
                </span>
                <Button
                  variant="default"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleIncrement}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={handleAdd} className="h-7 px-3">
                <Plus className="h-3.5 w-3.5 mr-1" />
                添加
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
