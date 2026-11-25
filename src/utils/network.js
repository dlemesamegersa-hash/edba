import NetInfo from '@react-native-community/netinfo';

export async function isOnline() {
  const s = await NetInfo.fetch();
  return !!s.isConnected && s.isInternetReachable !== false;
}
export const subscribeToNetwork = (cb) =>
  NetInfo.addEventListener((s) => cb(!!s.isConnected && s.isInternetReachable !== false));
