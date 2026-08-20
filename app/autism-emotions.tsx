import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSettings } from '@/lib/settings';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { FadeIn } from '@/components/Transitions';
import { useSpeech } from '@/lib/useSpeech';
import { autismEmotions } from '@/lib/learningData';
import { ArrowLeft, Volume2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function AutismEmotionsScreen() {
  const { theme, settings } = useSettings();
  const { speak } = useSpeech();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (name: string) => {
    setSelected(name);
    if (settings.speechEnabled) {
      speak(`You feel ${name}. That's okay.`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back">
          <ArrowLeft size={24} color={theme.colors.text} />
        </Pressable>
        <ThemedText variant="title" bold>Emotions</ThemedText>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FadeIn>
          <Card elevation style={styles.promptCard}>
            <ThemedText variant="subtitle" bold style={{ textAlign: 'center' }}>How do you feel?</ThemedText>
            <ThemedText variant="caption" muted style={{ textAlign: 'center', marginTop: 4 }}>
              Pick the face that matches how you feel. There is no wrong answer.
            </ThemedText>
            {settings.speechEnabled && (
              <View style={{ marginTop: 12, alignItems: 'center' }}>
                <Pressable
                  onPress={() => speak('How do you feel?')}
                  style={({ pressed }) => [styles.playBtn, { backgroundColor: theme.colors.primary, opacity: pressed ? 0.85 : 1 }]}
                  accessibilityRole="button"
                  accessibilityLabel="Play question"
                >
                  <Volume2 size={20} color="#FFFFFF" />
                  <ThemedText bold color="#FFFFFF">Play</ThemedText>
                </Pressable>
              </View>
            )}
          </Card>
        </FadeIn>

        <View style={styles.emotionGrid}>
          {autismEmotions.map((emo, i) => {
            const isSelected = selected === emo.name;
            return (
              <FadeIn key={emo.name} delay={i * 60}>
                <Pressable
                  onPress={() => handleSelect(emo.name)}
                  style={({ pressed }) => [
                    styles.emotionCard,
                    {
                      backgroundColor: isSelected ? theme.colors.autism + '18' : theme.colors.surface,
                      borderColor: isSelected ? theme.colors.autism : theme.colors.borderLight,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Feeling ${emo.name}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <ThemedText style={{ fontSize: 48, textAlign: 'center' }}>{emo.emoji}</ThemedText>
                  <ThemedText variant="body" bold style={{ textAlign: 'center', marginTop: 8 }}>{emo.name}</ThemedText>
                </Pressable>
              </FadeIn>
            );
          })}
        </View>

        {selected && (
          <FadeIn>
            <Card elevation style={styles.feedbackCard}>
              <ThemedText variant="subtitle" bold color={theme.colors.autism} style={{ textAlign: 'center' }}>
                Good choice.
              </ThemedText>
              <ThemedText variant="body" muted style={{ textAlign: 'center', marginTop: 4 }}>
                It is okay to feel {selected.toLowerCase()}.
              </ThemedText>
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
  promptCard: { alignItems: 'center', padding: 24, marginBottom: 20 },
  playBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  emotionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  emotionCard: { borderWidth: 2, borderRadius: 16, padding: 16, alignItems: 'center', minWidth: 140, flex: 1, maxWidth: 180 },
  feedbackCard: { alignItems: 'center', padding: 20, marginTop: 20 },
});
