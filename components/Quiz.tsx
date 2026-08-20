import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Volume2, X, Check, Star } from 'lucide-react-native';
import { ThemedText } from './ThemedText';
import { Button } from './Button';
import { Card } from './Card';
import { useSettings } from '@/lib/settings';
import { useSpeech } from '@/lib/useSpeech';
import type { QuizQuestion } from '@/lib/learningData';

type QuizProps = {
  questions: QuizQuestion[];
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
  calmMode?: boolean;
  title?: string;
};

export function Quiz({ questions, onComplete, onExit, calmMode = false, title = 'Quiz' }: QuizProps) {
  const { theme, settings } = useSettings();
  const { speak } = useSpeech();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = questions[current];

  useEffect(() => {
    if (settings.speechEnabled && question?.speakText) {
      speak(question.speakText, { rate: calmMode ? 0.8 : 0.9 });
    }
  }, [current]);

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelected(index);
    setShowFeedback(true);
    if (index === question.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      const stars = score >= questions.length * 0.8 ? 3 : score >= questions.length * 0.5 ? 2 : 1;
      setFinished(true);
      onComplete(score, stars);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowFeedback(false);
    }
  };

  if (finished) {
    const stars = score >= questions.length * 0.8 ? 3 : score >= questions.length * 0.5 ? 2 : 1;
    return (
      <Card elevation style={styles.container}>
        <View style={styles.finishedHeader}>
          <ThemedText variant="title" bold>{calmMode ? 'All done!' : 'Quiz Complete!'}</ThemedText>
        </View>
        <View style={styles.starsRow}>
          {[0, 1, 2].map((i) => (
            <Star
              key={i}
              size={48}
              color={i < stars ? theme.colors.warning : theme.colors.border}
              fill={i < stars ? theme.colors.warning : 'transparent'}
              strokeWidth={2}
            />
          ))}
        </View>
        <ThemedText variant="subtitle" muted style={{ marginTop: 12 }}>
          You got {score} out of {questions.length} correct
        </ThemedText>
        <View style={{ marginTop: 24, width: '100%' }}>
          <Button title="Finish" onPress={onExit} fullWidth size="lg" />
        </View>
      </Card>
    );
  }

  return (
    <Card elevation style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <ThemedText variant="caption" muted>{title}</ThemedText>
          <ThemedText variant="title" bold>Question {current + 1} of {questions.length}</ThemedText>
        </View>
        <Pressable onPress={onExit} accessibilityRole="button" accessibilityLabel="Exit quiz">
          <X size={24} color={theme.colors.textMuted} />
        </Pressable>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((current) / questions.length) * 100}%`, backgroundColor: theme.colors.primary },
          ]}
        />
      </View>

      <View style={styles.questionArea}>
        {question.emoji && (
          <ThemedText style={{ fontSize: 64, textAlign: 'center', marginBottom: 8 }}>
            {question.emoji}
          </ThemedText>
        )}
        <View style={styles.questionRow}>
          <ThemedText variant="subtitle" bold style={{ flex: 1, textAlign: 'center' }}>
            {question.question}
          </ThemedText>
          {settings.speechEnabled && (
            <Pressable
              onPress={() => speak(question.speakText ?? question.question)}
              accessibilityRole="button"
              accessibilityLabel="Play question audio"
            >
              <Volume2 size={24} color={theme.colors.primary} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.optionsGrid}>
        {question.options.map((opt, i) => {
          const isCorrect = i === question.answer;
          const isSelected = i === selected;
          let bgColor = theme.colors.surfaceAlt;
          let borderColor = theme.colors.border;
          let textColor = theme.colors.text;

          if (showFeedback) {
            if (isCorrect) {
              bgColor = theme.colors.success + '22';
              borderColor = theme.colors.success;
            } else if (isSelected) {
              bgColor = calmMode ? theme.colors.surfaceAlt : theme.colors.error + '22';
              borderColor = calmMode ? theme.colors.border : theme.colors.error;
            }
          }

          return (
            <Pressable
              key={i}
              onPress={() => handleSelect(i)}
              disabled={showFeedback}
              accessibilityRole="button"
              accessibilityLabel={`Option ${opt}`}
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor: bgColor,
                  borderColor,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              {showFeedback && isCorrect && <Check size={20} color={theme.colors.success} />}
              <ThemedText bold style={{ color: textColor, textAlign: 'center' }}>{opt}</ThemedText>
            </Pressable>
          );
        })}
      </View>

      {showFeedback && (
        <View style={styles.feedbackArea}>
          <ThemedText
            variant="subtitle"
            bold
            color={selected === question.answer ? theme.colors.success : theme.colors.textMuted}
          >
            {selected === question.answer
              ? calmMode ? 'Great job!' : 'Correct!'
              : calmMode ? "Let's try again." : 'Not quite right.'}
          </ThemedText>
          <View style={{ marginTop: 12, width: '100%' }}>
            <Button title="Next" onPress={handleNext} fullWidth />
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 24, width: '100%' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  progressBar: { width: '100%', height: 6, backgroundColor: '#E1E8F0', borderRadius: 3, marginTop: 12 },
  progressFill: { height: 6, borderRadius: 3 },
  questionArea: { alignItems: 'center', marginVertical: 24, width: '100%' },
  questionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, width: '100%' },
  option: {
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    minWidth: 140,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  feedbackArea: { alignItems: 'center', marginTop: 20, width: '100%' },
  finishedHeader: { alignItems: 'center', marginBottom: 16 },
  starsRow: { flexDirection: 'row', gap: 12 },
});
