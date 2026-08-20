import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View, PanResponder, type DimensionValue } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ThemedText } from './ThemedText';
import { Button } from './Button';
import { RotateCcw, Check } from 'lucide-react-native';
import { useSettings } from '@/lib/settings';

type TracingCanvasProps = {
  character: string;
  onComplete?: () => void;
  calmMode?: boolean;
  height?: DimensionValue;
};

type Point = { x: number; y: number };

export function TracingCanvas({ character, onComplete, calmMode = false, height = 280 }: TracingCanvasProps) {
  const { theme } = useSettings();
  const [paths, setPaths] = useState<Point[][]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [completed, setCompleted] = useState(false);
  const layoutRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath([{ x: locationX, y: locationY }]);
      },
      onPanResponderMove: (evt, gestureState) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath((prev) => [...prev, { x: locationX, y: locationY }]);
      },
      onPanResponderRelease: () => {
        if (currentPath.length > 2) {
          setPaths((prev) => [...prev, currentPath]);
        }
        setCurrentPath([]);
        if (!completed) {
          setCompleted(true);
          onComplete?.();
        }
      },
    })
  ).current;

  const handleReset = () => {
    setPaths([]);
    setCurrentPath([]);
    setCompleted(false);
  };

  const allPaths = [...paths, currentPath.length > 1 ? currentPath : []];

  return (
    <View style={styles.container}>
      <View
        style={[styles.canvas, { height, backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}
        onLayout={(e) => {
          layoutRef.current = {
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          };
        }}
        {...panResponder.panHandlers}
      >
        <View style={styles.guideChar}>
          <ThemedText style={{ fontSize: 180, color: theme.colors.border, fontWeight: '900' }}>
            {character}
          </ThemedText>
        </View>
        <Svg
          width="100%"
          height="100%"
          style={StyleSheet.absoluteFill}
        >
          {allPaths.map((path, pIndex) => {
            if (path.length < 2) return null;
            const d = path.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
            return (
              <Path
                key={pIndex}
                d={d}
                stroke={theme.colors.primary}
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            );
          })}
        </Svg>
      </View>

      <View style={styles.controls}>
        <Button
          title="Reset"
          onPress={handleReset}
          variant="outline"
          icon={<RotateCcw size={20} color={theme.colors.primary} />}
        />
        {completed && (
          <View style={styles.doneRow}>
            <Check size={24} color={theme.colors.success} />
            <ThemedText bold color={theme.colors.success}>
              {calmMode ? 'Nice tracing!' : 'Great tracing!'}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  canvas: {
    borderWidth: 2,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideChar: { position: 'absolute', alignSelf: 'center' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 16, justifyContent: 'center' },
  doneRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
