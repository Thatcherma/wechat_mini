import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// 获取订单列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const orders = await db.order.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        items: {
          include: { dish: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('获取订单失败:', error);
    return NextResponse.json({ error: '获取订单失败' }, { status: 500 });
  }
}

// 创建订单
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableNo, customerName, phone, remark, items } = body;
    
    // 生成订单号
    const orderNo = `ORD${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    // 计算总金额
    const dishIds = items.map((item: { dishId: string }) => item.dishId);
    const dishes = await db.dish.findMany({
      where: { id: { in: dishIds } }
    });
    
    const dishMap = new Map(dishes.map(d => [d.id, d]));
    let totalAmount = 0;
    
    const orderItems = items.map((item: { dishId: string; quantity: number; remark?: string }) => {
      const dish = dishMap.get(item.dishId);
      if (!dish) throw new Error(`菜品不存在: ${item.dishId}`);
      totalAmount += dish.price * item.quantity;
      return {
        dishId: item.dishId,
        quantity: item.quantity,
        price: dish.price,
        remark: item.remark
      };
    });
    
    const order = await db.order.create({
      data: {
        orderNo,
        tableNo,
        customerName,
        phone,
        remark,
        totalAmount,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: { dish: true }
        }
      }
    });
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('创建订单失败:', error);
    return NextResponse.json({ error: '创建订单失败' }, { status: 500 });
  }
}
