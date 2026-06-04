'use server'

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import {
  getClientIp,
  hashClientIp,
  parseReviewInput,
} from '@/lib/review-security';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function submitReview(formData: FormData) {
  const parsed = parseReviewInput(formData);
  if ('error' in parsed) {
    return { error: parsed.error };
  }

  const { apartmentId, score, content } = parsed;

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
    return { error: '服务未配置完成，请联系管理员' };
  }

  const headersList = await headers();
  const ipHash = hashClientIp(getClientIp(headersList));

  const { data: apartment, error: aptError } = await supabaseAdmin
    .from('apartments')
    .select('id')
    .eq('id', apartmentId)
    .maybeSingle();

  if (aptError || !apartment) {
    return { error: '公寓不存在' };
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: existing } = await supabaseAdmin
    .from('reviews')
    .select('id')
    .eq('apartment_id', apartmentId)
    .eq('ip_hash', ipHash)
    .gte('created_at', since)
    .maybeSingle();

  if (existing) {
    return { error: '⚠️ 提交太频繁了，24小时内只能评一次哦' };
  }

  const { error } = await supabaseAdmin.from('reviews').insert({
    apartment_id: apartmentId,
    score,
    content,
    ip_hash: ipHash,
  });

  if (error) {
    console.error('Supabase Error:', error);
    return { error: '提交失败，请重试' };
  }

  revalidatePath(`/apartment/${apartmentId}`);
  revalidatePath('/');

  return { success: true };
}
