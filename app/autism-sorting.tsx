import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSettings } from '@/lib/settings';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { FadeIn } from '@/components/Transitions';
import { useSpeech } from '@/lib/useSpeech';
import { autismSortingSets } from '@/lib/learningData';
import { ArrowLeft, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function AutismSortingScreen() {
  const { theme, settings } = useSettings();
  const { speak } = useSpeech();
  const set = autismSortingSets[0];
  const [assigned, setAssigned] = useState<Record<string, string>>({});

  const handleAssign = (itemEmoji: string, group: string) => {
    setAssigned((prev) => ({ ...prev, [itemEmoji]: group }));
    const item = set.items.find((i) => i.emoji === itemEmoji);
    if (settings.speechEnabled && item) speak(`${item.name} goes to ${group}`);
  };

  const allAssigned = Object.keys(assigned).length === set.items.length;
  const correctCount = set.items.filter((i) => assigned[i.emoji] === i.group).length;
  const allCorrect = allAssigned && correctCount === set.items.length;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back">
          <ArrowLeft size={24} color={theme.colors.text} />
        </Pressable>
        <ThemedText variant="title" bold>Sorting</ThemedText>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FadeIn>
          <Card elevation style={styles.promptCard}>
            <ThemedText variant="subtitle" bold style={{ textAlign: 'center' }}>{set.title}</ThemedText>
            <ThemedText variant="body" muted style={{ textAlign: 'center', marginTop: 8 }}>{set.prompt}</ThemedText>
          </Card>
        </FadeIn>

        <ThemedText variant="subtitle" bold style={{ marginTop: 20, marginBottom: 8 }}>Items</ThemedText>
        <View style={styles.itemRow}>
          {set.items.map((item, i) => {
            const isAssigned = assigned[item.emoji];
            const isCorrect = isAssigned === item.group;
            return (
              <View key={i} style={[styles.itemCard, { backgroundColor: isAssigned ? (isCorrect ? theme.colors.success + '15' : theme.colors.surfaceAlt) : theme.colors.surface, borderColor: isAssigned ? (isCorrect ? theme.colors.success : theme.colors.border) : theme.colors.borderLight }]}>
                <ThemedText style={{ fontSize: 36, textAlign: 'center' }}>{item.emoji}</ThemedText>
                <ThemedText variant="caption" muted style={{ textAlign: 'center' }}>{item.name}</ThemedText>
                {isAssigned && (
                  <View style={styles.assignedTag}>
                    <ThemedText variant="label" bold color={isCorrect ? theme.colors.success : theme.colors.textMuted}>
                      {isAssigned}
                    </ThemedText>
                    {isCorrect && <Check size={14} color={theme.colors.success} />}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <ThemedText variant="subtitle" bold style={{ marginTop: 20, marginBottom: 8 }}>Sort into groups</ThemedText>
        {set.groups.map((group) => (
          <Card key={group} style={styles.groupCard}>
            <ThemedText variant="body" bold>{group}</ThemedText>
            <View style={styles.groupItemsRow}>
              {set.items.filter((i) => assigned[i.emoji] === group).map((item, i) => (
                <View key={i} style={styles.groupedItem}>
                  <ThemedText style={{ fontSize: 28 }}>{item.emoji}</ThemedText>
                </View>
              ))}
              {!set.items.some((i) => assigned[i.emoji] === group) && (
                <ThemedText variant="caption" muted>Drop items here...</ThemedText>
              )}
            </View>
            <View style={styles.assignRow}>
              {set.items.filter((i) => !assigned[i.emoji]).map((item, i) => (
                <Pressable
                  key={i}
                  onPress={() => handleAssign(item.emoji, group)}
                  style={({ pressed }) => [styles.assignBtn, { backgroundColor: theme.colors.autism, opacity: pressed ? 0.85 : 1 }]}
                  accessibilityRole="button"
                  accessibilityLabel={`Put ${item.name} in ${group}`}
                >
                  <ThemedText style={{ fontSize: 20 }}>{item.emoji}</ThemedText>
                </Pressable>
              ))}
            </View>
          </Card>
        ))}

        {allAssigned && (
          <FadeIn>
            <Card elevation style={styles.doneCard}>
              <ThemedText style={{ fontSize: 48, textAlign: 'center' }}>{allCorrect ? '🎉' : '👍'}</ThemedText>
              <ThemedText variant="subtitle" bold color={allCorrect ? theme.colors.success : theme.colors.textMuted} style={{ textAlign: 'center' }}>
                {allCorrect ? 'Great job! All correct!' : 'Good try! Let\'s check again.'}
              </ThemedText>
              <View style={{ marginTop: 16 }}>
                <Button title="Try Again" variant="outline" onPress={() => setAssigned({})} fullWidth />
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
  itemRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  itemCard: { borderWidth: 2, borderRadius: 14, padding: 12, alignItems: 'center', minWidth: 100, position: 'relative' },
  assignedTag: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  groupCard: { marginBottom: 12, gap: 8 },
  groupItemsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  groupedItem: { backgroundColor: '#F0F4FA', borderRadius: 10, padding: 6 },
  assignRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  assignBtn: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  doneCard: { alignItems: 'center', padding: 24, marginTop: 20 },
});
