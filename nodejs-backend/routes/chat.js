const express = require('express');
const router = express.Router();
const { getOpenAIClient } = require('../util');

// Endpoint for chat
router.post('/chat', async (req, res) => {
  const { query, messages } = req.body;

  if (!query) {
    return res.status(400).json({ detail: "Query cannot be empty" });
  }

  try {
    const client = await getOpenAIClient();
    // Call OpenAI API
    const response = await client.chat.completions.create({
      model: "gpt-4o-2024-05-13",
      messages: messages,
      temperature: 0.7
    });

    const assistant_message = response.choices[0].message.content;
    messages.push({ role: "system", content: assistant_message });

    return res.json({ messages: messages });
  } catch (e) {
    return res.status(500).json({ detail: `Failed to generate response: ${e.message}` });
  }
});

module.exports = router;