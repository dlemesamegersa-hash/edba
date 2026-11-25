import React from 'react';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useTheme, radius, spacing } from '../theme';

export function Button({ title, onPress, loading, variant = 'primary', disabled }) {
  const t = useTheme();
  const solid = variant === 'primary';
  return (
    <TouchableOpacity accessibilityRole="button" onPress={onPress} disabled={disabled || loading}
      style={{ backgroundColor: solid ? t.primary : 'transparent', padding: 14, borderRadius: radius,
        alignItems: 'center', minHeight: 48, justifyContent: 'center', opacity: disabled ? 0.5 : 1 }}>
      {loading ? <ActivityIndicator color={solid ? '#fff' : t.primary} />
        : <Text style={{ color: solid ? '#fff' : t.primary, fontWeight: '600', fontSize: 16 }}>{title}</Text>}
    </TouchableOpacity>
  );
}

export function Field(props) {
  const t = useTheme();
  return (
    <TextInput placeholderTextColor={t.muted} autoCapitalize="none"
      style={{ backgroundColor: t.card, color: t.text, borderColor: t.border, borderWidth: 1,
        borderRadius: radius, padding: 14, marginBottom: spacing.md, fontSize: 16 }} {...props} />
  );
}

export function Screen({ children }) {
  const t = useTheme();
  return <View style={{ flex: 1, backgroundColor: t.bg, padding: spacing.lg, justifyContent: 'center' }}>{children}</View>;
}
export const Title = ({ children }) => {
  const t = useTheme();
  return <Text style={{ color: t.text, fontSize: 26, fontWeight: '700', marginBottom: spacing.md }}>{children}</Text>;
};
export const Muted = ({ children, style }) => {
  const t = useTheme();
  return <Text style={[{ color: t.muted, marginBottom: spacing.md }, style]}>{children}</Text>;
};
