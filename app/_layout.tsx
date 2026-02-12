
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { useEffect } from "react";
import "react-native-reanimated";
import { SystemBars } from "react-native-edge-to-edge";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { AppProvider } from "../contexts/AppContext";
import { farmColors } from "../constants/Colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const NelotsavamTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: farmColors.primary,
    background: farmColors.background,
    card: farmColors.surface,
    text: farmColors.text,
    border: farmColors.textSecondary + '30',
    notification: farmColors.accent,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={NelotsavamTheme}>
          <SystemBars style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="profile-creation" />
            <Stack.Screen name="crop-selection" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <StatusBar style="dark" backgroundColor={farmColors.background} />
        </ThemeProvider>
      </GestureHandlerRootView>
    </AppProvider>
  );
}
