import React from 'react';
import { Page, Txt, SectionTitle, Empty, Card } from '../../components/common';
import FileRow from '../../components/FileRow';
import { useContent } from '../../context/ContentContext';
import { isPublished } from '../../services/content/downloadService';

export default function OfflineMaterialsScreen() {
  const { files, registry } = useContent();
  const have = files.filter((f) => registry[f.id]);
  const need = files.filter((f) => !registry[f.id] && isPublished(f));
  return (
    <Page>
      <SectionTitle>Available offline</SectionTitle>
      {have.length === 0 && <Empty text="Nothing downloaded yet." />}
      {have.map((f) => <FileRow key={f.id} file={f} showRemove />)}
      <SectionTitle>Requires internet</SectionTitle>
      {need.length === 0 && <Txt muted>Everything published is downloaded.</Txt>}
      {need.map((f) => <Card key={f.id}><Txt>{f.name}</Txt><Txt muted size={12}>Not downloaded</Txt></Card>)}
    </Page>
  );
}
