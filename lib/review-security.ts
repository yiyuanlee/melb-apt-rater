import { createHash } from 'crypto';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const REVIEW_CONTENT_MAX = 1000;

export function getClientIp(headerStore: Headers): string {
  const forwarded = headerStore.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  const realIp = headerStore.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return 'unknown';
}

export function hashClientIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

export type ReviewInput = {
  apartmentId: string;
  score: number;
  content: string;
};

export function parseReviewInput(formData: FormData): ReviewInput | { error: string } {
  const apartmentId = String(formData.get('apartmentId') ?? '').trim();
  const scoreRaw = formData.get('score');
  const content = String(formData.get('content') ?? '').trim();

  if (!UUID_RE.test(apartmentId)) {
    return { error: '无效的公寓 ID' };
  }

  const score =
    typeof scoreRaw === 'string' ? parseInt(scoreRaw, 10) : Number(scoreRaw);
  if (!Number.isInteger(score) || score < 1 || score > 10) {
    return { error: '请选择 1–10 分的有效评分' };
  }

  if (!content) {
    return { error: '请填写评价内容' };
  }
  if (content.length > REVIEW_CONTENT_MAX) {
    return { error: `评价内容不能超过 ${REVIEW_CONTENT_MAX} 字` };
  }

  return { apartmentId, score, content };
}
