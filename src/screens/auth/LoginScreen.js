import React, { useState } from 'react';
import { notify } from '../../utils/dialog';
import { Screen, Title, Field, Button } from '../../components/ui';
import { login, friendlyAuthError } from '../../services/auth/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try { await login(email, password); } // AuthContext reacts to the new session
    catch (e) { notify('Sign in failed', friendlyAuthError(e)); }
    finally { setBusy(false); }
  };

  return (
    <Screen>
      <Title>Sign in</Title>
      <Field placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Field placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Sign in" onPress={submit} loading={busy} />
      <Button title="Forgot password?" variant="secondary" onPress={() => navigation.navigate('ResetPassword')} />
    </Screen>
  );
}
