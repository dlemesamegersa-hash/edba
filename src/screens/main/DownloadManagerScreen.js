import React, { useMemo } from 'react';
import { SectionList, View } from 'react-native';
import { Txt, SmallBtn, Empty, OfflineBanner, SectionTitle } from '../../components/common';
import FileRow from '../../components/FileRow';
import { useContent } from '../../context/ContentContext';
import { useTheme } from '../../theme';
import { formatDate } from '../../utils/format';

const ORDER = [
  ['downloading', 'Downloading'], ['failed', 'Failed downloads'], ['update', 'Updates available'],
  ['available', 'Available to download'], ['downloaded', 'Downloaded'], ['unpublished', 'Not published yet'],
];

export default function DownloadManagerScreen() {
  const t = useTheme();
  const { files, statusOf, sync, syncing, online, lastSync, syncError, updateAll, updates } = useContent();
  const sections = useMemo(() => ORDER.map(([k, title]) => ({
    title, data: files.filter((f) => statusOf(f).state === k),
  })).filter((s) => s.data.length), [files, statusOf]);

  return (
    <SectionList
      style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
      sections={sections} keyExtractor={(f) => f.id}
      ListHeaderComponent={
        <View>
          <OfflineBanner />
          <Txt muted size={13}>Last synchronised: {formatDate(lastSync)}</Txt>
          {syncError ? <Txt size={13} color="#D1343B">{syncError}</Txt> : null}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <SmallBtn title={syncing ? 'Syncing...' : 'Sync now'} onPress={() => sync({ manual: true })} disabled={syncing || !online} />
            {updates.modified.length > 0 && online && <SmallBtn title="Update all" onPress={updateAll} />}
          </View>
        </View>
      }
      renderSectionHeader={({ section }) => <SectionTitle>{section.title}</SectionTitle>}
      renderItem={({ item }) => <FileRow file={item} showRemove />}
      ListEmptyComponent={<Empty text="No materials listed yet." />}
    />
  );
}
