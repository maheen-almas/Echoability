import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSettings } from '@/lib/settings';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { FadeIn } from '@/components/Transitions';
import { useSpeech } from '@/lib/useSpeech';
import { autismRoutines, type Routine } from '@/lib/learningData';
import { ArrowLeft, Check, Volume2, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function AutismRoutinesScreen() {
  const { theme, settings } = useSettings();
  const { speak } = useSpeech();
  const [selected, setSelected] = useState<Routine | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  if (selected) {
    const allDone = completedSteps.length === selected.steps.length;
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerBar}>
          <Pressable onPress={() => { setSelected(null); setCompletedSteps([]); }} accessibilityRole="button" accessibilityLabel="Back">
            <ArrowLeft size={24} color={theme.colors.text} />
          </Pressable>
          <ThemedText variant="title" bold>{selected.title}</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card elevation style={styles.routineCard}>
            <ThemedText style={{ fontSize: 48, textAlign: 'center' }}>{selected.emoji}</ThemedText>
            <ThemedText variant="subtitle" bold style={{ textAlign: 'center', marginTop: 8 }}>{selected.title}</ThemedText>
            <ThemedText variant="caption" muted style={{ textAlign: 'center' }}>Follow each step in order</ThemedText>
          </Card>

          <View style={styles.stepsList}>
            {selected.steps.map((step, i) => {
              const done = completedSteps.includes(i);
              const isNext = !done && completedSteps.length === i;
              return (
                <Pressable
                  key={i}
                  onPress={() => {
                    if (done) {
                      setCompletedSteps((prev) => prev.filter((s) => s !== i));
                    } else {
                      setCompletedSteps((prev) => [...prev, i]);
                      if (settings.speechEnabled) speak(step.step);
                    }
                  }}
                  style={({ pressed }) => [
                    styles.stepRow,
                    {
                      backgroundColor: done ? theme.colors.success + '15' : isNext ? theme.colors.autism + '12' : theme.colors.surface,
                      borderColor: done ? theme.colors.success : isNext ? theme.colors.autism : theme.colors.borderLight,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Step ${i + 1}: ${step.step}. ${done ? 'Completed' : 'Not done yet'}`}
                >
                  <View style={[styles.stepNumber, { backgroundColor: done ? theme.colors.success : theme.colors.autism }]}>
                    {done ? <Check size={20} color="#FFFFFF" /> : <ThemedText bold color="#FFFFFF">{i + 1}</ThemedText>}
                  </View>
                  <ThemedText style={{ fontSize: 28 }}>{step.emoji}</ThemedText>
                  <ThemedText variant="body" bold style={{ flex: 1 }}>{step.step}</ThemedText>
                  {settings.speechEnabled && (
                    <Pressable onPress={() => speak(step.step)} accessibilityRole="button" accessibilityLabel="Play step audio">
                      <Volume2 size={18} color={theme.colors.primary} />
                    </Pressable>
                  )}
                </Pressable>
              );
            })}
          </View>

          {allDone && (
            <Card elevation style={styles.doneCard}>
              <ThemedText style={{ fontSize: 48, textAlign: 'center' }}>🎉</ThemedText>
              <ThemedText variant="subtitle" bold style={{ textAlign: 'center' }}>All done! Great job!</ThemedText>
              <View style={{ marginTop: 16 }}>
                <Button title="Back to Routines" onPress={() => { setSelected(null); setCompletedSteps([]); }} fullWidth />
              </View>
            </Card>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back">
          <ArrowLeft size={24} color={theme.colors.text} />
        </Pressable>
        <ThemedText variant="title" bold>Daily Routines</ThemedText>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FadeIn>
          <ThemedText variant="body" muted style={{ marginBottom: 16 }}>
            Follow these steps to complete your routine.
          </ThemedText>
        </FadeIn>
        {autismRoutines.map((r, i) => (
          <FadeIn key={r.id} delay={i * 80}>
            <Card
              onPress={() => { setSelected(r); setCompletedSteps([]); }}
              elevation
              style={styles.routineLink}
              accessibilityLabel={`${r.title} - ${r.steps.length} steps`}
            >
              <View style={[styles.routineEmoji, { backgroundColor: theme.colors.autism + '18' }]}>
                <ThemedText style={{ fontSize: 32 }}>{r.emoji}</ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="subtitle" bold>{r.title}</ThemedText>
                <ThemedText variant="caption" muted>{r.steps.length} steps</ThemedText>
              </View>
              <ChevronRight size={24} color={theme.colors.textMuted} />
            </Card>
          </FadeIn>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  scrollContent: { padding: 16, paddingBottom: 40, maxWidth: isTablet ? 700 : '100%', alignSelf: 'center', width: '100%' },
  routineCard: { alignItems: 'center', padding: 24, marginBottom: 16 },
  routineLink: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12, padding: 16 },
  routineEmoji: { width: 60, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  stepsList: { gap: 10 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 2, borderRadius: 14, padding: 14 },
  stepNumber: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  doneCard: { alignItems: 'center', padding: 24, marginTop: 20 },
});
