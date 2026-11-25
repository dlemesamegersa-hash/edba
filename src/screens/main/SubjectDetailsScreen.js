import React, { useEffect } from 'react';
import { Page, Card, Txt, SectionTitle, Empty } from '../../components/common';
import { useContent } from '../../context/ContentContext';

export default function SubjectDetailsScreen({ route, navigation }) {
  const { subjectId } = route.params;
  const { manifest, registry } = useContent();
  const subject = manifest.subjects.find((s) => s.id === subjectId);
  useEffect(() => { if (subject) navigation.setOptions({ title: subject.name }); }, [subject]);
  if (!subject) return <Page><Empty text="This subject is no longer available." /></Page>;
  return (
    <Page>
      {subject.description ? <Txt muted style={{ marginBottom: 8 }}>{subject.description}</Txt> : null}
      <SectionTitle>Chapters</SectionTitle>
      {subject.chapters.length === 0 && <Empty text="No chapters yet." />}
      {subject.chapters.map((ch) => {
        const dl = ch.files.filter((f) => registry[f.id]).length;
        return (
          <Card key={ch.id} onPress={() => navigation.navigate('LessonViewer', { subjectId, chapterId: ch.id })}>
            <Txt bold>{ch.title}</Txt>
            <Txt muted size={13}>{dl}/{ch.files.length} files downloaded</Txt>
          </Card>
        );
      })}
    </Page>
  );
}
