'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface OrderSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNo: string;
}

export function OrderSuccessDialog({ open, onOpenChange, orderNo }: OrderSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm text-center">
        <DialogHeader>
          <div className="flex justify-center my-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <DialogTitle className="text-xl">下单成功</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground mb-2">订单号</p>
          <p className="font-mono text-lg font-semibold">{orderNo}</p>
          <p className="text-sm text-muted-foreground mt-4">
            请记住您的订单号，稍后服务员会为您上菜
          </p>
        </div>
        <Button className="w-full" onClick={() => onOpenChange(false)}>
          继续点餐
        </Button>
      </DialogContent>
    </Dialog>
  );
}
