import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { Page, Txt } from '../../components/common';
import { useContent } from '../../context/ContentContext';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

export default function HtmlViewerScreen({ route, navigation }) {
  const { registry, markOpened } = useContent();
  const entry = registry[route.params.fileId];
  const [html, setHtml] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!entry) return;
    navigation.setOptions({ title: entry.name });
    markOpened(entry);
    FileSystem.readAsStringAsync(entry.localPath)
      .then((raw) => setHtml(sanitizeHtml(raw, registry)))
      .catch((e) => setError(e.message));
  }, []);

  if (Platform.OS === 'web') return <Page><Txt muted>HTML lessons open in the Android app, not the web preview.</Txt></Page>;
  if (!entry) return <Page><Txt muted>This lesson is not downloaded. Go back and download it first.</Txt></Page>;
  if (error) return <Page><Txt bold>Could not open this lesson</Txt><Txt muted>{error}</Txt></Page>;
  if (html === null) return <Page><Txt muted>Loading...</Txt></Page>;
  const { WebView } = require('react-native-webview');
  return (
    <WebView
      originWhitelist={['file://*', 'about:*']}
      source={{ html, baseUrl: FileSystem.documentDirectory }}
      javaScriptEnabled={false}
      domStorageEnabled={false}
      allowFileAccess
      allowFileAccessFromFileURLs={false}
      allowUniversalAccessFromFileURLs={false}
      mixedContentMode="never"
      setSupportMultipleWindows={false}
      onShouldStartLoadWithRequest={(r) => r.url === 'about:blank' || r.url.startsWith('file://')}
    />
  );
}
