import { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSettings } from '@/lib/settings';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { FadeIn } from '@/components/Transitions';
import { videos, videoCategories, type VideoItem } from '@/lib/learningData';
import { Play, X, AlertCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function VideosScreen() {
  const { theme } = useSettings();
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<VideoItem | null>(null);

  const filtered = category === 'All' ? videos : videos.filter((v) => v.category === category);

  if (selected) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerBar}>
          <Pressable onPress={() => setSelected(null)} accessibilityRole="button" accessibilityLabel="Back">
            <X size={24} color={theme.colors.text} />
          </Pressable>
          <ThemedText variant="title" bold numberOfLines={1}>{selected.title}</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card elevation style={styles.videoPlayer}>
            <View style={styles.placeholder}>
              <ThemedText style={{ fontSize: 64 }}>{selected.emoji}</ThemedText>
              <View style={[styles.playButton, { backgroundColor: theme.colors.primary }]}>
                <Play size={32} color="#FFFFFF" fill="#FFFFFF" />
              </View>
            </View>
          </Card>
          <Card style={{ marginTop: 16 }}>
            <ThemedText variant="subtitle" bold>{selected.title}</ThemedText>
            <View style={[styles.categoryTag, { backgroundColor: theme.colors.primary + '18' }]}>
              <ThemedText variant="label" bold color={theme.colors.primary}>{selected.category}</ThemedText>
            </View>
            <ThemedText variant="body" muted style={{ marginTop: 8 }}>{selected.description}</ThemedText>
            <View style={[styles.noteBox, { backgroundColor: theme.colors.warning + '15' }]}>
              <AlertCircle size={18} color={theme.colors.warning} />
              <ThemedText variant="caption" muted style={{ flex: 1 }}>
                Video coming soon — this placeholder can be replaced with a real video URL.
              </ThemedText>
            </View>
          </Card>
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
        <ThemedText variant="title" bold>Videos</ThemedText>
        <ThemedText variant="body" muted style={{ marginTop: 4 }}>Watch and learn</ThemedText>
      </FadeIn>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginTop: 16 }}>
        {videoCategories.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            style={({ pressed }) => [
              styles.categoryChip,
              {
                backgroundColor: category === cat ? theme.colors.primary : theme.colors.surfaceAlt,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${cat}`}
          >
            <ThemedText
              bold
              color={category === cat ? '#FFFFFF' : theme.colors.text}
              style={{ fontSize: 14 }}
            >
              {cat}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.videoList}>
        {filtered.map((video, i) => (
          <FadeIn key={video.id} delay={i * 50}>
            <Card
              onPress={() => setSelected(video)}
              elevation
              style={styles.videoCard}
              accessibilityLabel={`${video.title} - ${video.description}`}
            >
              <View style={[styles.thumbnail, { backgroundColor: theme.colors.surfaceAlt }]}>
                <ThemedText style={{ fontSize: 40 }}>{video.emoji}</ThemedText>
                <View style={[styles.playBadge, { backgroundColor: theme.colors.primary }]}>
                  <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
                </View>
              </View>
              <View style={styles.videoInfo}>
                <ThemedText variant="subtitle" bold numberOfLines={1}>{video.title}</ThemedText>
                <ThemedText variant="caption" muted>{video.category}</ThemedText>
                <ThemedText variant="caption" muted numberOfLines={2} style={{ marginTop: 4 }}>{video.description}</ThemedText>
              </View>
            </Card>
          </FadeIn>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, maxWidth: isTablet ? 800 : '100%', alignSelf: 'center', width: '100%' },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  scrollContent: { padding: 16, paddingBottom: 40, maxWidth: isTablet ? 800 : '100%', alignSelf: 'center', width: '100%' },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  videoList: { marginTop: 16, gap: 12 },
  videoCard: { flexDirection: 'row', padding: 12, gap: 12 },
  thumbnail: { width: 120, height: 80, borderRadius: 12, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  playBadge: { position: 'absolute', bottom: 6, right: 6, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  videoInfo: { flex: 1, justifyContent: 'center' },
  videoPlayer: { padding: 0, overflow: 'hidden' },
  placeholder: { height: 240, justifyContent: 'center', alignItems: 'center' },
  playButton: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  categoryTag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 8 },
  noteBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10, marginTop: 12 },
});
