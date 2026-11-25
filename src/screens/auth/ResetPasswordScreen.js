import React, { useState } from 'react';
import { notify } from '../../utils/dialog';
import { Screen, Title, Muted, Field, Button } from '../../components/ui';
import { resetPassword, friendlyAuthError } from '../../services/auth/authService';

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      await resetPassword(email);
      notify('Check your email', 'If an account exists, a reset link has been sent.');
      navigation.goBack();
    } catch (e) { notify('Could not send email', friendlyAuthError(e)); }
    finally { setBusy(false); }
  };

  return (
    <Screen>
      <Title>Reset password</Title>
      <Muted>Requires an internet connection.</Muted>
      <Field placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Button title="Send reset link" onPress={submit} loading={busy} />
    </Screen>
  );
}
