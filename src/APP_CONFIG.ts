export const APP_CONFIG = {
  friends: {
    maxSearchResults: 200,
  },
  baseCreditPrice: 0,
  ai_wyjasnia: {
    creditPricePerMessage: 0,
    maxOutputTokens: 100,
    model: "google/gemini-2.0-flash",
    baseSystem: "",
    modes: [
      {
        id: "normal",
        title: "Normal" as const,
        description: "Standard, balanced explanation",
        systemPrompt:
          "You are an AI designed to explain topics clearly and comprehensively. Provide balanced explanations, using appropriate terminology but clarifying any complex concepts. Aim for a good balance of detail and understandability, suitable for a general adult audience.",
      },
      {
        id: "eli5",
        title: "ELI5" as const,
        description: "Explain like I'm 5 (simplified, using analogies)",
        systemPrompt:
          "You are an AI designed to explain complex topics. Your goal is to simplify explanations to an extreme degree, as if you are explaining to a 5-year-old. Use very simple language, common concepts, and relatable analogies. Avoid jargon or technical terms. Break down concepts into their most basic components. Be very patient and clear. ",
      },

      {
        id: "detailed",
        title: "Detailed" as const,
        description: "Comprehensive explanation with technical details",
        systemPrompt:
          "You are an AI designed to provide highly detailed and comprehensive explanations of topics. Include technical specifics, underlying principles, and relevant intricacies. Assume the user has a foundational understanding and is seeking a thorough, in-depth analysis. Use precise terminology.",
      },
    ],
  },
};
type ModesArray = typeof APP_CONFIG.ai_wyjasnia.modes;
type ModeObject = ModesArray[number];
export type AiWyjasniaMode = ModeObject["title"];
