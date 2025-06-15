const { OpenAI } = require('openai');
const crypto = require('crypto');

async function embedAndUpsert(textChunks, pineconeIndex, namespace) {
  for (const chunk of textChunks) {
    const embedding = await openai.embeddings.create({ model: 'text-embedding-3-small', input: chunk });
    const id = crypto.createHash('sha256').update(chunk).digest('hex');

    await pineconeIndex.upsert({
      upsertRequest: {
        vectors: [{ id, values: embedding.data[0].embedding, metadata: { chunk, source: namespace } }],
        namespace,
      }
    });
  }
}
