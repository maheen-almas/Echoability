import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, ScrollView, Pressable, Dimensions } from 'react-native';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Quiz } from '@/components/Quiz';
import { TracingCanvas } from '@/components/TracingCanvas';
import { FadeIn } from '@/components/Transitions';
import { useSpeech } from '@/lib/useSpeech';
import { saveProgress, checkAndUnlockAchievements, fetchProgress } from '@/lib/progress';
import {
  numbers0to50,
  numbers51to100,
  mathsQuiz,
  mathLevels,
  lessonId,
  type NumberItem,
} from '@/lib/learningData';
import { ArrowLeft, Volume2, Lock, ChevronRight, PenLine, ListChecks, Plus, Minus, Scale } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

type Section = 'menu' | 'levels' | 'numbers' | 'tracing' | 'quiz' | 'number';

export default function MathsScreen() {
  const { profile, user } = useAuth();
  const { theme, settings } = useSettings();
  const { speak } = useSpeech();
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode = profile?.learning_mode ?? (params.mode as 'dyslexia' | 'autism') ?? 'dyslexia';
  const calmMode = mode === 'autism' || settings.calmMode;

  const [section, setSection] = useState<Section>('menu');
  const [selectedNumber, setSelectedNumber] = useState<NumberItem | null>(null);
  const [completedLevels, setCompletedLevels] = useState<string[]>([]);

  const handleQuizComplete = async (score: number, stars: number) => {
    if (!user) return;
    const lid = lessonId(mode, 'maths', 'quiz');
    await saveProgress(user.id, lid, 'maths', score, stars, score * 5);
    const records = await fetchProgress(user.id);
    await checkAndUnlockAchievements(user.id, records);
  };

  const handleLevelComplete = async (levelId: string) => {
    if (!user || completedLevels.includes(levelId)) return;
    setCompletedLevels((prev) => [...prev, levelId]);
    const lid = lessonId(mode, 'maths', `level_${levelId}`);
    await saveProgress(user.id, lid, 'maths', 100, 3, 10);
    const records = await fetchProgress(user.id);
    await checkAndUnlockAchievements(user.id, records);
  };

  // ---- Number detail ----
  if (section === 'number' && selectedNumber) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerBar}>
          <Pressable onPress={() => setSection('numbers')} accessibilityRole="button" accessibilityLabel="Back">
            <ArrowLeft size={24} color={theme.colors.text} />
          </Pressable>
          <ThemedText variant="title" bold>Number {selectedNumber.value}</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card elevation style={styles.numberCard}>
            <ThemedText style={{ fontSize: 100, textAlign: 'center', fontWeight: '900' }}>
              {selectedNumber.value}
            </ThemedText>
            <ThemedText variant="subtitle" muted style={{ textAlign: 'center' }}>
              {selectedNumber.word}
            </ThemedText>
            {settings.speechEnabled && (
              <View style={{ marginTop: 16, alignItems: 'center' }}>
                <Button
                  title="Play Voice"
                  variant="secondary"
                  icon={<Volume2 size={20} color="#FFFFFF" />}
                  onPress={() => speak(`Number ${selectedNumber.value}. ${selectedNumber.word}.`)}
                />
              </View>
            )}
          </Card>
          <View style={{ marginTop: 16 }}>
            <ThemedText variant="subtitle" bold>Trace the number</ThemedText>
            <View style={{ marginTop: 12 }}>
              <TracingCanvas character={String(selectedNumber.value)} calmMode={calmMode} />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ---- Numbers list ----
  if (section === 'numbers') {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerBar}>
          <Pressable onPress={() => setSection('levels')} accessibilityRole="button" accessibilityLabel="Back">
            <ArrowLeft size={24} color={theme.colors.text} />
          </Pressable>
          <ThemedText variant="title" bold>Numbers</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.numberGrid}>
            {numbers0to50.map((item) => (
              <Pressable
                key={item.value}
                onPress={() => { setSelectedNumber(item); setSection('number'); if (settings.speechEnabled) speak(`Number ${item.value}`); }}
                style={({ pressed }) => [
                  styles.numberTile,
                  { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderLight, opacity: pressed ? 0.8 : 1 },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Number ${item.value}, ${item.word}`}
              >
                <ThemedText variant="title" bold>{item.value}</ThemedText>
                <ThemedText variant="caption" muted>{item.word}</ThemedText>
              </Pressable>
            ))}
          </View>
          <ThemedText variant="subtitle" bold style={{ marginTop: 20, marginBottom: 12 }}>51 – 100</ThemedText>
          <View style={styles.numberGrid}>
            {numbers51to100.map((item) => (
              <Pressable
                key={item.value}
                onPress={() => { setSelectedNumber(item); setSection('number'); if (settings.speechEnabled) speak(`Number ${item.value}`); }}
                style={({ pressed }) => [
                  styles.numberTile,
                  { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderLight, opacity: pressed ? 0.8 : 1 },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Number ${item.value}, ${item.word}`}
              >
                <ThemedText variant="title" bold>{item.value}</ThemedText>
                <ThemedText variant="caption" muted>{item.word}</ThemedText>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // ---- Tracing ----
  if (section === 'tracing') {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerBar}>
          <Pressable onPress={() => setSection('menu')} accessibilityRole="button" accessibilityLabel="Back">
            <ArrowLeft size={24} color={theme.colors.text} />
          </Pressable>
          <ThemedText variant="title" bold>Tracing</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card elevation>
            <ThemedText variant="subtitle" bold>Trace the number 5</ThemedText>
            <View style={{ marginTop: 12 }}>
              <TracingCanvas character="5" calmMode={calmMode} />
            </View>
          </Card>
        </ScrollView>
      </View>
    );
  }

  // ---- Quiz ----
  if (section === 'quiz') {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerBar}>
          <Pressable onPress={() => setSection('menu')} accessibilityRole="button" accessibilityLabel="Back">
            <ArrowLeft size={24} color={theme.colors.text} />
          </Pressable>
          <ThemedText variant="title" bold>Maths Quiz</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Quiz
            questions={mathsQuiz}
            onComplete={handleQuizComplete}
            onExit={() => setSection('menu')}
            calmMode={calmMode}
            title="Maths Quiz"
          />
        </ScrollView>
      </View>
    );
  }

  // ---- Levels ----
  if (section === 'levels') {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerBar}>
          <Pressable onPress={() => setSection('menu')} accessibilityRole="button" accessibilityLabel="Back">
            <ArrowLeft size={24} color={theme.colors.text} />
          </Pressable>
          <ThemedText variant="title" bold>Levels</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {mathLevels.map((level, idx) => {
            const isLocked = idx > 0 && !completedLevels.includes(mathLevels[idx - 1].id);
            const isCompleted = completedLevels.includes(level.id);
            return (
              <Card
                key={level.id}
                onPress={() => {
                  if (isLocked) return;
                  if (level.id === 'level_addition' || level.id === 'level_subtraction' || level.id === 'level_compare') {
                    setSection('quiz');
                  } else {
                    setSection('numbers');
                  }
                  handleLevelComplete(level.id);
                }}
                style={[styles.levelCard, isLocked && { opacity: 0.5 }]}
                accessibilityLabel={`${level.title} ${isLocked ? 'locked' : isCompleted ? 'completed' : 'available'}`}
              >
                <View style={styles.levelRow}>
                  <View style={[styles.levelEmoji, { backgroundColor: isCompleted ? theme.colors.success + '22' : theme.colors.surfaceAlt }]}>
                    {isLocked ? (
                      <Lock size={28} color={theme.colors.textMuted} />
                    ) : (
                      <ThemedText style={{ fontSize: 28 }}>{level.emoji}</ThemedText>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText variant="subtitle" bold>{level.title}</ThemedText>
                    <ThemedText variant="caption" muted>{level.subtitle}</ThemedText>
                  </View>
                  {isCompleted ? (
                    <ThemedText style={{ fontSize: 24 }}>✓</ThemedText>
                  ) : (
                    <ChevronRight size={24} color={theme.colors.textMuted} />
                  )}
                </View>
              </Card>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  // ---- Menu ----
  const menuItems = [
    { id: 'levels', title: 'Levels', subtitle: 'Progress through levels', emoji: '🎯', section: 'levels' as Section },
    { id: 'tracing', title: 'Tracing', subtitle: 'Practice writing numbers', emoji: '✏️', section: 'tracing' as Section },
    { id: 'quiz', title: 'Quiz', subtitle: 'Test your knowledge', emoji: '❓', section: 'quiz' as Section },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back">
          <ArrowLeft size={24} color={theme.colors.text} />
        </Pressable>
        <ThemedText variant="title" bold>Maths</ThemedText>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FadeIn>
          <ThemedText variant="subtitle" muted style={{ marginBottom: 16 }}>
            Numbers & counting
          </ThemedText>
        </FadeIn>
        <View style={styles.menuList}>
          {menuItems.map((item) => (
            <Card
              key={item.id}
              onPress={() => setSection(item.section)}
              accessibilityLabel={`${item.title} - ${item.subtitle}`}
              style={styles.menuCard}
            >
              <View style={styles.menuRow}>
                <View style={[styles.menuEmoji, { backgroundColor: theme.colors.surfaceAlt }]}>
                  <ThemedText style={{ fontSize: 28 }}>{item.emoji}</ThemedText>
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText variant="subtitle" bold>{item.title}</ThemedText>
                  <ThemedText variant="caption" muted>{item.subtitle}</ThemedText>
                </View>
                <ChevronRight size={24} color={theme.colors.textMuted} />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  scrollContent: { padding: 16, paddingBottom: 40, maxWidth: isTablet ? 800 : '100%', alignSelf: 'center', width: '100%' },
  menuList: { gap: 12 },
  menuCard: { padding: 16 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuEmoji: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  numberGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  numberTile: { borderWidth: 1.5, borderRadius: 12, padding: 10, alignItems: 'center', minWidth: 72, gap: 2 },
  numberCard: { alignItems: 'center', padding: 24 },
  levelCard: { marginBottom: 12 },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  levelEmoji: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
});
