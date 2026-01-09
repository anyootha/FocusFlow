import fetch from "node-fetch";

export async function sendToTelegram(text) {
  try {
    const url = `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`;

    if (!process.env.TG_BOT_TOKEN) {
      throw new Error("Переменная окружения TG_BOT_TOKEN не установлена");
    }
    if (!process.env.TG_CHAT_ID) {
      throw new Error("Переменная окружения TG_CHAT_ID не установлена");
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: process.env.TG_CHAT_ID,
        text: text,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        `Telegram API error: ${res.status} ${
          res.statusText
        }. Details: ${JSON.stringify(errorData)}`
      );
    }

    const result = await res.json();

    if (!result.ok) {
      throw new Error(
        `Telegram API returned error: ${result.description || "Unknown error"}`
      );
    }

    return result;
  } catch (error) {
    console.error("Ошибка при отправке в Telegram:", error);
    throw error;
  }
}
