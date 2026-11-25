import React from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl } from 'react-native';
import { useTheme, radius, spacing } from '../theme';
import { useContent } from '../context/ContentContext';

export const Page = ({ children, onRefresh, refreshing }) => {
  const t = useTheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ padding: spacing.md, paddingBottom: 48 }}
      refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} /> : undefined}>
      {children}
    </ScrollView>
  );
};
export const Txt = ({ children, muted, bold, size = 15, color, style, ...rest }) => {
  const t = useTheme();
  return <Text style={[{ color: color || (muted ? t.muted : t.text), fontSize: size, fontWeight: bold ? '700' : '400' }, style]} {...rest}>{children}</Text>;
};
export const Card = ({ children, onPress, style }) => {
  const t = useTheme();
  const C = onPress ? Pressable : View;
  return <C onPress={onPress} style={[{ backgroundColor: t.card, borderRadius: radius, padding: spacing.md, marginBottom: 10, borderWidth: 1, borderColor: t.border }, style]}>{children}</C>;
};
export const SectionTitle = ({ children }) => <Txt bold size={18} style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>{children}</Txt>;
export const Empty = ({ text }) => <Txt muted style={{ textAlign: 'center', marginVertical: spacing.lg }}>{text}</Txt>;
export const Badge = ({ text, tone = 'muted' }) => {
  const t = useTheme();
  const c = { muted: t.muted, ok: '#1E9E5A', warn: '#D98A00', bad: t.danger, info: t.primary }[tone];
  return <Text style={{ color: c, borderColor: c, borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, fontSize: 12, overflow: 'hidden' }}>{text}</Text>;
};
export const SmallBtn = ({ title, onPress, danger, disabled }) => {
  const t = useTheme();
  const c = danger ? t.danger : t.primary;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled}
      style={{ borderColor: c, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9, marginRight: 8, marginTop: 8, minHeight: 40, justifyContent: 'center', opacity: disabled ? 0.4 : 1 }}>
      <Text style={{ color: c, fontWeight: '600' }}>{title}</Text>
    </Pressable>
  );
};
export const Bar = ({ value }) => {
  const t = useTheme();
  return (
    <View style={{ height: 8, borderRadius: 4, backgroundColor: t.border, overflow: 'hidden', marginTop: 8 }}>
      <View style={{ height: 8, width: `${Math.round(Math.min(1, value) * 100)}%`, backgroundColor: t.primary }} />
    </View>
  );
};
export function OfflineBanner() {
  const { online } = useContent();
  const t = useTheme();
  if (online) return null;
  return (
    <View style={{ backgroundColor: '#FFF4D6', borderRadius: radius, padding: 12, marginBottom: 10 }}>
      <Text style={{ color: '#6B4E00' }}>You are offline. Downloaded materials are still available.</Text>
    </View>
  );
}
