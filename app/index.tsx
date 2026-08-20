import { Link, Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FadeIn } from '@/components/Transitions';
import { Sparkles, BookOpen, Calculator, Trophy, GraduationCap } from 'lucide-react-native';

export default function Index() {
  const { session, loading, needsProfile } = useAuth();
  const { theme } = useSettings();

  useEffect(() => {
    if (!loading) {
      if (session && !needsProfile) {
        router.replace('/(tabs)');
      } else if (session && needsProfile) {
        router.replace('/login');
      }
    }
  }, [session, loading, needsProfile]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FadeIn style={styles.content}>
        <View style={styles.hero}>
          <View style={[styles.logoBadge, { backgroundColor: theme.colors.primary }]}>
            <GraduationCap size={40} color="#FFFFFF" />
          </View>
          <ThemedText variant="display" bold style={{ marginTop: 16 }}>
            EchoAbility
          </ThemedText>
          <ThemedText variant="subtitle" muted style={{ marginTop: 8, textAlign: 'center' }}>
            Inclusive learning for every child
          </ThemedText>
        </View>

        <View style={styles.featureRow}>
          <Card style={styles.featureCard}>
            <BookOpen size={28} color={theme.colors.primary} />
            <ThemedText variant="label" muted style={{ marginTop: 4 }}>English</ThemedText>
          </Card>
          <Card style={styles.featureCard}>
            <Calculator size={28} color={theme.colors.secondary} />
            <ThemedText variant="label" muted style={{ marginTop: 4 }}>Maths</ThemedText>
          </Card>
          <Card style={styles.featureCard}>
            <Trophy size={28} color={theme.colors.accent} />
            <ThemedText variant="label" muted style={{ marginTop: 4 }}>Rewards</ThemedText>
          </Card>
          <Card style={styles.featureCard}>
            <Sparkles size={28} color={theme.colors.success} />
            <ThemedText variant="label" muted style={{ marginTop: 4 }}>Fun</ThemedText>
          </Card>
        </View>

        <View style={styles.actions}>
          <Button title="Get Started" onPress={() => router.push('/login')} fullWidth size="lg" />
          <View style={{ height: 12 }} />
          <Button title="Create Account" onPress={() => router.push('/signup')} variant="outline" fullWidth size="lg" />
        </View>
      </FadeIn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { width: '100%', maxWidth: 480, alignItems: 'center' },
  hero: { alignItems: 'center', marginBottom: 32 },
  logoBadge: { width: 80, height: 80, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  featureRow: { flexDirection: 'row', gap: 12, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' },
  featureCard: { alignItems: 'center', padding: 16, minWidth: 80 },
  actions: { width: '100%', maxWidth: 360 },
});
