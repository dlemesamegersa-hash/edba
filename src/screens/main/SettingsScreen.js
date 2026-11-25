import React from 'react';
import { Switch, View } from 'react-native';
import { Page, Card, Txt, SmallBtn } from '../../components/common';
import { useContent } from '../../context/ContentContext';
import { SESSION_POLICY } from '../../config';
import { formatBytes } from '../../utils/format';
import { confirm } from '../../utils/dialog';

export default function SettingsScreen() {
  const { settings, setAutoSync, registry, clearAll } = useContent();
  const used = Object.values(registry).reduce((n, e) => n + (e.size || 0), 0);
  return (
    <Page>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}><Txt bold>Automatic sync</Txt><Txt muted size={13}>Check for new content when internet becomes available.</Txt></View>
          <Switch value={settings.autoSync} onValueChange={setAutoSync} />
        </View>
      </Card>
      <Card>
        <Txt bold>Storage</Txt>
        <Txt muted size={13}>{Object.keys(registry).length} files · {formatBytes(used)} in private app storage</Txt>
        <SmallBtn danger title="Remove all downloads" onPress={() => confirm('Remove all downloads?', 'This deletes every downloaded material from this device. You can download them again later.', clearAll, 'Remove all')} />
      </Card>
      <Card>
        <Txt bold>Offline sign-in</Txt>
        <Txt muted size={13}>You can use the app offline for up to {SESSION_POLICY.maxOfflineDays} days after your last online sign-in or check.</Txt>
      </Card>
    </Page>
  );
}
