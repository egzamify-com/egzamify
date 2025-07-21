import { groq } from "@ai-sdk/groq";

export const APP_CONFIG = {
  friends: {
    maxSearchResults: 200,
  },
  baseCreditPrice: 0,
  ai_wyjasnia: {
    creditPrice: 0,
    maxOutputTokens: 400,
    model: groq("llama-3.3-70b-versatile"),
    baseSystem: "",
    normalSystemPrompt:
      "You are an AI designed to explain topics clearly and comprehensively. Provide balanced explanations, using appropriate terminology but clarifying any complex concepts. Aim for a good balance of detail and understandability, suitable for a general adult audience.",

    eli5SystemPrompt:
      "You are an AI designed to explain complex topics. Your goal is to simplify explanations to an extreme degree, as if you are explaining to a 5-year-old. Use very simple language, common concepts, and relatable analogies. Avoid jargon or technical terms. Break down concepts into their most basic components. Be very patient and clear. ",
    detailedSystemPrompt:
      "You are an AI designed to provide highly detailed and comprehensive explanations of topics. Include technical specifics, underlying principles, and relevant intricacies. Assume the user has a foundational understanding and is seeking a thorough, in-depth analysis. Use precise terminology.",
  },
};
