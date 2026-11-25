import { useColorScheme } from 'react-native';

const light = { bg: '#F5F7FB', card: '#FFFFFF', text: '#1B2430', muted: '#6B7686', primary: '#1F6FEB', danger: '#D1343B', border: '#E1E6EF' };
const dark = { bg: '#0F141B', card: '#18202B', text: '#EEF2F8', muted: '#97A3B6', primary: '#5B9BFF', danger: '#FF6B72', border: '#263140' };

export const radius = 14;
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24 };
export const useTheme = () => (useColorScheme() === 'dark' ? dark : light);
