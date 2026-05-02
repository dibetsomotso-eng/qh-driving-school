import { NextResponse } from 'next/server';
import { getReviews } from '@/lib/reviews';

export const revalidate = 21600;

export async function GET() {
  try {
    const { reviews, stats } = await getReviews();
    
    return NextResponse.json({
      reviews,
      totalRating: stats.totalRating,
      totalReviews: stats.totalReviews,
      status: reviews.length > 0 ? 'success' : 'fallback'
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
