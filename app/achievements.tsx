import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { FadeIn } from '@/components/Transitions';
import { ArrowLeft, Lock, Star, Trophy } from 'lucide-react-native';
import { achievements } from '@/lib/learningData';
import { fetchUserAchievements, type UserAchievement } from '@/lib/progress';

export default function AchievementsScreen() {
  const { user } = useAuth();
  const { theme } = useSettings();
  const [userAch, setUserAch] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchUserAchievements(user.id).then((data) => {
      setUserAch(data);
      setLoading(false);
    });
  }, [user]);

  const isUnlocked = (id: string) => userAch.some((a) => a.achievement_id === id && a.unlocked);
  const unlockedCount = achievements.filter((a) => isUnlocked(a.id)).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back">
          <ArrowLeft size={24} color={theme.colors.text} />
        </Pressable>
        <ThemedText variant="title" bold>Achievements</ThemedText>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FadeIn>
          <Card elevation style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Trophy size={40} color={theme.colors.accent} />
              <View style={{ flex: 1 }}>
                <ThemedText variant="subtitle" bold>{unlockedCount} of {achievements.length}</ThemedText>
                <ThemedText variant="caption" muted>Badges unlocked</ThemedText>
              </View>
            </View>
          </Card>
        </FadeIn>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.grid}>
            {achievements.map((ach) => {
              const unlocked = isUnlocked(ach.id);
              return (
                <Card
                  key={ach.id}
                  style={[styles.achCard, !unlocked && { opacity: 0.6 }]}
                  accessibilityLabel={`${ach.title} ${unlocked ? 'unlocked' : 'locked'}`}
                >
                  <View style={[styles.achIcon, { backgroundColor: unlocked ? theme.colors.accent + '22' : theme.colors.surfaceAlt }]}>
                    {unlocked ? (
                      <ThemedText style={{ fontSize: 36 }}>{ach.emoji}</ThemedText>
                    ) : (
                      <Lock size={32} color={theme.colors.textMuted} />
                    )}
                  </View>
                  <ThemedText variant="subtitle" bold style={{ textAlign: 'center', marginTop: 8 }}>{ach.title}</ThemedText>
                  <ThemedText variant="caption" muted style={{ textAlign: 'center', marginTop: 4 }}>{ach.description}</ThemedText>
                  {unlocked && (
                    <View style={styles.unlockedBadge}>
                      <Star size={14} color={theme.colors.warning} fill={theme.colors.warning} />
                      <ThemedText variant="label" bold color={theme.colors.warning}>Unlocked</ThemedText>
                    </View>
                  )}
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  summaryCard: { marginBottom: 20 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  achCard: { alignItems: 'center', padding: 16, minWidth: 160, maxWidth: 200, flex: 1 },
  achIcon: { width: 72, height: 72, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  unlockedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
});
