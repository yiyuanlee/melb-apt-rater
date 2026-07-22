import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { resolveCoverImage } from '@/lib/cover-image';

interface ApartmentProps {
  id: string;
  name: string;
  cover_image: string | null; // 允许数据库返回 null
  rating_avg: number;
  rating_count: number;
  tags: string[];
}

export default function ApartmentCard({ apartment }: { apartment: ApartmentProps }) {
  const displayImage = resolveCoverImage(apartment.cover_image);

  const scoreColor = apartment.rating_avg >= 9.0 ? 'bg-[#c01d2e]' : 
                     apartment.rating_avg >= 6.0 ? 'bg-[#ff4d4f]' : 'bg-gray-500';

  return (
    <Link href={`/apartment/${apartment.id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
        
        {/* 图片区域 */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <Image
            src={displayImage}
            alt={apartment.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            // 添加 sizes 优化性能
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* 评分角标 */}
          <div className={`absolute top-0 right-0 px-3 py-2 ${scoreColor} text-white rounded-bl-xl shadow-lg`}>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black italic tracking-tighter">
                {apartment.rating_avg}
              </span>
              <span className="text-xs font-medium opacity-80">分</span>
            </div>
          </div>
        </div>

        {/* 信息区域 */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-[#c01d2e]">
            {apartment.name}
          </h3>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {apartment.tags?.map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-md">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{apartment.rating_count} 人评价</span>
            </div>
            <div className="flex items-center gap-1 text-[#c01d2e] font-medium">
              <span>点击打分</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}