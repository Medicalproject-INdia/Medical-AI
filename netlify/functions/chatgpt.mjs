const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

export const handler = async function (event) {
  console.log("🔐 GROQ_API_KEY:", process.env.GROQ_API_KEY);

  const body = JSON.parse(event.body);
  const userMessage = body.message;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',  // ✅ Updated model
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
    console.log("🔄 FULL GROQ RESPONSE:", JSON.stringify(data));

    const botReply = data.choices?.[0]?.message?.content || "Sorry, I couldn't understand. Try rephrasing.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: botReply })
    };

  } catch (error) {
    console.error('Groq API error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: 'Error reaching AI. Please try again later.' })
    };
  }
};
