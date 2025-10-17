// App.tsx
import { BalloonItemAndroid } from "@/components/BalloonItemAndroid";
import { BalloonItemIOS } from "@/components/BalloonItemIOS";
import React, { JSX, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface Animal {
  name: string;
  hint: string;
}

const animals: Animal[] = [
  { name: "Cat", hint: "Meows and loves yarn 🧶" },
  { name: "Dog", hint: "Barks and loves bones 🦴" },
  { name: "Pig", hint: "Oinks and loves mud 🪨" },
  { name: "Bird", hint: "Chirps and builds nests 🪶" },
  { name: "Fish", hint: "Swims in water 🌊" },
];

const colors = ["#6366f1", "#ec4899", "#9515dbff", "#3b82f6", "#f59e0b"];

export default function App(): JSX.Element {
  const [score, setScore] = useState<number>(0);
  const [currentHintIndex, setCurrentHintIndex] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [correctAnimal, setCorrectAnimal] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const currentAnimal = animals[currentHintIndex];

  const handleBalloonPress = (selected: string) => {
    if (isAnswered) return;

    const correct = selected === currentAnimal.name;
    setSelectedAnimal(selected);
    setCorrectAnimal(currentAnimal.name);
    setIsAnswered(true);
    setScore((prev) => (correct ? prev + 1 : Math.max(0, prev - 1)));

    Alert.alert(
      correct ? "🎉 Correct!" : "❌ Wrong!",
      correct ? "Great job!" : `The answer was ${currentAnimal.name}`,
      [
        {
          text: "Next",
          onPress: () => {
            if (currentHintIndex < animals.length - 1) {
              setCurrentHintIndex((p) => p + 1);
              setIsAnswered(false);
              setSelectedAnimal(null);
              setCorrectAnimal(null);
            } else setGameOver(true);
          },
        },
      ]
    );
  };

  const handleRestart = () => {
    setScore(0);
    setCurrentHintIndex(0);
    setIsAnswered(false);
    setSelectedAnimal(null);
    setCorrectAnimal(null);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <View style={styles.gameOverContainer}>
        <Text style={styles.gameOverTitle}>🎮 Game Over!</Text>
        <Text style={styles.finalScore}>Final Score: {score}</Text>
        <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
          <Text style={styles.restartButtonText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.score}>Score: {score}</Text>
          <Text style={styles.progress}>
            Question {currentHintIndex + 1}/{animals.length}
          </Text>
        </View>

        <View style={styles.hintContainer}>
          <Text style={styles.hint}>Hint: {currentAnimal.hint}</Text>
        </View>

        {Platform.OS === "ios"
          ? animals.map((animal, i) => (
              <BalloonItemIOS
                key={animal.name}
                color={colors[i % colors.length]}
                animalName={animal.name}
                delay={i * 400}
                startX={width * (0.15 + i * 0.15)}
                onPress={handleBalloonPress}
                isAnswered={isAnswered}
                selectedAnimal={selectedAnimal}
                correctAnimal={correctAnimal}
                freeze={isAnswered}
              />
            ))
          : animals.map((animal, i) => (
              <BalloonItemAndroid
                key={animal.name}
                color={colors[i % colors.length]}
                animalName={animal.name}
                delay={i * 400}
                startX={width * (0.15 + i * 0.15)}
                onPress={handleBalloonPress}
                isAnswered={isAnswered}
                selectedAnimal={selectedAnimal}
                correctAnimal={correctAnimal}
                freeze={isAnswered}
              />
            ))}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
  },
  score: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  progress: {
    fontSize: 16,
    color: "#666",
  },
  hintContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#6366f1",
  },
  hint: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
  },
  gameOverTitle: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  finalScore: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
    color: "#6366f1",
  },
  restartButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
  },
  restartButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
