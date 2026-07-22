import ReviewForm from '@/components/ReviewForm';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { resolveCoverImage } from '@/lib/cover-image';
import { supabase } from '@/lib/supabase';

// 强制动态渲染，确保每次访问都获取最新评分
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>
}

export default async function ApartmentDetail({ params }: Props) {
  const { id } = await params;

  // 并行获取：公寓详情 + 评论列表
  const [aptResult, reviewsResult] = await Promise.all([
    supabase.from('apartments').select('*').eq('id', id).single(),
    supabase.from('reviews').select('*').eq('apartment_id', id).order('upvotes', { ascending: false })
  ]);

  const apartment = aptResult.data;
  const reviews = reviewsResult.data || [];

  if (!apartment) return notFound();

  const displayImage = resolveCoverImage(apartment.cover_image);

  return (
    <div className="min-h-screen bg-[#f7f7f8] pb-20">
      
      {/* 顶部大图区 */}
      <div className="relative h-64 md:h-80 w-full bg-gray-900">
        <Image 
          src={displayImage}
          alt={apartment.name} 
          fill 
          className="object-cover opacity-70"
          // 添加 priority 属性，让大图优先加载，LCP 体验更好
          priority
        />
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-3xl mx-auto flex items-end justify-between text-white">
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-2">
                {apartment.name}
              </h1>
              <p className="opacity-90">{apartment.location} · {apartment.tags?.join(' / ')}</p>
            </div>
            <div className="text-right">
              {/* 根据分数变色 */}
              <div className={`text-6xl font-black italic leading-none ${apartment.rating_avg >= 9 ? 'text-[#ff4d4f]' : 'text-white'}`}>
                {apartment.rating_avg}
              </div>
              <div className="text-sm opacity-70 mt-1">{apartment.rating_count} 人已评价</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-6 relative z-10">
        
        {/* 打分组件 */}
        <ReviewForm apartmentId={apartment.id} />

        {/* 评论列表 */}
        <div className="space-y-4">
        <h3 className="font-bold text-gray-900 text-lg">评论区 ({reviews.length})</h3>
          
          {reviews.length === 0 && (
            <div className="text-center py-10 text-gray-400 bg-white rounded-xl">还没有人评价，快来抢沙发！</div>
          )}

          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-0.5 rounded text-xs font-bold text-white
                    ${review.score >= 9 ? 'bg-[#c01d2e]' : review.score >= 6 ? 'bg-[#ff4d4f]' : 'bg-gray-400'}
                  `}>
                    {review.score} 分
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {review.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}