import fetch from 'node-fetch';

export async function handler(event) {
  console.log("🔐 OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

  const body = JSON.parse(event.body || '{}');
  const userMessage = body.message;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful health assistant. Only answer disease-related queries, symptoms, suggestions, and provide common advice. Avoid serious diagnosis. Suggest articles or simple medicines if safe.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log("🔄 FULL OPENAI RESPONSE:", data); 

    const botReply = data.choices?.[0]?.message?.content || "Sorry, I couldn't understand. Try rephrasing.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: botReply })
    };

  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: 'Error reaching AI. Please try again later.' })
    };
  }
}
