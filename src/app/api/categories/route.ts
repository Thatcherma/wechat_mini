import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// 获取所有分类
export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: {
        dishes: {
          where: { available: true },
          orderBy: { sort: 'asc' }
        }
      },
      orderBy: { sort: 'asc' }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('获取分类失败:', error);
    return NextResponse.json({ error: '获取分类失败' }, { status: 500 });
  }
}

// 创建分类
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, icon, sort } = body;
    
    const category = await db.category.create({
      data: { name, icon, sort: sort || 0 }
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('创建分类失败:', error);
    return NextResponse.json({ error: '创建分类失败' }, { status: 500 });
  }
}
