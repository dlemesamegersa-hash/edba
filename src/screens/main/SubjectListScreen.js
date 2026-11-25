import React from 'react';
import { Page, Card, Txt, Empty, OfflineBanner } from '../../components/common';
import { useContent } from '../../context/ContentContext';

export default function SubjectListScreen({ navigation }) {
  const { manifest, files, registry } = useContent();
  return (
    <Page>
      <OfflineBanner />
      {manifest.subjects.length === 0 && <Empty text="No subjects yet. Connect to the internet and sync." />}
      {manifest.subjects.map((s) => {
        const sf = files.filter((f) => f.subjectId === s.id);
        const dl = sf.filter((f) => registry[f.id]).length;
        return (
          <Card key={s.id} onPress={() => navigation.navigate('SubjectDetails', { subjectId: s.id })}>
            <Txt bold size={17}>{s.name}</Txt>
            <Txt muted size={13}>{s.chapters.length} chapters · {dl}/{sf.length} downloaded</Txt>
          </Card>
        );
      })}
    </Page>
  );
}
