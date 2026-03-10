'use client';

import { useState } from 'react';
import { useCartStore } from '@/stores/cart';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (orderNo: string) => void;
}

export function CheckoutDialog({ open, onOpenChange, onSuccess }: CheckoutDialogProps) {
  const { items, tableNo, customerName, phone, remark, setTableNo, setCustomerName, setPhone, setRemark, getTotalAmount, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (items.length === 0) {
      setError('购物车是空的');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNo,
          customerName,
          phone,
          remark,
          items: items.map(item => ({
            dishId: item.dishId,
            quantity: item.quantity,
            remark: item.remark
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '下单失败');
      }

      clearCart();
      onSuccess(data.orderNo);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '下单失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>确认订单</DialogTitle>
          <DialogDescription>
            请填写就餐信息，确认后提交订单
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tableNo">桌号</Label>
            <Input
              id="tableNo"
              placeholder="请输入桌号（如：A01）"
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerName">联系人</Label>
            <Input
              id="customerName"
              placeholder="请输入您的姓名"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">联系电话</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remark">备注</Label>
            <Textarea
              id="remark"
              placeholder="有什么特殊要求？"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={2}
            />
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-2">订单详情</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {items.map((item) => (
                <div key={item.dishId} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>¥{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-semibold text-lg mt-3 pt-3 border-t">
              <span>合计</span>
              <span className="text-primary">¥{getTotalAmount().toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            提交订单
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
