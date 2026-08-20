import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View, ScrollView, Pressable, Dimensions } from 'react-native';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { FadeIn } from '@/components/Transitions';
import { useSpeech } from '@/lib/useSpeech';
import { saveProgress, checkAndUnlockAchievements, fetchProgress } from '@/lib/progress';
import { activityCategories, type ActivityCategory } from '@/lib/learningData';
import { ArrowLeft, Volume2, ChevronRight, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function ActivitiesScreen() {
  const { profile, user } = useAuth();
  const { theme, settings } = useSettings();
  const { speak } = useSpeech();
  const [selected, setSelected] = useState<ActivityCategory | null>(null);

  const isAutism = profile?.learning_mode === 'autism';

  const handleItemPress = async (name: string, emoji: string) => {
    if (settings.speechEnabled) speak(name);
    if (user) {
      const lid = `${profile?.learning_mode ?? 'dyslexia'}_activity_${selected?.id}_${name}`;
      await saveProgress(user.id, lid, 'activity', 100, 1, 2);
      const records = await fetchProgress(user.id);
      await checkAndUnlockAchievements(user.id, records);
    }
  };

  if (selected) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerBar}>
          <Pressable onPress={() => setSelected(null)} accessibilityRole="button" accessibilityLabel="Back">
            <ArrowLeft size={24} color={theme.colors.text} />
          </Pressable>
          <View style={styles.headerTitle}>
            <ThemedText style={{ fontSize: 24 }}>{selected.emoji}</ThemedText>
            <ThemedText variant="title" bold>{selected.title}</ThemedText>
          </View>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.itemGrid}>
            {selected.items.map((item, i) => (
              <Card
                key={i}
                onPress={() => handleItemPress(item.name, item.emoji)}
                style={styles.itemCard}
                accessibilityLabel={`${item.name} ${item.emoji}`}
              >
                <ThemedText style={{ fontSize: 40, textAlign: 'center' }}>{item.emoji}</ThemedText>
                <ThemedText variant="subtitle" bold style={{ textAlign: 'center', marginTop: 8 }}>{item.name}</ThemedText>
                {settings.speechEnabled && (
                  <View style={styles.playIcon}>
                    <Volume2 size={18} color={theme.colors.primary} />
                  </View>
                )}
              </Card>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <FadeIn>
        <ThemedText variant="title" bold>Special Activities</ThemedText>
        <ThemedText variant="body" muted style={{ marginTop: 4 }}>Games & fun learning</ThemedText>
      </FadeIn>

      <View style={styles.categoryList}>
        {activityCategories.map((cat, i) => (
          <FadeIn key={cat.id} delay={i * 50}>
            <Card
              onPress={() => setSelected(cat)}
              elevation
              style={styles.categoryCard}
              accessibilityLabel={`${cat.title} - ${cat.items.length} items`}
            >
              <View style={[styles.categoryEmoji, { backgroundColor: cat.color + '18' }]}>
                <ThemedText style={{ fontSize: 32 }}>{cat.emoji}</ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="subtitle" bold>{cat.title}</ThemedText>
                <ThemedText variant="caption" muted>{cat.items.length} items</ThemedText>
              </View>
              <ChevronRight size={24} color={theme.colors.textMuted} />
            </Card>
          </FadeIn>
        ))}
      </View>

      {isAutism && (
        <FadeIn delay={400}>
          <Card elevation style={{ marginTop: 16 }}>
            <ThemedText variant="subtitle" bold>Autism Activities</ThemedText>
            <ThemedText variant="caption" muted style={{ marginTop: 4 }}>Structured learning activities</ThemedText>
            <View style={{ marginTop: 12, gap: 10 }}>
              <Card onPress={() => router.push('/autism-routines')} style={styles.autismLink}>
                <ThemedText style={{ fontSize: 24 }}>📋</ThemedText>
                <ThemedText variant="body" bold style={{ flex: 1 }}>Daily Routines</ThemedText>
                <ChevronRight size={20} color={theme.colors.textMuted} />
              </Card>
              <Card onPress={() => router.push('/autism-emotions')} style={styles.autismLink}>
                <ThemedText style={{ fontSize: 24 }}>😊</ThemedText>
                <ThemedText variant="body" bold style={{ flex: 1 }}>Emotions</ThemedText>
                <ChevronRight size={20} color={theme.colors.textMuted} />
              </Card>
              <Card onPress={() => router.push('/autism-vocab')} style={styles.autismLink}>
                <ThemedText style={{ fontSize: 24 }}>📚</ThemedText>
                <ThemedText variant="body" bold style={{ flex: 1 }}>Vocabulary</ThemedText>
                <ChevronRight size={20} color={theme.colors.textMuted} />
              </Card>
              <Card onPress={() => router.push('/autism-matching')} style={styles.autismLink}>
                <ThemedText style={{ fontSize: 24 }}>🧩</ThemedText>
                <ThemedText variant="body" bold style={{ flex: 1 }}>Matching</ThemedText>
                <ChevronRight size={20} color={theme.colors.textMuted} />
              </Card>
              <Card onPress={() => router.push('/autism-sorting')} style={styles.autismLink}>
                <ThemedText style={{ fontSize: 24 }}>🔄</ThemedText>
                <ThemedText variant="body" bold style={{ flex: 1 }}>Sorting</ThemedText>
                <ChevronRight size={20} color={theme.colors.textMuted} />
              </Card>
              <Card onPress={() => router.push('/autism-patterns')} style={styles.autismLink}>
                <ThemedText style={{ fontSize: 24 }}>🔲</ThemedText>
                <ThemedText variant="body" bold style={{ flex: 1 }}>Patterns</ThemedText>
                <ChevronRight size={20} color={theme.colors.textMuted} />
              </Card>
            </View>
          </Card>
        </FadeIn>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, maxWidth: isTablet ? 800 : '100%', alignSelf: 'center', width: '100%' },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scrollContent: { padding: 16, paddingBottom: 40, maxWidth: isTablet ? 800 : '100%', alignSelf: 'center', width: '100%' },
  categoryList: { marginTop: 16, gap: 12 },
  categoryCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  categoryEmoji: { width: 60, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  itemGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  itemCard: { alignItems: 'center', padding: 16, minWidth: 140, flex: 1, maxWidth: 200 },
  playIcon: { marginTop: 8 },
  autismLink: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
});
