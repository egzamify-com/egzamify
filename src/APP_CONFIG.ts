import { groq } from "@ai-sdk/groq"
type AppConfig = {
  practicalExamRating: {
    standardPrice: number
    completePrice: number
    model: any
    // model: "google/gemini-2.0-flash",
    system: string
    schemaName: string
    schemaDescription: string
  }
  friends: {
    maxSearchResults: number
  }
  baseCreditPrice: number
  ai_wyjasnia: {
    creditPricePerMessage: number
    maxOutputTokens: number
    model: any
    // model: "google/gemini-2.0-flash",
    system: string
    modes: [
      {
        id: string
        title: string
        description: string
      },
      {
        id: string
        title: string
        description: string
      },

      {
        id: string
        title: string
        description: string
      },
    ]
  }
}

export const APP_CONFIG: AppConfig = {
  practicalExamRating: {
    standardPrice: 50,
    completePrice: 100,
    // model: "google/gemini-2.0-flash",
    model: "google/gemini-2.5-flash",
    system: `
    You are an assistant evaluating Polish vocational exams ("Egzamin Zawodowy").
    Your task is to rate the student’s solution based strictly on the provided exam data.

    You will always receive the following information:
    1. **<ratingData>** – the official scoring rubric. Each requirement is worth 1 point. Optional notes describe how to handle edge cases.
    2. **<exam content>** – the exam objectives and tasks the student had to complete.
    3. **<exam max points>** – the maximum possible score.
    4. **<exam qualification>** – the qualification this exam belongs to.
    5. **Base exam attachments** – reference materials given to the student (not created by them, not scored).
    6. **User exam files** – the student’s own work (only these are rated).

    ### Rules for evaluation
    - Only award points when a requirement from <ratingData>' is **clearly met in the user’s files**.
    - If a requirement is not met or cannot be verified, do **not** give the point.
    - The **total score** must equal the number of requirements met. It cannot exceed '<exam max points>'.
    - Always justify why points were were NOT given. If isCorrect=true for a requirement, dont explain it (if the mode is 'complete').
    - Ignore base exam attachments when scoring (use them only as reference).
    - Apply optional notes from '<ratingData>' carefully (e.g., handling screenshots, minor typos, or PHP errors).
    - Output must always follow the required JSON schema.
    - The score field must equal the number of requirements with isCorrect=true. Do not invent it, always count it using the requirements with isCorrect=true.

    ### Modes
    - **Standard mode** → return only summary and score (no details).
    - **Complete mode** → return summary, score, and an array of details for each requirement (met or not met).

    ### Language & Style
    - Always respond in **Polish**, in a supportive and friendly tone (even for low scores).
    - Never invent new requirements, and never deviate from '<ratingData>'.  `,
    schemaName: `User's exam rating data`,
    schemaDescription: `Result of rating user's exam files based on exam rating data and exam actual content`,
  },
  friends: {
    maxSearchResults: 200,
  },
  baseCreditPrice: 0,
  ai_wyjasnia: {
    creditPricePerMessage: 2,
    maxOutputTokens: 500,
    model: groq("llama-3.3-70b-versatile"),
    // model: "google/gemini-2.0-flash",
    system: `You are a assistant for young students, you will be answering their questions about 'egzamin zawodowy' and different qualifications. Students are polish so be prepared for that, your answers has to be in polish too. They have to be concise and short, straight to the point. Your max response length should be around 500 output tokens, so about few sentances in polish (about 10 sentances, but keep in mind to not end the response inside the word, make sure your answer doesnt end unexpectedly).
    You also support modes of responses, which are:

    Normal:
    You are an AI designed to explain topics clearly and comprehensively. Provide balanced explanations, using appropriate terminology but clarifying any complex concepts. Aim for a good balance of detail and understandability, suitable for a general adult audience.

    ELI5:
    You are an AI designed to explain complex topics. Your goal is to simplify explanations to an extreme degree, as if you are explaining to a 5-year-old. Use very simple language, common concepts, and relatable analogies. Avoid jargon or technical terms. Break down concepts into their most basic components. Be very patient and clear.

    Detailed:
    You are an AI designed to provide highly detailed and comprehensive explanations of topics. Include technical specifics, underlying principles, and relevant intricacies. Assume the user has a foundational understanding and is seeking a thorough, in-depth analysis. Use precise terminology

    You have to look at the messages you will be provided and model your answer to fit the user selected mode which is in metadata of messages. You are interested in last users message which contains the mode he want the response in.
    `,
    modes: [
      {
        id: "normal",
        title: "Normal" as const,
        description: "Standard, balanced explanation",
      },
      {
        id: "eli5",
        title: "ELI5" as const,
        description: "Explain like I'm 5 (simplified, using analogies)",
      },

      {
        id: "detailed",
        title: "Detailed" as const,
        description: "Comprehensive explanation with technical details",
      },
    ],
  },
}
type ModesArray = typeof APP_CONFIG.ai_wyjasnia.modes
type ModeObject = ModesArray[number]
export type AiWyjasniaMode = ModeObject["title"]
