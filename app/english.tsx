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
  alphabet,
  alphabetAM,
  alphabetNZ,
  sentences,
  alphabetQuiz,
  lessonId,
  type LetterItem,
} from '@/lib/learningData';
import { ArrowLeft, Volume2, PenLine, ListChecks, MessageSquare, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

type Section = 'menu' | 'alphabet' | 'tracing' | 'sentences' | 'quiz' | 'letter';

export default function EnglishScreen() {
  const { profile, user } = useAuth();
  const { theme, settings } = useSettings();
  const { speak } = useSpeech();
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode = profile?.learning_mode ?? (params.mode as 'dyslexia' | 'autism') ?? 'dyslexia';
  const calmMode = mode === 'autism' || settings.calmMode;

  const [section, setSection] = useState<Section>('menu');
  const [selectedLetter, setSelectedLetter] = useState<LetterItem | null>(null);

  const handleLetterPress = (item: LetterItem) => {
    setSelectedLetter(item);
    setSection('letter');
    if (settings.speechEnabled) {
      speak(`${item.letter}. ${item.letter} is for ${item.word}.`);
    }
  };

  const handleQuizComplete = async (score: number, stars: number) => {
    if (!user) return;
    const lid = lessonId(mode, 'english', 'quiz');
    await saveProgress(user.id, lid, 'english', score, stars, score * 5);
    const records = await fetchProgress(user.id);
    await checkAndUnlockAchievements(user.id, records);
  };

  // ---- Letter detail ----
  if (section === 'letter' && selectedLetter) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerBar}>
          <Pressable onPress={() => setSection('alphabet')} accessibilityRole="button" accessibilityLabel="Back">
            <ArrowLeft size={24} color={theme.colors.text} />
          </Pressable>
          <ThemedText variant="title" bold>{selectedLetter.letter}</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card elevation style={styles.letterCard}>
            <ThemedText style={{ fontSize: 120, textAlign: 'center' }}>{selectedLetter.emoji}</ThemedText>
            <ThemedText variant="display" bold style={{ textAlign: 'center', marginTop: 16 }}>
              {selectedLetter.letter}
            </ThemedText>
            <ThemedText variant="subtitle" muted style={{ textAlign: 'center' }}>
              {selectedLetter.letter} is for {selectedLetter.word}
            </ThemedText>
            {settings.speechEnabled && (
              <View style={{ marginTop: 16, alignItems: 'center' }}>
                <Button
                  title="Play Voice"
                  variant="secondary"
                  icon={<Volume2 size={20} color="#FFFFFF" />}
                  onPress={() => speak(`${selectedLetter.letter}. ${selectedLetter.letter} is for ${selectedLetter.word}.`)}
                />
              </View>
            )}
          </Card>
          <View style={{ marginTop: 16 }}>
            <ThemedText variant="subtitle" bold>Trace the letter</ThemedText>
            <View style={{ marginTop: 12 }}>
              <TracingCanvas character={selectedLetter.letter} calmMode={calmMode} />
            </View>
          </View>
          <View style={{ marginTop: 16 }}>
            <Button title="Next Letter" variant="outline" fullWidth onPress={() => {
              const idx = alphabet.findIndex((l) => l.letter === selectedLetter.letter);
              const next = alphabet[(idx + 1) % alphabet.length];
              handleLetterPress(next);
            }} />
          </View>
        </ScrollView>
      </View>
    );
  }

  // ---- Alphabet list ----
  if (section === 'alphabet') {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerBar}>
          <Pressable onPress={() => setSection('menu')} accessibilityRole="button" accessibilityLabel="Back">
            <ArrowLeft size={24} color={theme.colors.text} />
          </Pressable>
          <ThemedText variant="title" bold>Alphabet</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText variant="subtitle" bold style={{ marginBottom: 12 }}>A – M</ThemedText>
          <View style={styles.letterGrid}>
            {alphabetAM.map((item) => (
              <Pressable
                key={item.letter}
                onPress={() => handleLetterPress(item)}
                style={({ pressed }) => [
                  styles.letterTile,
                  { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderLight, opacity: pressed ? 0.8 : 1 },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Letter ${item.letter}, ${item.word}`}
              >
                <ThemedText style={{ fontSize: 28 }}>{item.emoji}</ThemedText>
                <ThemedText variant="title" bold>{item.letter}</ThemedText>
                <ThemedText variant="caption" muted>{item.word}</ThemedText>
              </Pressable>
            ))}
          </View>
          <ThemedText variant="subtitle" bold style={{ marginBottom: 12, marginTop: 20 }}>N – Z</ThemedText>
          <View style={styles.letterGrid}>
            {alphabetNZ.map((item) => (
              <Pressable
                key={item.letter}
                onPress={() => handleLetterPress(item)}
                style={({ pressed }) => [
                  styles.letterTile,
                  { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderLight, opacity: pressed ? 0.8 : 1 },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Letter ${item.letter}, ${item.word}`}
              >
                <ThemedText style={{ fontSize: 28 }}>{item.emoji}</ThemedText>
                <ThemedText variant="title" bold>{item.letter}</ThemedText>
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
            <ThemedText variant="subtitle" bold>Trace the letter A</ThemedText>
            <View style={{ marginTop: 12 }}>
              <TracingCanvas character="A" calmMode={calmMode} />
            </View>
          </Card>
        </ScrollView>
      </View>
    );
  }

  // ---- Sentences ----
  if (section === 'sentences') {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerBar}>
          <Pressable onPress={() => setSection('menu')} accessibilityRole="button" accessibilityLabel="Back">
            <ArrowLeft size={24} color={theme.colors.text} />
          </Pressable>
          <ThemedText variant="title" bold>Sentences</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {sentences.map((s, i) => (
            <Card key={i} style={styles.sentenceCard}>
              <View style={styles.sentenceRow}>
                <ThemedText style={{ fontSize: 40 }}>{s.emoji}</ThemedText>
                <ThemedText variant="subtitle" bold style={{ flex: 1 }}>{s.sentence}</ThemedText>
                {settings.speechEnabled && (
                  <Pressable
                    onPress={() => speak(s.sentence)}
                    accessibilityRole="button"
                    accessibilityLabel="Play sentence audio"
                  >
                    <Volume2 size={22} color={theme.colors.primary} />
                  </Pressable>
                )}
              </View>
            </Card>
          ))}
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
          <ThemedText variant="title" bold>Alphabet Quiz</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Quiz
            questions={alphabetQuiz}
            onComplete={handleQuizComplete}
            onExit={() => setSection('menu')}
            calmMode={calmMode}
            title="Alphabet Quiz"
          />
        </ScrollView>
      </View>
    );
  }

  // ---- Menu ----
  const menuItems = [
    { id: 'alphabet', title: 'Alphabet', subtitle: 'Letters A to Z', emoji: '🔤', section: 'alphabet' as Section, icon: <PenLine size={24} color={theme.colors.primary} /> },
    { id: 'tracing', title: 'Tracing', subtitle: 'Practice writing', emoji: '✏️', section: 'tracing' as Section, icon: <PenLine size={24} color={theme.colors.secondary} /> },
    { id: 'sentences', title: 'Sentences', subtitle: 'Read and listen', emoji: '💬', section: 'sentences' as Section, icon: <MessageSquare size={24} color={theme.colors.accent} /> },
    { id: 'quiz', title: 'Quiz', subtitle: 'Test your knowledge', emoji: '❓', section: 'quiz' as Section, icon: <ListChecks size={24} color={theme.colors.success} /> },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back">
          <ArrowLeft size={24} color={theme.colors.text} />
        </Pressable>
        <ThemedText variant="title" bold>English</ThemedText>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FadeIn>
          <ThemedText variant="subtitle" muted style={{ marginBottom: 16 }}>
            Letters, words & sentences
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
  letterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  letterTile: { borderWidth: 1.5, borderRadius: 16, padding: 12, alignItems: 'center', minWidth: 90, gap: 4 },
  letterCard: { alignItems: 'center', padding: 24 },
  sentenceCard: { marginBottom: 12 },
  sentenceRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
});
