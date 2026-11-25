import React from 'react';
import { Page, Card, Txt } from '../../components/common';
import { CONTENT_CONFIG } from '../../config';

export default function AboutScreen() {
  return (
    <Page>
      <Card><Txt bold size={18}>Grade 9 Learning</Txt><Txt muted>Offline-first study app for Grade 9 students.</Txt></Card>
      <Card>
        <Txt bold>Your downloads</Txt>
        <Txt muted size={13}>Downloaded materials are stored privately inside this app. They do not appear in your Downloads folder or gallery and other apps cannot open them. If you uninstall the app or clear its data, Android deletes them and you will need to download them again.</Txt>
      </Card>
      <Card><Txt bold>Content source</Txt><Txt muted size={13}>{CONTENT_CONFIG.owner}/{CONTENT_CONFIG.repo} ({CONTENT_CONFIG.branch})</Txt></Card>
    </Page>
  );
}
