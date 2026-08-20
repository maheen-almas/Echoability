import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FadeIn } from '@/components/Transitions';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react-native';

export default function SignupScreen() {
  const { signUp } = useAuth();
  const { theme } = useSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error: err } = await signUp(email, password, name);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      router.replace('/login');
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
            <View style={[styles.iconBadge, { backgroundColor: theme.colors.secondary }]}>
              <UserPlus size={32} color="#FFFFFF" />
            </View>
            <ThemedText variant="title" bold style={{ marginTop: 16 }}>Create Account</ThemedText>
            <ThemedText variant="body" muted style={{ marginTop: 4 }}>Join EchoAbility and start learning</ThemedText>
          </View>

          <Card elevation style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText variant="label" muted>Name</ThemedText>
              <View style={[styles.inputRow, { borderColor: theme.colors.border }]}>
                <User size={20} color={theme.colors.textMuted} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  accessibilityLabel="Name"
                />
              </View>
            </View>

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
                  placeholder="At least 6 characters"
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

            <Button title={loading ? 'Creating account...' : 'Create Account'} onPress={handleSignup} fullWidth size="lg" loading={loading} />
          </Card>

          <View style={styles.footer}>
            <ThemedText variant="body" muted>Already have an account? </ThemedText>
            <Button title="Sign In" variant="ghost" size="sm" onPress={() => router.push('/login')} />
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
