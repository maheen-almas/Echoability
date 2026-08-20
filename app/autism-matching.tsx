import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSettings } from '@/lib/settings';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { FadeIn } from '@/components/Transitions';
import { useSpeech } from '@/lib/useSpeech';
import { autismMatchingSets } from '@/lib/learningData';
import { ArrowLeft, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

type MatchPair = { emoji: string; word: string };

export default function AutismMatchingScreen() {
  const { theme, settings } = useSettings();
  const { speak } = useSpeech();
  const set = autismMatchingSets[0];
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);

  const handleEmojiPress = (emoji: string) => {
    setSelectedEmoji(emoji);
    if (selectedWord) tryMatch(emoji, selectedWord);
  };

  const handleWordPress = (word: string) => {
    setSelectedWord(word);
    if (selectedEmoji) tryMatch(selectedEmoji, word);
  };

  const tryMatch = (emoji: string, word: string) => {
    const pair = set.items.find((i) => i.emoji === emoji && i.word === word);
    if (pair) {
      setMatched((prev) => [...prev, emoji, word]);
      setSelectedEmoji(null);
      setSelectedWord(null);
      if (settings.speechEnabled) speak(`${pair.emoji} is ${pair.word}`);
    } else {
      setSelectedEmoji(null);
      setSelectedWord(null);
    }
  };

  const allMatched = matched.length === set.items.length * 2;
  const shuffledWords = [...set.items.map((i) => i.word)].sort(() => 0.5 - Math.random());

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back">
          <ArrowLeft size={24} color={theme.colors.text} />
        </Pressable>
        <ThemedText variant="title" bold>Matching</ThemedText>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FadeIn>
          <Card elevation style={styles.promptCard}>
            <ThemedText variant="subtitle" bold style={{ textAlign: 'center' }}>{set.title}</ThemedText>
            <ThemedText variant="caption" muted style={{ textAlign: 'center', marginTop: 4 }}>
              Match each picture with its word.
            </ThemedText>
          </Card>
        </FadeIn>

        <ThemedText variant="subtitle" bold style={{ marginTop: 20, marginBottom: 8 }}>Pictures</ThemedText>
        <View style={styles.row}>
          {set.items.map((item: MatchPair, i) => {
            const isMatched = matched.includes(item.emoji);
            const isSelected = selectedEmoji === item.emoji;
            return (
              <Pressable
                key={i}
                onPress={() => !isMatched && handleEmojiPress(item.emoji)}
                style={({ pressed }) => [
                  styles.matchCard,
                  {
                    backgroundColor: isMatched ? theme.colors.success + '18' : isSelected ? theme.colors.autism + '18' : theme.colors.surface,
                    borderColor: isMatched ? theme.colors.success : isSelected ? theme.colors.autism : theme.colors.borderLight,
                    opacity: isMatched ? 0.6 : pressed ? 0.85 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={item.word}
                accessibilityState={{ selected: isSelected, disabled: isMatched }}
              >
                <ThemedText style={{ fontSize: 40, textAlign: 'center' }}>{item.emoji}</ThemedText>
                {isMatched && <Check size={20} color={theme.colors.success} style={{ position: 'absolute', top: 6, right: 6 }} />}
              </Pressable>
            );
          })}
        </View>

        <ThemedText variant="subtitle" bold style={{ marginTop: 20, marginBottom: 8 }}>Words</ThemedText>
        <View style={styles.row}>
          {shuffledWords.map((word, i) => {
            const isMatched = matched.includes(word);
            const isSelected = selectedWord === word;
            return (
              <Pressable
                key={i}
                onPress={() => !isMatched && handleWordPress(word)}
                style={({ pressed }) => [
                  styles.matchCard,
                  {
                    backgroundColor: isMatched ? theme.colors.success + '18' : isSelected ? theme.colors.autism + '18' : theme.colors.surface,
                    borderColor: isMatched ? theme.colors.success : isSelected ? theme.colors.autism : theme.colors.borderLight,
                    opacity: isMatched ? 0.6 : pressed ? 0.85 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={word}
                accessibilityState={{ selected: isSelected, disabled: isMatched }}
              >
                <ThemedText variant="subtitle" bold style={{ textAlign: 'center' }}>{word}</ThemedText>
                {isMatched && <Check size={20} color={theme.colors.success} style={{ position: 'absolute', top: 6, right: 6 }} />}
              </Pressable>
            );
          })}
        </View>

        {allMatched && (
          <FadeIn>
            <Card elevation style={styles.doneCard}>
              <ThemedText style={{ fontSize: 48, textAlign: 'center' }}>🎉</ThemedText>
              <ThemedText variant="subtitle" bold color={theme.colors.success} style={{ textAlign: 'center' }}>
                You did it! Great job!
              </ThemedText>
              <View style={{ marginTop: 16 }}>
                <Button title="Play Again" variant="outline" onPress={() => { setMatched([]); setSelectedEmoji(null); setSelectedWord(null); }} fullWidth />
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
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  matchCard: { borderWidth: 2, borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center', minWidth: 120, minHeight: 90, flex: 1, maxWidth: 160, position: 'relative' },
  doneCard: { alignItems: 'center', padding: 24, marginTop: 20 },
});
