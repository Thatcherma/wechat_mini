import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// 获取所有菜品
export async function GET() {
  try {
    const dishes = await db.dish.findMany({
      include: { category: true },
      orderBy: [{ categoryId: 'asc' }, { sort: 'asc' }]
    });
    return NextResponse.json(dishes);
  } catch (error) {
    console.error('获取菜品失败:', error);
    return NextResponse.json({ error: '获取菜品失败' }, { status: 500 });
  }
}

// 创建菜品
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, image, categoryId, spicy, recommend, sort } = body;
    
    const dish = await db.dish.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        categoryId,
        spicy: spicy || 0,
        recommend: recommend || false,
        sort: sort || 0
      }
    });
    return NextResponse.json(dish);
  } catch (error) {
    console.error('创建菜品失败:', error);
    return NextResponse.json({ error: '创建菜品失败' }, { status: 500 });
  }
}
