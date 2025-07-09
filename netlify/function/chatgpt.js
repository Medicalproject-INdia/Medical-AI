const fetch = require('node-fetch');

exports.handler = async function (event) {
  const body = JSON.parse(event.body);
  const userMessage = body.message;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': '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'  // 🛑 Replace with your real key
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful health assistant. Only answer disease-related queries, symptoms, suggestions, and provide common advice. Avoid serious diagnosis. Suggest articles or simple medicines if safe.' },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  const botReply = data.choices?.[0]?.message?.content || "Sorry, I couldn't understand. Try rephrasing.";

  return {
    statusCode: 200,
    body: JSON.stringify({ reply: botReply })
  };
};
