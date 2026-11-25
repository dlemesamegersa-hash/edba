const ROUTES = { pdf: 'PdfViewer', html: 'HtmlViewer', image: 'ImageViewer' };
export const openFile = (nav, entry) => nav.navigate(ROUTES[entry.type] || 'PdfViewer', { fileId: entry.id });
