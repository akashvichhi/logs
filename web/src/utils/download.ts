/**
 * Triggers a browser file download using a hidden anchor tag.
 * Fully generic — can be used for object URLs (Blobs) or remote file URLs.
 *
 * @param url      - The URL of the file to download.
 * @param filename - The name the file should be saved as.
 */
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Escapes a single CSV cell value.
 * Wraps in double-quotes and escapes internal double-quotes if the value
 * contains commas, newlines, or double-quote characters.
 */
const escapeCsvCell = (value: string): string => {
  const needsQuoting = /[",\n\r]/.test(value);
  return needsQuoting ? `"${value.replace(/"/g, '""')}"` : value;
};

/**
 * Builds a CSV string from pre-formatted headers and rows, then triggers a
 * browser file-download. Fully generic — contains no domain knowledge.
 *
 * @param headers  - The column header labels (e.g. ['ID', 'Name']).
 * @param dataRows - A 2-D array of pre-formatted string cells, one array per row.
 * @param filename - The name of the downloaded file.
 */
export const generateAndDownloadCsv = (
  headers: string[],
  dataRows: string[][],
  filename: string,
): void => {
  const headerRow = headers.map(escapeCsvCell).join(',');
  const bodyRows = dataRows.map((row) => row.map(escapeCsvCell).join(','));

  const csvContent = [headerRow, ...bodyRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  downloadFile(url, filename);
  URL.revokeObjectURL(url);
};
