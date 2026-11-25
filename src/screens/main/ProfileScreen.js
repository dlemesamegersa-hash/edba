import React from 'react';
import { Page, Card, Txt } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/auth/authService';

export default function ProfileScreen({ navigation }) {
  const { user } = useAuth();
  const Item = ({ label, to }) => <Card onPress={() => navigation.navigate(to)}><Txt bold>{label}</Txt></Card>;
  return (
    <Page>
      <Card><Txt bold size={18}>{user?.email}</Txt><Txt muted>Grade 9 student</Txt></Card>
      <Item label="Offline materials" to="OfflineMaterials" />
      <Item label="Update notifications" to="Updates" />
      <Item label="Settings" to="Settings" />
      <Item label="About this app" to="About" />
      <Card onPress={logout}><Txt bold color="#D1343B">Sign out</Txt></Card>
    </Page>
  );
}
