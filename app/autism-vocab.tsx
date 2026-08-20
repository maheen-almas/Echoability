import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSettings } from '@/lib/settings';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { FadeIn } from '@/components/Transitions';
import { useSpeech } from '@/lib/useSpeech';
import { autismVocabulary, type VocabCategory } from '@/lib/learningData';
import { ArrowLeft, Volume2, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function AutismVocabScreen() {
  const { theme, settings } = useSettings();
  const { speak } = useSpeech();
  const [selected, setSelected] = useState<VocabCategory | null>(null);

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
          <View style={styles.vocabGrid}>
            {selected.items.map((item, i) => (
              <Card key={i} style={styles.vocabCard} elevation>
                <ThemedText style={{ fontSize: 56, textAlign: 'center' }}>{item.emoji}</ThemedText>
                <ThemedText variant="subtitle" bold style={{ textAlign: 'center', marginTop: 12 }}>{item.word}</ThemedText>
                {settings.speechEnabled && (
                  <Pressable
                    onPress={() => speak(item.word)}
                    style={({ pressed }) => [styles.playBtn, { backgroundColor: theme.colors.primary, opacity: pressed ? 0.85 : 1 }]}
                    accessibilityRole="button"
                    accessibilityLabel={`Play ${item.word}`}
                  >
                    <Volume2 size={20} color="#FFFFFF" />
                    <ThemedText bold color="#FFFFFF">Play</ThemedText>
                  </Pressable>
                )}
              </Card>
            ))}
          </View>
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
        <ThemedText variant="title" bold>Vocabulary</ThemedText>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FadeIn>
          <ThemedText variant="body" muted style={{ marginBottom: 16 }}>
            Tap a category to learn new words.
          </ThemedText>
        </FadeIn>
        {autismVocabulary.map((cat, i) => (
          <FadeIn key={cat.id} delay={i * 60}>
            <Card
              onPress={() => setSelected(cat)}
              elevation
              style={styles.catCard}
              accessibilityLabel={`${cat.title} - ${cat.items.length} words`}
            >
              <View style={[styles.catEmoji, { backgroundColor: theme.colors.autism + '18' }]}>
                <ThemedText style={{ fontSize: 28 }}>{cat.emoji}</ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="subtitle" bold>{cat.title}</ThemedText>
                <ThemedText variant="caption" muted>{cat.items.length} words</ThemedText>
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
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scrollContent: { padding: 16, paddingBottom: 40, maxWidth: isTablet ? 700 : '100%', alignSelf: 'center', width: '100%' },
  catCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12, padding: 16 },
  catEmoji: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  vocabGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  vocabCard: { alignItems: 'center', padding: 20, minWidth: 160, flex: 1, maxWidth: 220 },
  playBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginTop: 12 },
});
