import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View, TextInput, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FadeIn } from '@/components/Transitions';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react-native';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { theme } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'web' ? undefined : 'padding'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
        keyboardShouldPersistTaps="handled"
      >
        <FadeIn style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.iconBadge, { backgroundColor: theme.colors.primary }]}>
              <LogIn size={32} color="#FFFFFF" />
            </View>
            <ThemedText variant="title" bold style={{ marginTop: 16 }}>Welcome Back</ThemedText>
            <ThemedText variant="body" muted style={{ marginTop: 4 }}>Sign in to continue learning</ThemedText>
          </View>

          <Card elevation style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText variant="label" muted>Email</ThemedText>
              <View style={[styles.inputRow, { borderColor: theme.colors.border }]}>
                <Mail size={20} color={theme.colors.textMuted} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Email address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText variant="label" muted>Password</ThemedText>
              <View style={[styles.inputRow, { borderColor: theme.colors.border }]}>
                <Lock size={20} color={theme.colors.textMuted} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Your password"
                  secureTextEntry
                  accessibilityLabel="Password"
                />
              </View>
            </View>

            {error && (
              <View style={[styles.errorBox, { backgroundColor: theme.colors.error + '15' }]}>
                <AlertCircle size={18} color={theme.colors.error} />
                <ThemedText variant="caption" color={theme.colors.error} style={{ flex: 1 }}>{error}</ThemedText>
              </View>
            )}

            <Button title={loading ? 'Signing in...' : 'Sign In'} onPress={handleLogin} fullWidth size="lg" loading={loading} />
          </Card>

          <View style={styles.footer}>
            <ThemedText variant="body" muted>Don't have an account? </ThemedText>
            <Button title="Sign Up" variant="ghost" size="sm" onPress={() => router.push('/signup')} />
          </View>
        </FadeIn>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  content: { width: '100%', maxWidth: 440, alignSelf: 'center' },
  header: { alignItems: 'center', marginBottom: 24 },
  iconBadge: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 4 },
  input: { flex: 1, paddingVertical: 12, fontSize: 16 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
});
