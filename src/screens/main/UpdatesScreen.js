import React from 'react';
import { View } from 'react-native';
import { Page, Txt, SectionTitle, Empty, SmallBtn, Card } from '../../components/common';
import FileRow from '../../components/FileRow';
import { useContent } from '../../context/ContentContext';
import { isPublished } from '../../services/content/downloadService';

export default function UpdatesScreen() {
  const { updates, files, newIds, updateAll, dismissNew, online, registry } = useContent();
  const fresh = files.filter((f) => newIds.includes(f.id) && !registry[f.id]);
  const changed = updates.modified.filter(isPublished);
  return (
    <Page>
      {fresh.length === 0 && changed.length === 0 && updates.deleted.length === 0 && <Empty text="You are up to date." />}
      {fresh.length > 0 && <><SectionTitle>New materials</SectionTitle><SmallBtn title="Mark as seen" onPress={dismissNew} />{fresh.map((f) => <FileRow key={f.id} file={f} />)}</>}
      {changed.length > 0 && <><SectionTitle>Updated materials</SectionTitle>{online && <SmallBtn title="Update all" onPress={updateAll} />}{changed.map((f) => <FileRow key={f.id} file={f} showRemove />)}</>}
      {updates.deleted.length > 0 && (
        <View>
          <SectionTitle>Removed from the server</SectionTitle>
          <Txt muted size={13}>You can still read your saved copy. Remove it from the Download Manager when you no longer need it.</Txt>
          {updates.deleted.map((e) => <Card key={e.id}><Txt>{e.name}</Txt></Card>)}
        </View>
      )}
    </Page>
  );
}
