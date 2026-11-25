// Used ONLY when GitHub is unreachable and nothing has ever been cached (first run, offline).
// It contains no educational content: every file is an unpublished placeholder.
const subject = (id, name) => ({
  id, name,
  description: 'Placeholder subject. Real content appears once it is published on GitHub.',
  chapters: [{
    id: 'chapter-01', title: 'Chapter 1 (placeholder)',
    files: [{
      id: `${id}-ch1-notes`, name: 'Chapter 1 Notes (placeholder)', type: 'pdf',
      path: `subjects/${id}/chapter-01/notes.pdf`, version: '0.0', size: 0,
      sha256: 'REPLACE_WITH_REAL_SHA256', description: 'Placeholder',
    }],
  }],
});

export default {
  placeholder: true,
  contentVersion: '0.0.0',
  lastUpdated: null,
  subjects: [
    subject('mathematics', 'Mathematics'), subject('physics', 'Physics'), subject('chemistry', 'Chemistry'),
    subject('biology', 'Biology'), subject('english', 'English'), subject('geography', 'Geography'),
    subject('history', 'History'),
  ],
};
