import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Screen, Title } from '../components/ui';

export default function SplashScreen() {
  return <Screen><Title>Grade 9 Learning</Title><ActivityIndicator size="large" /></Screen>;
}
