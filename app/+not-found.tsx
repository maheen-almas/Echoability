import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <ThemedText variant="display" bold>Oops!</ThemedText>
        <ThemedText variant="subtitle" muted style={{ marginTop: 8 }}>This screen doesn't exist.</ThemedText>
        <View style={{ marginTop: 24 }}>
          <Link href="/" asChild>
            <Button title="Go Home" onPress={() => {}} />
          </Link>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
});
