const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');
const { OpenAI } = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone();
const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

const cleanText = html => {
  const $ = cheerio.load(html);
  $('script, style, nav, footer').remove();
  return $('body').text().replace(/\s+/g, ' ').trim();
};

const chunkText = (text, size = 500) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
};

router.post('/', async (req, res) => {
  try {
    for (const page of req.pagesToScrape) {
      const { data } = await axios.get(page.url);
      const text = cleanText(data);
      const chunks = chunkText(text);

      for (const chunk of chunks) {
        const id = crypto.createHash('sha256').update(chunk).digest('hex');
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: chunk
        });

        console.log(embeddingResponse.data[0].embedding);

        await index.upsert([
          {
            id,
            values: embeddingResponse.data[0].embedding,
            metadata: { url: page.url, label: page.label, text: chunk }
          }
        ]);
      }
    }
    res.json({ success: true, message: 'Scraped and embedded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

module.exports = router;