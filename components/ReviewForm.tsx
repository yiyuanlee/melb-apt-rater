'use client'

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitReview } from '@/app/actions';

export default function ReviewForm({ apartmentId }: { apartmentId: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    if (score === 0) {
      setIsSuccess(false);
      setMessage('还没打分呢！');
      return;
    }
    setIsSubmitting(true);
    setMessage('');
    setIsSuccess(false);

    const result = await submitReview(formData);

    if (result.error) {
      setIsSuccess(false);
      setMessage(result.error);
    } else {
      setIsSuccess(true);
      setMessage('评价成功！');
      setScore(0);
      formRef.current?.reset();
      router.refresh();
    }
    setIsSubmitting(false);
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h3 className="font-bold text-lg mb-4">我来打分</h3>
      
      <form ref={formRef} action={handleSubmit}>
        <input type="hidden" name="apartmentId" value={apartmentId} />
        <input type="hidden" name="score" value={score} />

        {/* 虎扑风数字打分条 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setScore(num)}
              className={`w-8 h-8 rounded font-bold text-sm transition-all
                ${score >= num ? 'bg-[#c01d2e] text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}
              `}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-500 mb-4">当前打分: <span className="font-bold text-[#c01d2e]">{score}</span> 分</div>

        <textarea
          name="content"
          required
          maxLength={1000}
          placeholder="展开说说，这公寓隔音怎么样？电梯快吗？"
          className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#c01d2e] min-h-[100px]"
        />

        <div className="flex justify-between items-center mt-4">
          <span
            className={`text-sm font-bold ${
              isSuccess ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-black text-white rounded-full font-bold hover:bg-gray-800 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? '提交中...' : '发布评价'}
          </button>
        </div>
      </form>
    </div>
  );
}