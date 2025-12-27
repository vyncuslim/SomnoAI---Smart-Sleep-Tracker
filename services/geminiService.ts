
import { GoogleGenAI, Type } from "@google/genai";
import { SleepRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSleepAdvice = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], currentData: SleepRecord[]) => {
  try {
    const dataSummary = currentData.map(d => 
      `日期: ${d.date}, 评分: ${d.score}, 时长: ${d.durationHours}h, 深睡: ${d.stages.deep}%, REM: ${d.stages.rem}%`
    ).join('\n');

    const systemInstruction = `
      你是一位世界级的睡眠专家和健康教练 SomnoAI。
      请根据用户的睡眠数据提供个性化、专业且富有鼓励性的建议。
      回复应简洁明了，使用亲切的中文。
      
      用户近期睡眠数据：
      ${dataSummary}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history.length > 0 ? history : [{ role: 'user', parts: [{ text: "你好，请根据我的数据做一个简要的睡眠分析。" }] }],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "抱歉，我现在无法分析您的数据。";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "连接出现了一些问题，请检查网络。";
  }
};

export const getQuickInsight = async (data: SleepRecord) => {
  try {
    const prompt = `基于 ${data.score} 的睡眠评分和 ${data.durationHours} 小时的时长，提供一句简短的中文睡眠洞察。`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "你是一个简洁的睡眠助手。只输出一句中文建议，不需要多余的话。",
      }
    });
    return response.text || "您的睡眠模式非常稳定。";
  } catch {
    return "保持规律的作息是提高睡眠质量的关键。";
  }
};
