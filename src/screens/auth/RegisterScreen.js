import React, { useState } from 'react';
import { notify } from '../../utils/dialog';
import { Screen, Title, Field, Button } from '../../components/ui';
import { register, friendlyAuthError } from '../../services/auth/authService';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (password !== confirm) return notify('Passwords do not match');
    setBusy(true);
    try { await register(email, password); }
    catch (e) { notify('Registration failed', friendlyAuthError(e)); }
    finally { setBusy(false); }
  };

  return (
    <Screen>
      <Title>Create account</Title>
      <Field placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Field placeholder="Password (min 6 characters)" secureTextEntry value={password} onChangeText={setPassword} />
      <Field placeholder="Confirm password" secureTextEntry value={confirm} onChangeText={setConfirm} />
      <Button title="Register" onPress={submit} loading={busy} />
    </Screen>
  );
}
