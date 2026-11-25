import React, { useEffect } from 'react';
import { Page, Txt, Empty, SmallBtn, OfflineBanner } from '../../components/common';
import FileRow from '../../components/FileRow';
import { useContent } from '../../context/ContentContext';
import { isPublished } from '../../services/content/downloadService';

// Chapter materials: each file can be downloaded, opened offline, updated or retried.
export default function LessonViewerScreen({ route, navigation }) {
  const { subjectId, chapterId } = route.params;
  const { files, manifest, registry, online, downloadAll } = useContent();
  const chapter = manifest.subjects.find((s) => s.id === subjectId)?.chapters.find((c) => c.id === chapterId);
  useEffect(() => { if (chapter) navigation.setOptions({ title: chapter.title }); }, [chapter]);
  const list = files.filter((f) => f.subjectId === subjectId && f.chapterId === chapterId);
  const missing = list.filter((f) => isPublished(f) && !registry[f.id]);
  return (
    <Page>
      <OfflineBanner />
      {list.length === 0 && <Empty text="No files in this chapter yet." />}
      {missing.length > 1 && online && <SmallBtn title={`Download all (${missing.length})`} onPress={() => downloadAll(list)} />}
      <Txt style={{ height: 8 }} />
      {list.map((f) => <FileRow key={f.id} file={f} />)}
    </Page>
  );
}
