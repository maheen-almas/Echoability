import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View, ScrollView, Pressable, ActivityIndicator, Dimensions } from 'react-native';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FadeIn } from '@/components/Transitions';
import { fetchProgress, summarizeProgress, type ProgressRecord } from '@/lib/progress';
import { useEffect } from 'react';
import type { LearningMode } from '@/lib/theme';
import {
  LogOut, Settings, Trophy, BookOpen, Calculator, Type, Contrast,
  Volume2, Wind, Zap, ChevronRight, Sparkles, Accessibility, Star, Coins,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function ProfileScreen() {
  const { user, profile, signOut, setLearningMode } = useAuth();
  const { theme, settings, toggle } = useSettings();
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingMode, setSavingMode] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchProgress(user.id).then((data) => { setProgress(data); setLoading(false); });
  }, [user]);

  const summary = summarizeProgress(progress);

  const handleModeChange = async (mode: LearningMode) => {
    if (mode === profile?.learning_mode) return;
    setSavingMode(true);
    await setLearningMode(mode);
    setSavingMode(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/');
  };

  const settingItems: { key: keyof typeof settings; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: 'largeText', label: 'Large Text', icon: <Type size={20} color={theme.colors.primary} />, desc: 'Bigger text for easier reading' },
    { key: 'highContrast', label: 'High Contrast', icon: <Contrast size={20} color={theme.colors.primary} />, desc: 'Stronger color contrast' },
    { key: 'calmMode', label: 'Calm Mode', icon: <Wind size={20} color={theme.colors.secondary} />, desc: 'Reduce animations and motion' },
    { key: 'speechEnabled', label: 'Speech / Audio', icon: <Volume2 size={20} color={theme.colors.accent} />, desc: 'Enable voice playback' },
    { key: 'reducedAnimation', label: 'Reduced Animation', icon: <Zap size={20} color={theme.colors.warning} />, desc: 'Minimize transitions' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <FadeIn>
        <Card elevation style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <ThemedText variant="display" bold color="#FFFFFF">
              {profile?.name?.charAt(0).toUpperCase() ?? 'L'}
            </ThemedText>
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText variant="title" bold>{profile?.name ?? 'Learner'}</ThemedText>
            <ThemedText variant="caption" muted numberOfLines={1}>{user?.email}</ThemedText>
            <View style={[styles.modeBadge, { backgroundColor: profile?.learning_mode === 'autism' ? theme.colors.autism + '22' : theme.colors.dyslexia + '22' }]}>
              <Sparkles size={14} color={profile?.learning_mode === 'autism' ? theme.colors.autism : theme.colors.dyslexia} />
              <ThemedText variant="label" bold color={profile?.learning_mode === 'autism' ? theme.colors.autism : theme.colors.dyslexia}>
                {profile?.learning_mode === 'autism' ? 'Autism' : 'Dyslexia'}
              </ThemedText>
            </View>
          </View>
        </Card>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={100}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Star size={20} color={theme.colors.warning} fill={theme.colors.warning} />
            <ThemedText variant="title" bold>{summary.totalStars}</ThemedText>
            <ThemedText variant="label" muted>Stars</ThemedText>
          </Card>
          <Card style={styles.statCard}>
            <Coins size={20} color={theme.colors.accent} />
            <ThemedText variant="title" bold>{summary.totalCoins}</ThemedText>
            <ThemedText variant="label" muted>Coins</ThemedText>
          </Card>
          <Card style={styles.statCard}>
            <BookOpen size={20} color={theme.colors.primary} />
            <ThemedText variant="title" bold>{summary.completedLessons}</ThemedText>
            <ThemedText variant="label" muted>Lessons</ThemedText>
          </Card>
        </View>
      </FadeIn>

      {/* Learning Mode */}
      <FadeIn delay={150}>
        <ThemedText variant="subtitle" bold style={{ marginTop: 24, marginBottom: 12 }}>Learning Mode</ThemedText>
        <View style={styles.modeRow}>
          <Pressable
            onPress={() => handleModeChange('dyslexia')}
            style={({ pressed }) => [
              styles.modeCard,
              {
                backgroundColor: profile?.learning_mode === 'dyslexia' ? theme.colors.dyslexia + '15' : theme.colors.surface,
                borderColor: profile?.learning_mode === 'dyslexia' ? theme.colors.dyslexia : theme.colors.border,
                opacity: savingMode ? 0.6 : pressed ? 0.85 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Select Dyslexia mode"
            accessibilityState={{ selected: profile?.learning_mode === 'dyslexia' }}
          >
            <ThemedText style={{ fontSize: 32 }}>📖</ThemedText>
            <ThemedText variant="subtitle" bold>Dyslexia</ThemedText>
            <ThemedText variant="caption" muted style={{ textAlign: 'center' }}>Reading & writing support</ThemedText>
          </Pressable>
          <Pressable
            onPress={() => handleModeChange('autism')}
            style={({ pressed }) => [
              styles.modeCard,
              {
                backgroundColor: profile?.learning_mode === 'autism' ? theme.colors.autism + '15' : theme.colors.surface,
                borderColor: profile?.learning_mode === 'autism' ? theme.colors.autism : theme.colors.border,
                opacity: savingMode ? 0.6 : pressed ? 0.85 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Select Autism mode"
            accessibilityState={{ selected: profile?.learning_mode === 'autism' }}
          >
            <ThemedText style={{ fontSize: 32 }}>🧩</ThemedText>
            <ThemedText variant="subtitle" bold>Autism</ThemedText>
            <ThemedText variant="caption" muted style={{ textAlign: 'center' }}>Structured & calm learning</ThemedText>
          </Pressable>
        </View>
        {savingMode && <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginTop: 8 }} />}
      </FadeIn>

      {/* Accessibility Settings */}
      <FadeIn delay={200}>
        <ThemedText variant="subtitle" bold style={{ marginTop: 24, marginBottom: 12 }}>
          <Accessibility size={18} color={theme.colors.text} /> Accessibility & Settings
        </ThemedText>
        <Card style={styles.settingsCard}>
          {settingItems.map((item, i) => (
            <Pressable
              key={item.key}
              onPress={() => toggle(item.key)}
              accessibilityRole="switch"
              accessibilityLabel={item.label}
              accessibilityState={{ checked: settings[item.key] }}
              style={({ pressed }) => [styles.settingRow, i < settingItems.length - 1 && styles.settingBorder, { opacity: pressed ? 0.8 : 1 }]}
            >
              {item.icon}
              <View style={{ flex: 1 }}>
                <ThemedText variant="body" bold>{item.label}</ThemedText>
                <ThemedText variant="caption" muted>{item.desc}</ThemedText>
              </View>
              <View style={[styles.toggle, { backgroundColor: settings[item.key] ? theme.colors.success : theme.colors.border }]}>
                <View style={[styles.toggleKnob, { backgroundColor: '#FFFFFF', transform: [{ translateX: settings[item.key] ? 22 : 2 }] }]} />
              </View>
            </Pressable>
          ))}
        </Card>
      </FadeIn>

      {/* Quick links */}
      <FadeIn delay={250}>
        <View style={{ marginTop: 24, gap: 12 }}>
          <Card onPress={() => router.push('/achievements')} style={styles.linkCard}>
            <Trophy size={22} color={theme.colors.accent} />
            <ThemedText variant="body" bold style={{ flex: 1 }}>Achievements</ThemedText>
            <ChevronRight size={22} color={theme.colors.textMuted} />
          </Card>
          <Card onPress={() => router.push('/english')} style={styles.linkCard}>
            <BookOpen size={22} color={theme.colors.primary} />
            <ThemedText variant="body" bold style={{ flex: 1 }}>English Lessons</ThemedText>
            <ChevronRight size={22} color={theme.colors.textMuted} />
          </Card>
          <Card onPress={() => router.push('/maths')} style={styles.linkCard}>
            <Calculator size={22} color={theme.colors.secondary} />
            <ThemedText variant="body" bold style={{ flex: 1 }}>Maths Lessons</ThemedText>
            <ChevronRight size={22} color={theme.colors.textMuted} />
          </Card>
        </View>
      </FadeIn>

      {/* Logout */}
      <FadeIn delay={300}>
        <View style={{ marginTop: 24, marginBottom: 8 }}>
          <Button
            title="Log Out"
            onPress={handleLogout}
            variant="outline"
            fullWidth
            size="lg"
            icon={<LogOut size={20} color={theme.colors.error} />}
            accessibilityLabel="Log out of your account"
          />
        </View>
      </FadeIn>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, maxWidth: isTablet ? 700 : '100%', alignSelf: 'center', width: '100%' },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20 },
  avatar: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  modeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 6 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  statCard: { alignItems: 'center', flex: 1, padding: 12, gap: 4 },
  modeRow: { flexDirection: 'row', gap: 12 },
  modeCard: { flex: 1, borderWidth: 2, borderRadius: 16, padding: 16, alignItems: 'center', gap: 6 },
  settingsCard: { padding: 0, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  settingBorder: { borderBottomWidth: 1, borderBottomColor: '#EFF3F8' },
  toggle: { width: 48, height: 28, borderRadius: 14, justifyContent: 'center', paddingVertical: 2 },
  toggleKnob: { width: 24, height: 24, borderRadius: 12 },
  linkCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
});
