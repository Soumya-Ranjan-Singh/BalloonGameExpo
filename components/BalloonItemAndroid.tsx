import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

interface BalloonProps {
  color: string;
  animalName: string;
  delay: number;
  startX: number;
  isAnswered: boolean;
  selectedAnimal: string | null;
  correctAnimal: string | null;
  onPress: (animalName: string) => void;
  freeze: boolean;
}

export const BalloonItemAndroid: React.FC<BalloonProps> = ({
  color,
  animalName,
  delay,
  startX,
  isAnswered,
  selectedAnimal,
  correctAnimal,
  onPress,
  freeze,
}) => {
  const translateY = useRef(new Animated.Value(height + 100)).current;
  const translateX = useRef(new Animated.Value(startX)).current;
  const animRef = useRef<Animated.CompositeAnimation[]>([]);

  // Track current position for touchable overlay
  const [posY, setPosY] = useState(height + 100);
  const [posX, setPosX] = useState(startX);

  useEffect(() => {
    if (freeze) {
      animRef.current.forEach((a) => a.stop());
      return;
    }

    const yAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 5000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: height + 100,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    const xAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: startX + 40,
          duration: 2500,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: startX - 40,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );

    // Add listener to track position for touchable
    const yListener = translateY.addListener(({ value }) => setPosY(value));
    const xListener = translateX.addListener(({ value }) => setPosX(value));

    yAnim.start();
    xAnim.start();
    animRef.current = [yAnim, xAnim];

    return () => {
      animRef.current.forEach((a) => a.stop());
      translateY.removeListener(yListener);
      translateX.removeListener(xListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, freeze, startX]);

  // Color logic
  let balloonColor = color;
  if (isAnswered) {
    if (animalName === correctAnimal) balloonColor = "#22c55e";
    else if (animalName === selectedAnimal && selectedAnimal !== correctAnimal)
      balloonColor = "#ef4444";
    else balloonColor = "#94a3b8";
  }

  return (
    <>
      {/* Animated balloon */}
      <Animated.View
        style={[
          styles.balloonContainer,
          {
            transform: [{ translateY }, { translateX }],
          },
        ]}
      >
        <View style={[styles.balloon, { backgroundColor: balloonColor }]}>
          <Text style={styles.balloonText}>{animalName}</Text>
        </View>
        <View style={[styles.knot, { borderBottomColor: balloonColor }]} />
        <View style={styles.thread} />
      </Animated.View>

      {/* Transparent Touchable overlay to capture touches */}
      {!isAnswered && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPress(animalName)}
          style={{
            position: "absolute",
            top: posY,
            left: posX, // half of balloon width
            width: 120,
            height: 120,
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  balloonContainer: { position: "absolute", alignItems: "center" },
  balloon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    paddingHorizontal: 10,
  },
  balloonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  knot: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 20,
    marginTop: -12,
  },
  thread: { width: 2, height: 60, backgroundColor: "#999" },
});
