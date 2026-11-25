import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Page, Card, Txt, SectionTitle, Badge, SmallBtn, Bar, Empty, OfflineBanner } from '../../components/common';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { openFile } from '../../utils/openFile';
import { isPublished } from '../../services/content/downloadService';
import { formatDate } from '../../utils/format';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const c = useContent();
  const downloaded = Object.keys(c.registry).length;
  const opened = Object.keys(c.completed).filter((id) => c.registry[id]).length;
  const pct = downloaded ? opened / downloaded : 0;
  const pending = c.newIds.length + c.updates.modified.filter(isPublished).length;
  const name = (user?.email || '').split('@')[0];

  return (
    <Page onRefresh={() => c.sync({ manual: true })} refreshing={c.syncing}>
      <View style={{ height: insets.top }} />
      <Txt bold size={24}>Welcome{name ? `, ${name}` : ''}</Txt>
      <Txt muted style={{ marginBottom: 12 }}>Grade 9 · {c.online ? 'Online' : 'Offline'}</Txt>
      <OfflineBanner />
      {c.isPlaceholder && <Card><Txt bold>Placeholder content</Txt><Txt muted size={13}>No real materials have been published yet. Subjects below are placeholders.</Txt></Card>}
      {pending > 0 && (
        <Card onPress={() => navigation.navigate('Updates')} style={{ borderColor: '#D98A00' }}>
          <Txt bold>{pending} new or updated material{pending > 1 ? 's' : ''} available</Txt>
          <Txt muted size={13}>Tap to review.</Txt>
        </Card>
      )}
      {c.syncError && <Txt size={13} color="#D1343B" style={{ marginBottom: 8 }}>{c.syncError}</Txt>}

      <Card>
        <Txt bold>Learning progress</Txt>
        <Txt muted size={13}>{opened} of {downloaded} downloaded materials opened</Txt>
        <Bar value={pct} />
      </Card>

      <SectionTitle>Subjects</SectionTitle>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {c.manifest.subjects.map((s) => (
          <Card key={s.id} onPress={() => navigation.navigate('SubjectDetails', { subjectId: s.id })} style={{ width: 150, marginRight: 10 }}>
            <Txt bold>{s.name}</Txt>
            <Txt muted size={12}>{s.chapters.length} chapter{s.chapters.length === 1 ? '' : 's'}</Txt>
          </Card>
        ))}
      </ScrollView>

      <SectionTitle>Recently opened</SectionTitle>
      {c.recents.length === 0 ? <Empty text="Nothing opened yet." /> : c.recents.slice(0, 4).map((r) => (
        c.registry[r.id] ? <Card key={r.id} onPress={() => openFile(navigation, c.registry[r.id])}><Txt bold>{r.name}</Txt><Txt muted size={12}>{c.subjectName(r.subjectId)}</Txt></Card> : null
      ))}

      <SectionTitle>Downloaded materials</SectionTitle>
      <Card onPress={() => navigation.navigate('OfflineMaterials')}><Txt bold>{downloaded} file{downloaded === 1 ? '' : 's'} available offline</Txt><Txt muted size={13}>Tap to browse.</Txt></Card>

      <SectionTitle>Latest content update</SectionTitle>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Txt>Content version</Txt><Badge text={c.manifest.contentVersion} tone="info" /></View>
        <Txt muted size={13} style={{ marginTop: 6 }}>Published: {formatDate(c.manifest.lastUpdated)}</Txt>
        <Txt muted size={13}>Last synced: {formatDate(c.lastSync)}</Txt>
        <SmallBtn title={c.syncing ? 'Syncing...' : 'Sync now'} onPress={() => c.sync({ manual: true })} disabled={c.syncing || !c.online} />
      </Card>
    </Page>
  );
}
