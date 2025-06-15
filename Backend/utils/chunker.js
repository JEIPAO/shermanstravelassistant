function chunkText(text, maxLen = 500) {
  const sentences = text.split('. ');
  const chunks = [];
  let chunk = '';
  for (const sentence of sentences) {
    if ((chunk + sentence).length > maxLen) {
      chunks.push(chunk);
      chunk = '';
    }
    chunk += sentence + '. ';
  }
  if (chunk) chunks.push(chunk);
  return chunks;
}
