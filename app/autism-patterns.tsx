import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSettings } from '@/lib/settings';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { FadeIn } from '@/components/Transitions';
import { useSpeech } from '@/lib/useSpeech';
import { autismPatternSets } from '@/lib/learningData';
import { ArrowLeft, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function AutismPatternsScreen() {
  const { theme, settings } = useSettings();
  const { speak } = useSpeech();
  const [currentSet, setCurrentSet] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const set = autismPatternSets[currentSet];
  const isCorrect = selected === set.answer;

  const handleSelect = (opt: string) => {
    if (showResult) return;
    setSelected(opt);
    setShowResult(true);
    if (settings.speechEnabled) {
      speak(opt === set.answer ? 'Great job!' : "Let's try again.");
    }
  };

  const handleNext = () => {
    if (currentSet + 1 < autismPatternSets.length) {
      setCurrentSet((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back">
          <ArrowLeft size={24} color={theme.colors.text} />
        </Pressable>
        <ThemedText variant="title" bold>Patterns</ThemedText>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FadeIn>
          <Card elevation style={styles.promptCard}>
            <ThemedText variant="subtitle" bold style={{ textAlign: 'center' }}>{set.title}</ThemedText>
            <ThemedText variant="caption" muted style={{ textAlign: 'center', marginTop: 4 }}>
              What comes next?
            </ThemedText>
          </Card>
        </FadeIn>

        <Card style={styles.sequenceCard}>
          <View style={styles.sequenceRow}>
            {set.sequence.map((emoji, i) => (
              <View key={i} style={styles.seqItem}>
                <ThemedText style={{ fontSize: 40 }}>{emoji}</ThemedText>
              </View>
            ))}
            <View style={[styles.seqItem, styles.questionItem, { borderColor: theme.colors.autism }]}>
              <ThemedText style={{ fontSize: 40 }}>?</ThemedText>
            </View>
          </View>
        </Card>

        <ThemedText variant="subtitle" bold style={{ marginTop: 20, marginBottom: 8 }}>Choose the answer</ThemedText>
        <View style={styles.optionsRow}>
          {set.options.map((opt, i) => {
            const isAnswer = opt === set.answer;
            const isSelected = opt === selected;
            let bgColor = theme.colors.surface;
            let borderColor = theme.colors.borderLight;
            if (showResult) {
              if (isAnswer) { bgColor = theme.colors.success + '18'; borderColor = theme.colors.success; }
              else if (isSelected) { bgColor = theme.colors.surfaceAlt; borderColor = theme.colors.border; }
            }
            return (
              <Pressable
                key={i}
                onPress={() => handleSelect(opt)}
                disabled={showResult}
                style={({ pressed }) => [styles.optionCard, { backgroundColor: bgColor, borderColor, opacity: pressed ? 0.85 : 1 }]}
                accessibilityRole="button"
                accessibilityLabel={`Option ${opt}`}
              >
                <ThemedText style={{ fontSize: 40, textAlign: 'center' }}>{opt}</ThemedText>
                {showResult && isAnswer && <Check size={20} color={theme.colors.success} style={{ position: 'absolute', top: 6, right: 6 }} />}
              </Pressable>
            );
          })}
        </View>

        {showResult && (
          <FadeIn>
            <Card elevation style={styles.feedbackCard}>
              <ThemedText variant="subtitle" bold color={isCorrect ? theme.colors.success : theme.colors.textMuted} style={{ textAlign: 'center' }}>
                {isCorrect ? 'Great job!' : "Let's try again."}
              </ThemedText>
              <View style={{ marginTop: 16 }}>
                <Button
                  title={currentSet + 1 < autismPatternSets.length ? 'Next' : 'Finish'}
                  onPress={handleNext}
                  fullWidth
                />
              </View>
            </Card>
          </FadeIn>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  scrollContent: { padding: 16, paddingBottom: 40, maxWidth: isTablet ? 700 : '100%', alignSelf: 'center', width: '100%' },
  promptCard: { alignItems: 'center', padding: 20 },
  sequenceCard: { alignItems: 'center', padding: 20, marginTop: 16 },
  sequenceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', alignItems: 'center' },
  seqItem: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#F0F4FA', justifyContent: 'center', alignItems: 'center' },
  questionItem: { borderWidth: 3, borderStyle: 'dashed' },
  optionsRow: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginTop: 8 },
  optionCard: { borderWidth: 2, borderRadius: 16, padding: 16, alignItems: 'center', minWidth: 90, position: 'relative' },
  feedbackCard: { alignItems: 'center', padding: 24, marginTop: 20 },
});
