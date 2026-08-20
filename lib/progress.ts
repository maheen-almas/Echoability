import { supabase } from './supabase';
import { achievements as allAchievements } from './learningData';

export type ProgressRecord = {
  id: string;
  user_id: string;
  lesson_id: string;
  subject: string;
  score: number;
  stars: number;
  completed: boolean;
  coins: number;
  created_at: string;
  updated_at: string;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked: boolean;
  unlocked_at: string | null;
};

export type ProgressSummary = {
  totalLessons: number;
  completedLessons: number;
  totalStars: number;
  totalCoins: number;
  streak: number;
};

export async function fetchProgress(userId: string): Promise<ProgressRecord[]> {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId);
  if (error) return [];
  return (data ?? []) as ProgressRecord[];
}

export async function fetchUserAchievements(userId: string): Promise<UserAchievement[]> {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId);
  if (error) return [];
  return (data ?? []) as UserAchievement[];
}

export async function saveProgress(
  userId: string,
  lessonId: string,
  subject: string,
  score: number,
  stars: number,
  coins: number
): Promise<{ error: string | null }> {
  const existing = await supabase
    .from('progress')
    .select('id, stars, coins')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .maybeSingle();

  if (existing.error) return { error: existing.error.message };

  if (existing.data) {
    const bestStars = Math.max(existing.data.stars, stars);
    const totalCoins = existing.data.coins + coins;
    const { error } = await supabase
      .from('progress')
      .update({
        score,
        stars: bestStars,
        coins: totalCoins,
        completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.data.id);
    return { error: error?.message ?? null };
  }

  const { error } = await supabase.from('progress').insert({
    user_id: userId,
    lesson_id: lessonId,
    subject,
    score,
    stars,
    coins,
    completed: true,
  });
  return { error: error?.message ?? null };
}

export async function unlockAchievement(
  userId: string,
  achievementId: string
): Promise<void> {
  const existing = await supabase
    .from('user_achievements')
    .select('id')
    .eq('user_id', userId)
    .eq('achievement_id', achievementId)
    .maybeSingle();

  if (existing.data) {
    await supabase
      .from('user_achievements')
      .update({ unlocked: true, unlocked_at: new Date().toISOString() })
      .eq('id', existing.data.id);
    return;
  }

  await supabase.from('user_achievements').insert({
    user_id: userId,
    achievement_id: achievementId,
    unlocked: true,
    unlocked_at: new Date().toISOString(),
  });
}

export function summarizeProgress(records: ProgressRecord[]): ProgressSummary {
  const completed = records.filter((r) => r.completed);
  const totalStars = completed.reduce((sum, r) => sum + r.stars, 0);
  const totalCoins = completed.reduce((sum, r) => sum + r.coins, 0);
  const uniqueLessons = new Set(completed.map((r) => r.lesson_id)).size;
  return {
    totalLessons: records.length,
    completedLessons: uniqueLessons,
    totalStars,
    totalCoins,
    streak: Math.min(completed.length, 7),
  };
}

export async function checkAndUnlockAchievements(
  userId: string,
  records: ProgressRecord[]
): Promise<string[]> {
  const newlyUnlocked: string[] = [];
  const completed = records.filter((r) => r.completed);
  const completedLessonIds = completed.map((r) => r.lesson_id);

  for (const achievement of allAchievements) {
    let shouldUnlock = false;
    switch (achievement.id) {
      case 'first_lesson':
        shouldUnlock = completed.length >= 1;
        break;
      case 'alphabet_explorer':
        shouldUnlock = completedLessonIds.some((l) => l.includes('english_alphabet'));
        break;
      case 'number_explorer':
        shouldUnlock = completedLessonIds.some((l) => l.includes('maths_numbers') || l.includes('maths_level'));
        break;
      case 'math_whiz':
        shouldUnlock = completedLessonIds.some((l) => l.includes('maths_quiz'));
        break;
      case 'activity_star':
        shouldUnlock = completedLessonIds.filter((l) => l.includes('activity')).length >= 5;
        break;
      case 'learning_champion':
        shouldUnlock = completed.length >= 10;
        break;
    }
    if (shouldUnlock) {
      await unlockAchievement(userId, achievement.id);
      newlyUnlocked.push(achievement.id);
    }
  }
  return newlyUnlocked;
}
