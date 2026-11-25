import React from 'react';
import { View } from 'react-native';
import { Screen, Title, Muted, Button } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export default function WelcomeScreen({ navigation }) {
  const { sessionExpired } = useAuth();
  return (
    <Screen>
      <Title>Welcome, Grade 9 student</Title>
      <Muted>Study your materials anywhere, even without internet, after your first download.</Muted>
      {sessionExpired && <Muted>Your offline session has expired. Please connect to the internet and sign in again.</Muted>}
      <Button title="Sign in" onPress={() => navigation.navigate('Login')} />
      <View style={{ height: 8 }} />
      <Button title="Create account" variant="secondary" onPress={() => navigation.navigate('Register')} />
    </Screen>
  );
}
