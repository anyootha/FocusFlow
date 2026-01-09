import fetch from "node-fetch";

export async function askAI(data) {
  const prompt = `Ты бизнес-наставник.
Проанализируй подготовку сотрудника к встрече с руководителем.

Цель встречи: ${data.goal}
Текущий статус: ${data.status}
Риски: ${data.risks}
Вопросы к руководителю: ${data.questions}

Дай:
1. Краткую оценку готовности
2. Что улучшить
3. Как лучше сформулировать мысли`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    if (
      !json.choices ||
      !json.choices[0] ||
      !json.choices[0].message ||
      !json.choices[0].message.content
    ) {
      throw new Error("Неверный формат ответа от OpenAI API");
    }

    return json.choices[0].message.content;
  } catch (error) {
    console.error("Ошибка при обращении к OpenAI API:", error);
    throw error;
  }
}
