import { GoogleGenAI } from "@google/genai";
import { Prize } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePrizeReaction = async (prize: Prize): Promise<string> => {
  if (!apiKey) {
    return "离线模式：哎哟不错哦！";
  }

  try {
    const modelId = "gemini-2.5-flash";
    const prompt = `
      你现在是一个超级盲盒抽奖机的智能解说员。你的风格要非常年轻、潮流、甚至有点“毒舌”或者“夸张”。必须使用中文。

      用户刚刚抽到了：
      奖品名称：${prize.name}
      稀有度：${prize.rarity} (common=普通, rare=稀有, legendary=传说)
      描述：${prize.description}

      请给出一段简短的评语（不超过30个字）：
      - 如果是传说 (Legendary)：疯狂吹捧，用大量的感叹号，称赞用户是欧皇。
      - 如果是稀有 (Rare)：表示肯定，说这波不亏。
      - 如果是普通 (Common) 或 谢谢惠顾：稍微调侃一下用户，或者安慰一下“非酋”。
      - 必须使用中文口语，可以使用Emoji。
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text?.trim() || "系统繁忙，但你这波操作很6！";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "连接宇宙信号失败... 但东西是你的了！";
  }
};