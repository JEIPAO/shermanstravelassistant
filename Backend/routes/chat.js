const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');
const supabase = require('../utils/supabase'); // your supabase client
const dayjs = require('dayjs');

// ENV VARS
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

router.post('/', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });

  try {
    // 1. Embed the question
    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-3-small', // or any embedding model
      input: question,
    });
    const userEmbedding = embeddingRes.data[0].embedding;

    // 2. Search Pinecone
    const queryRes = await pineconeIndex.query({
      vector: userEmbedding,
      topK: 5,
      includeMetadata: true,
    });

    const matches = queryRes.matches || [];
    const context = matches.map((match) => match.metadata.text).join('\n---\n');
    const sources = matches.map((match) => match.metadata.url);

    // 3. Use OpenAI Chat Completion
    const chatRes = await openai.chat.completions.create({
      model: 'gpt-4o', // or gpt-3.5-turbo if you're on a tighter quota
      messages: [
        {
          role: 'system',
          content: `You are a helpful travel assistant. Answer questions using ONLY the context provided. If the answer is not in the context, say "I don’t know based on the information I have."`,
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0.3,
    });

    const answer = chatRes.choices[0].message.content;

    // 4. Save chat to Supabase
    const { data, error } = await supabase
      .from('chat_history')
      .insert([{
        question,
        answer,
        sources,
        timestamp: dayjs().toISOString(),
        }
      ])
      .select();
      console.log('Chat saved:', data);
    if (error) {
      console.error('Error saving chat:', error);
      return res.status(500).json({ error: 'Failed to save chat' });
    }

    
    // 5. Return result
    res.json({ answer, sources });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch answer' });
  }
});

module.exports = router;
