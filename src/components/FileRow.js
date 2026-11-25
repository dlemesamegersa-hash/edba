import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Txt, Badge, SmallBtn, Bar } from './common';
import { useContent } from '../context/ContentContext';
import { openFile } from '../utils/openFile';
import { formatBytes, formatDate } from '../utils/format';
import { confirm } from '../utils/dialog';

const BADGES = {
  unpublished: ['Not published', 'muted'], available: ['Not downloaded', 'info'], downloading: ['Downloading', 'info'],
  downloaded: ['Offline ready', 'ok'], update: ['Update available', 'warn'], failed: ['Failed', 'bad'],
};

export default function FileRow({ file, showRemove }) {
  const nav = useNavigation();
  const { statusOf, download, cancel, remove, online, subjectName } = useContent();
  const st = statusOf(file);
  const local = st.local;
  const [label, tone] = BADGES[st.state];
  const open = () => openFile(nav, local);
  const ask = () => confirm('Remove download?', `Delete "${file.name}" from this device? You can download it again later.`, () => remove(file.id));
  const needsNet = !online;

  return (
    <Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Txt bold>{file.name}</Txt>
          <Txt muted size={13}>{subjectName(file.subjectId)} · {file.type.toUpperCase()} · {formatBytes(local?.size || file.size)} · v{local?.version || file.version}</Txt>
          {local && <Txt muted size={12}>Downloaded {formatDate(local.downloadedAt)}</Txt>}
          {file.description ? <Txt muted size={12}>{file.description}</Txt> : null}
        </View>
        <Badge text={label} tone={tone} />
      </View>
      {st.state === 'downloading' && <Bar value={st.progress} />}
      {st.state === 'failed' && <Txt size={13} color="#D1343B" style={{ marginTop: 6 }}>{st.error}</Txt>}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
        {st.state === 'unpublished' && <Txt muted size={13} style={{ marginTop: 8 }}>Waiting for the file to be published on GitHub.</Txt>}
        {st.state === 'available' && (needsNet ? <Txt muted size={13} style={{ marginTop: 8 }}>Requires internet to download.</Txt> : <SmallBtn title="Download" onPress={() => download(file)} />)}
        {st.state === 'downloading' && <><Txt muted size={13} style={{ marginTop: 8, marginRight: 8 }}>{Math.round(st.progress * 100)}%</Txt><SmallBtn title="Cancel" danger onPress={() => cancel(file.id)} /></>}
        {st.state === 'failed' && (needsNet ? <Txt muted size={13} style={{ marginTop: 8 }}>Requires internet to retry.</Txt> : <SmallBtn title="Retry" onPress={() => download(file)} />)}
        {st.state === 'update' && !needsNet && <SmallBtn title="Update" onPress={() => download(file)} />}
        {local && st.state !== 'downloading' && <SmallBtn title="Open" onPress={open} />}
        {local && showRemove && st.state !== 'downloading' && <SmallBtn title="Remove" danger onPress={ask} />}
      </View>
    </Card>
  );
}
