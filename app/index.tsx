
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../contexts/AppContext';
import { commonStyles, colors } from '../styles/commonStyles';
import { voiceService } from '../services/voiceService';

export default function SplashScreen() {
  const { state } = useApp();
  const [logoScale] = useState(new Animated.Value(0));
  const [logoRotation] = useState(new Animated.Value(0));
  const [textOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    startAnimations();
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      const timer = setTimeout(() => {
        if (state.hasCompletedOnboarding && state.user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [state.isLoading, state.hasCompletedOnboarding, state.user]);

  const startAnimations = () => {
    // Logo scale animation
    Animated.timing(logoScale, {
      toValue: 1,
      duration: 1000,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start();

    // Logo rotation animation
    Animated.loop(
      Animated.timing(logoRotation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Text fade in
    setTimeout(() => {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 500);
  };

  const logoRotationInterpolate = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[commonStyles.container, styles.container]}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [
              { scale: logoScale },
              { rotate: logoRotationInterpolate },
            ],
          },
        ]}
      >
        <Text style={styles.logo}>🪷</Text>
      </Animated.View>
      
      <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
        <Text style={[commonStyles.title, styles.appName]}>നേലോത്സവം</Text>
        <Text style={[commonStyles.subtitle, styles.appNameEn]}>Nelotsavam</Text>
        <Text style={[commonStyles.text, styles.tagline]}>
          കേരള കർഷകർക്കുള്ള സുസ്ഥിര കൃഷി ആപ്പ്
        </Text>
        <Text style={[commonStyles.text, styles.taglineEn]}>
          Sustainable Farming App for Kerala Farmers
        </Text>
      </Animated.View>

      <View style={styles.loadingContainer}>
        <Animated.View style={[styles.loadingDot, { opacity: textOpacity }]} />
        <Animated.View style={[styles.loadingDot, { opacity: textOpacity }]} />
        <Animated.View style={[styles.loadingDot, { opacity: textOpacity }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    fontSize: 120,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
  },
  appNameEn: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  taglineEn: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
});
