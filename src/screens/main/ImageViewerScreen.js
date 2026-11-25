import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import { Page, Txt } from '../../components/common';
import { useContent } from '../../context/ContentContext';

export default function ImageViewerScreen({ route, navigation }) {
  const { registry, markOpened } = useContent();
  const entry = registry[route.params.fileId];
  useEffect(() => { if (entry) { navigation.setOptions({ title: entry.name }); markOpened(entry); } }, []);
  if (!entry) return <Page><Txt muted>This image is not downloaded.</Txt></Page>;
  return <View style={{ flex: 1, backgroundColor: '#000' }}><Image source={{ uri: entry.localPath }} style={{ flex: 1 }} resizeMode="contain" /></View>;
}
