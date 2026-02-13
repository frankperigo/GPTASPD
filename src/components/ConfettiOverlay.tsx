import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const CONFETTI_COUNT = 30;
const COLORS = ['#8B6F47', '#A8B89F', '#87CEEB', '#F39C12', '#E74C3C', '#9B59B6', '#27AE60'];

interface ConfettiPiece {
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  opacity: Animated.Value;
  initialX: number;
  color: string;
  size: number;
}

interface ConfettiOverlayProps {
  visible: boolean;
  onComplete?: () => void;
}

export function ConfettiOverlay({ visible, onComplete }: ConfettiOverlayProps) {
  const pieces = useRef<ConfettiPiece[]>(
    Array.from({ length: CONFETTI_COUNT }, () => {
      const initialX = Math.random() * width;
      return {
        x: new Animated.Value(initialX),
        y: new Animated.Value(-20),
        rotate: new Animated.Value(0),
        opacity: new Animated.Value(1),
        initialX,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 6,
      };
    })
  ).current;

  useEffect(() => {
    if (!visible) return;

    const animations = pieces.map((piece) => {
      const startX = Math.random() * width;
      piece.initialX = startX;
      piece.y.setValue(-20 - Math.random() * 100);
      piece.x.setValue(startX);
      piece.opacity.setValue(1);
      piece.rotate.setValue(0);

      return Animated.parallel([
        Animated.timing(piece.y, {
          toValue: height + 20,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(piece.x, {
          toValue: startX + (Math.random() - 0.5) * 200,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(piece.rotate, {
          toValue: Math.random() * 10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(piece.opacity, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(30, animations).start(() => {
      onComplete?.();
    });
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map((piece, i) => (
        <Animated.View
          key={i}
          style={[
            styles.piece,
            {
              width: piece.size,
              height: piece.size * 0.6,
              backgroundColor: piece.color,
              borderRadius: 2,
              transform: [
                { translateX: piece.x },
                { translateY: piece.y },
                {
                  rotate: piece.rotate.interpolate({
                    inputRange: [0, 10],
                    outputRange: ['0deg', '3600deg'],
                  }),
                },
              ],
              opacity: piece.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  piece: {
    position: 'absolute',
  },
});
