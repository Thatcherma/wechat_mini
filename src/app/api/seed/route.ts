import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// 初始化测试数据
export async function POST() {
  try {
    // 创建分类
    const categories = await Promise.all([
      db.category.create({
        data: { name: '热销推荐', icon: '🔥', sort: 0 }
      }),
      db.category.create({
        data: { name: '招牌菜品', icon: '⭐', sort: 1 }
      }),
      db.category.create({
        data: { name: '凉菜', icon: '🥗', sort: 2 }
      }),
      db.category.create({
        data: { name: '热菜', icon: '🍲', sort: 3 }
      }),
      db.category.create({
        data: { name: '主食', icon: '🍚', sort: 4 }
      }),
      db.category.create({
        data: { name: '饮料', icon: '🥤', sort: 5 }
      })
    ]);

    // 创建菜品
    const dishes = [
      // 热销推荐
      { name: '宫保鸡丁', description: '经典川菜，麻辣鲜香', price: 38, categoryId: categories[0].id, spicy: 2, recommend: true },
      { name: '水煮鱼', description: '鲜嫩鱼片，麻辣过瘾', price: 68, categoryId: categories[0].id, spicy: 3, recommend: true },
      { name: '麻婆豆腐', description: '麻辣烫鲜，下饭神器', price: 28, categoryId: categories[0].id, spicy: 2, recommend: true },
      
      // 招牌菜品
      { name: '东坡肘子', description: '肥而不腻，入口即化', price: 88, categoryId: categories[1].id, spicy: 0, recommend: true },
      { name: '糖醋里脊', description: '酸甜可口，外酥里嫩', price: 48, categoryId: categories[1].id, spicy: 0, recommend: true },
      { name: '红烧肉', description: '传统名菜，浓油赤酱', price: 58, categoryId: categories[1].id, spicy: 0, recommend: true },
      
      // 凉菜
      { name: '口水鸡', description: '麻辣鲜香，开胃爽口', price: 38, categoryId: categories[2].id, spicy: 2 },
      { name: '拍黄瓜', description: '清脆爽口，解腻开胃', price: 18, categoryId: categories[2].id, spicy: 1 },
      { name: '凉拌木耳', description: '爽脆可口，营养丰富', price: 22, categoryId: categories[2].id, spicy: 0 },
      { name: '皮蛋豆腐', description: '嫩滑爽口，清香开胃', price: 25, categoryId: categories[2].id, spicy: 0 },
      
      // 热菜
      { name: '鱼香肉丝', description: '酸甜微辣，经典家常', price: 35, categoryId: categories[3].id, spicy: 1 },
      { name: '回锅肉', description: '肥瘦相间，香而不腻', price: 42, categoryId: categories[3].id, spicy: 2 },
      { name: '干煸豆角', description: '外焦里嫩，麻辣干香', price: 28, categoryId: categories[3].id, spicy: 2 },
      { name: '蒜蓉西兰花', description: '清淡健康，营养丰富', price: 25, categoryId: categories[3].id, spicy: 0 },
      { name: '番茄炒蛋', description: '酸甜可口，老少皆宜', price: 22, categoryId: categories[3].id, spicy: 0 },
      { name: '红烧茄子', description: '软糯入味，下饭佳品', price: 26, categoryId: categories[3].id, spicy: 0 },
      
      // 主食
      { name: '蛋炒饭', description: '粒粒分明，金黄诱人', price: 15, categoryId: categories[4].id, spicy: 0 },
      { name: '阳春面', description: '清淡爽口，汤鲜味美', price: 12, categoryId: categories[4].id, spicy: 0 },
      { name: '担担面', description: '麻辣鲜香，四川风味', price: 18, categoryId: categories[4].id, spicy: 2 },
      { name: '饺子', description: '皮薄馅大，鲜香可口', price: 25, categoryId: categories[4].id, spicy: 0 },
      
      // 饮料
      { name: '可乐', description: '冰镇可口可乐', price: 8, categoryId: categories[5].id, spicy: 0 },
      { name: '雪碧', description: '冰镇雪碧', price: 8, categoryId: categories[5].id, spicy: 0 },
      { name: '酸梅汤', description: '解暑消渴，酸甜可口', price: 12, categoryId: categories[5].id, spicy: 0 },
      { name: '鲜榨橙汁', description: '新鲜橙子榨汁', price: 18, categoryId: categories[5].id, spicy: 0 }
    ];

    for (let i = 0; i < dishes.length; i++) {
      await db.dish.create({
        data: { ...dishes[i], sort: i }
      });
    }

    return NextResponse.json({ 
      message: '数据初始化成功', 
      categories: categories.length, 
      dishes: dishes.length 
    });
  } catch (error) {
    console.error('初始化数据失败:', error);
    return NextResponse.json({ error: '初始化数据失败' }, { status: 500 });
  }
}
