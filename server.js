import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { askAI } from "./services/openai.js";
import { sendToTelegram } from "./services/telegram.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/analyze", async (req, res) => {
  try {
    const { goal, status, risks, questions } = req.body;

    if (!goal) {
      return res
        .status(400)
        .json({ error: "Поле 'goal' обязательно для заполнения" });
    }

    const report = await askAI({ goal, status, risks, questions });

    await sendToTelegram(
      `Подготовка к встрече
Цель: ${goal}

Краткий анализ:
${report}`
    );

    res.json({ report });
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);
    res.status(500).json({
      error: "Произошла ошибка при обработке запроса",
      details: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("FocusFlow running on http://localhost:3000");
});
