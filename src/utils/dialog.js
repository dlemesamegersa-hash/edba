import { Alert, Platform } from 'react-native';
// Alert.alert does nothing on web, so fall back to window dialogs there.
export function notify(title, msg) {
  if (Platform.OS === 'web') window.alert(msg ? `${title}\n\n${msg}` : title);
  else Alert.alert(title, msg);
}
export function confirm(title, msg, onYes, yesLabel = 'Remove') {
  if (Platform.OS === 'web') { if (window.confirm(`${title}\n\n${msg}`)) onYes(); }
  else Alert.alert(title, msg, [{ text: 'Cancel', style: 'cancel' }, { text: yesLabel, style: 'destructive', onPress: onYes }]);
}
