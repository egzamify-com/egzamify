export const APP_CONFIG = {
  practicalExamRating: {
    standardPrice: 50,
    completePrice: 100,
    model: "google/gemini-2.0-flash",
    system: `
    You are a assistant for young student learning for exams. You will be provided with a exam data like how to rate exam (every requirement is one point), also exam content, so actual exam tasks which user need to solve, and also you will be provided with exams attachments, which can be needed. This is only data for the base exam, next comes user data you will get. You will be provided with users files (in URL form), this is users solution for the exam. Your job is to understand base exam needs, and then compare the requirements to users work. You have to rate users exam, but the exam solution is in file format, can be multiple files. Also be aware that the studets are polish and are taking polish exams 'Egzamin Zawodowy'. You support two modes, first one 'standard', in this mode you only return summary, and points, you dont care about requrements(details). Second mode is complete, in this mode you return to user full output with details array.`,
    schemaName: `User's exam rating data`,
    schemaDescription: `Result of rating user's exam files based on exam rating data and exam actual content`,
  },
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
