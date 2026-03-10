import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// 获取单个订单
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await db.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { dish: true }
        }
      }
    });
    
    if (!order) {
      return NextResponse.json({ error: '订单不存在' }, { status: 404 });
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('获取订单失败:', error);
    return NextResponse.json({ error: '获取订单失败' }, { status: 500 });
  }
}

// 更新订单状态
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;
    
    const order = await db.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: { dish: true }
        }
      }
    });
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('更新订单失败:', error);
    return NextResponse.json({ error: '更新订单失败' }, { status: 500 });
  }
}
