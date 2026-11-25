import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { Page, Txt } from '../../components/common';
import { useContent } from '../../context/ContentContext';

// In-app PDF viewer (react-native-pdf). It needs native code: use a development build, not Expo Go or web.
export default function PdfViewerScreen({ route, navigation }) {
  const { registry, markOpened } = useContent();
  const entry = registry[route.params.fileId];
  const [error, setError] = useState(null);
  const [page, setPage] = useState('');
  let Pdf = null;
  if (Platform.OS !== 'web') { try { Pdf = require('react-native-pdf').default; } catch (e) { Pdf = null; } }

  useEffect(() => { if (entry) { navigation.setOptions({ title: entry.name }); markOpened(entry); } }, []);

  if (!entry) return <Page><Txt muted>This file is not downloaded. Go back and download it first.</Txt></Page>;
  if (!Pdf) return <Page><Txt bold>PDF viewer unavailable here</Txt><Txt muted>Run the app as an Android development build (npx expo run:android). Expo Go and the web preview cannot show PDFs.</Txt></Page>;
  if (error) return <Page><Txt bold>Could not open this PDF</Txt><Txt muted>{String(error)}</Txt></Page>;
  return (
    <View style={{ flex: 1 }}>
      <Pdf source={{ uri: entry.localPath }} style={{ flex: 1 }} trustAllCerts={false}
        onError={(e) => setError(e?.message || e)} onPageChanged={(p, total) => setPage(`${p}/${total}`)} />
      {page ? <Txt muted size={12} style={{ textAlign: 'center', padding: 4 }}>Page {page}</Txt> : null}
    </View>
  );
}
