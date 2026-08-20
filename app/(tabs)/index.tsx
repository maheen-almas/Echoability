import { useEffect, useState, useCallback } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View, ScrollView, Pressable, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ProgressRing } from '@/components/ProgressRing';
import { FadeIn } from '@/components/Transitions';
import { fetchProgress, fetchUserAchievements, summarizeProgress, type ProgressRecord, type UserAchievement } from '@/lib/progress';
import { achievements as allAchievements } from '@/lib/learningData';
import { BookOpen, Calculator, Gamepad2, Trophy, Star, Coins, Flame, ChevronRight, Calendar, ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

const autismSchedule = [
  { id: 'welcome', label: 'Welcome', emoji: '👋', route: null as string | null },
  { id: 'english', label: 'English', emoji: '🔤', route: '/english' },
  { id: 'maths', label: 'Maths', emoji: '🔢', route: '/maths' },
  { id: 'activity', label: 'Activity', emoji: '🎨', route: '/(tabs)/activities' },
  { id: 'finish', label: 'Finish', emoji: '⭐', route: '/achievements' },
];

export default function HomeScreen() {
  const { user, profile } = useAuth();
  const { theme } = useSettings();
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [userAch, setUserAch] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    const [p, a] = await Promise.all([
      fetchProgress(user.id),
      fetchUserAchievements(user.id),
    ]);
    setProgress(p);
    setUserAch(a);
    setLoading(false);
    setRefreshing(false);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const summary = summarizeProgress(progress);
  const unlockedAch = userAch.filter((a) => a.unlocked).length;
  const isAutism = profile?.learning_mode === 'autism';

  const moduleCards = [
    { title: 'English', subtitle: 'Letters, words & sentences', emoji: '🔤', color: theme.colors.primary, route: '/english', icon: <BookOpen size={28} color={theme.colors.primary} /> },
    { title: 'Maths', subtitle: 'Numbers & counting', emoji: '🔢', color: theme.colors.secondary, route: '/maths', icon: <Calculator size={28} color={theme.colors.secondary} /> },
    { title: 'Special Activities', subtitle: 'Games & fun learning', emoji: '🎨', color: theme.colors.accent, route: '/(tabs)/activities', icon: <Gamepad2 size={28} color={theme.colors.accent} /> },
    { title: 'Achievements', subtitle: 'See your badges', emoji: '🏆', color: theme.colors.success, route: '/achievements', icon: <Trophy size={28} color={theme.colors.success} /> },
  ];

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor={theme.colors.primary} />}
    >
      <FadeIn>
        <View style={styles.greeting}>
          <View style={{ flex: 1 }}>
            <ThemedText variant="caption" muted>Hello,</ThemedText>
            <ThemedText variant="title" bold>{profile?.name ?? 'Learner'}!</ThemedText>
            <View style={[styles.modeBadge, { backgroundColor: isAutism ? theme.colors.autism + '22' : theme.colors.dyslexia + '22' }]}>
              <ThemedText variant="label" bold color={isAutism ? theme.colors.autism : theme.colors.dyslexia}>
                {isAutism ? 'Autism Mode' : 'Dyslexia Mode'}
              </ThemedText>
            </View>
          </View>
          <ProgressRing progress={summary.completedLessons / Math.max(summary.completedLessons + 4, 8)} size={72} />
        </View>
      </FadeIn>

      {/* Progress stats */}
      <FadeIn delay={100}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Star size={20} color={theme.colors.warning} fill={theme.colors.warning} />
            <ThemedText variant="title" bold>{summary.totalStars}</ThemedText>
            <ThemedText variant="label" muted>Stars</ThemedText>
          </Card>
          <Card style={styles.statCard}>
            <Coins size={20} color={theme.colors.accent} />
            <ThemedText variant="title" bold>{summary.totalCoins}</ThemedText>
            <ThemedText variant="label" muted>Coins</ThemedText>
          </Card>
          <Card style={styles.statCard}>
            <Flame size={20} color={theme.colors.error} />
            <ThemedText variant="title" bold>{summary.streak}</ThemedText>
            <ThemedText variant="label" muted>Streak</ThemedText>
          </Card>
          <Card style={styles.statCard}>
            <Trophy size={20} color={theme.colors.success} />
            <ThemedText variant="title" bold>{unlockedAch}</ThemedText>
            <ThemedText variant="label" muted>Badges</ThemedText>
          </Card>
        </View>
      </FadeIn>

      {/* Autism visual schedule */}
      {isAutism && (
        <FadeIn delay={150}>
          <Card elevation style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <Calendar size={20} color={theme.colors.autism} />
              <ThemedText variant="subtitle" bold>Today's Schedule</ThemedText>
            </View>
            <View style={styles.scheduleSteps}>
              {autismSchedule.map((step, i) => (
                <View key={step.id} style={styles.scheduleItem}>
                  <View style={[styles.scheduleCircle, { backgroundColor: i === 0 ? theme.colors.autism : theme.colors.surfaceAlt, borderColor: theme.colors.autism }]}>
                    <ThemedText style={{ fontSize: 20 }}>{step.emoji}</ThemedText>
                  </View>
                  <ThemedText variant="caption" bold style={{ flex: 1 }}>{step.label}</ThemedText>
                  {step.route && (
                    <Pressable onPress={() => router.push(step.route as any)} accessibilityRole="button" accessibilityLabel={`Go to ${step.label}`}>
                      <ArrowRight size={20} color={theme.colors.autism} />
                    </Pressable>
                  )}
                  {i < autismSchedule.length - 1 && <View style={styles.scheduleConnector} />}
                </View>
              ))}
            </View>
          </Card>
        </FadeIn>
      )}

      {/* Learning modules */}
      <FadeIn delay={200}>
        <ThemedText variant="subtitle" bold style={{ marginTop: 24, marginBottom: 12 }}>
          {isAutism ? "Today's Learning" : 'Learning Modules'}
        </ThemedText>
      </FadeIn>

      <View style={styles.modulesGrid}>
        {moduleCards.map((mod, i) => (
          <FadeIn key={mod.title} delay={250 + i * 50}>
            <Card
              onPress={() => router.push(mod.route as any)}
              elevation
              style={styles.moduleCard}
              accessibilityLabel={`${mod.title} - ${mod.subtitle}`}
            >
              <View style={[styles.moduleEmoji, { backgroundColor: mod.color + '18' }]}>
                <ThemedText style={{ fontSize: 32 }}>{mod.emoji}</ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="subtitle" bold>{mod.title}</ThemedText>
                <ThemedText variant="caption" muted>{mod.subtitle}</ThemedText>
              </View>
              <ChevronRight size={24} color={theme.colors.textMuted} />
            </Card>
          </FadeIn>
        ))}
      </View>

      {/* Progress section */}
      <FadeIn delay={500}>
        <Card elevation style={{ marginTop: 24 }}>
          <View style={styles.progressHeader}>
            <ThemedText variant="subtitle" bold>Your Progress</ThemedText>
            <ThemedText variant="caption" muted>{summary.completedLessons} lessons done</ThemedText>
          </View>
          <View style={styles.progressBarOuter}>
            <View style={[styles.progressBarInner, { width: `${Math.min(summary.completedLessons * 10, 100)}%`, backgroundColor: theme.colors.primary }]} />
          </View>
          <ThemedText variant="caption" muted style={{ marginTop: 8 }}>
            Keep going to earn more stars and badges!
          </ThemedText>
        </Card>
      </FadeIn>

      {/* Recent achievements preview */}
      <FadeIn delay={550}>
        <ThemedText variant="subtitle" bold style={{ marginTop: 24, marginBottom: 12 }}>Recent Badges</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {allAchievements.slice(0, 4).map((ach) => {
            const unlocked = userAch.some((a) => a.achievement_id === ach.id && a.unlocked);
            return (
              <Card key={ach.id} style={[styles.badgeCard, !unlocked && { opacity: 0.5 }]}>
                <ThemedText style={{ fontSize: 32, textAlign: 'center' }}>{unlocked ? ach.emoji : '🔒'}</ThemedText>
                <ThemedText variant="label" bold style={{ textAlign: 'center', marginTop: 4 }}>{ach.title}</ThemedText>
              </Card>
            );
          })}
        </ScrollView>
      </FadeIn>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16, paddingBottom: 40, maxWidth: isTablet ? 900 : '100%', alignSelf: 'center', width: '100%' },
  greeting: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  modeBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 6 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  statCard: { alignItems: 'center', flex: 1, padding: 12, gap: 4 },
  scheduleCard: { marginBottom: 8 },
  scheduleHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  scheduleSteps: { gap: 4 },
  scheduleItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6, position: 'relative' },
  scheduleCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
  scheduleConnector: { position: 'absolute', left: 21, top: 48, width: 2, height: 8, backgroundColor: '#CCC' },
  modulesGrid: { gap: 12 },
  moduleCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  moduleEmoji: { width: 60, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  progressBarOuter: { height: 10, backgroundColor: '#E1E8F0', borderRadius: 5 },
  progressBarInner: { height: 10, borderRadius: 5 },
  badgeCard: { alignItems: 'center', padding: 14, minWidth: 100 },
});
