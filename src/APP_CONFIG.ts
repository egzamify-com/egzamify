type AppConfig = {
  phEvents: {
    online: {
      PvpQuizCreated: {
        name: "PvpQuizCreated"
      }
      PvpQuizCompleted: {
        name: "PvpQuizCompleted"
        questionCount: number
        qualificationName: string
      }
    }
    aiChat: {
      aiChatMessage: {
        name: "aiChatMessage"
        type: string
      }
    }
    practicalExam: {
      pracitcalExamCheck: {
        checkCompleted: {
          name: "checkCompleted"
          type: "standard" | "complete"
        }
      }
    }
  }
  questionExplanation: {
    maxOutputTokens: number
    price: number
    system: string
    model: string
  }
  onlinePvpQuiz: {
    defaultQuestionCount: number
    questionCountOptions: number[]
  }
  defaultFullScreenErrorMessage: string
  feedback: {
    maxFeedbacksSentPerHour: number
  }
  navbarDisplay: {
    blockNavbarSitesArr: string[]
  }
  landingPage: {
    mainTitle: string
    mainDescription: string
  }
  practicalExamRating: {
    standardPrice: number
    completePrice: number
    model: string
    system: string
    schemaName: string
    schemaDescription: string
  }
  friends: {
    friendsPerPage: number
  }
  baseCreditPrice: number
  ai_wyjasnia: {
    maxMessagesPerChat: number
    maxUserMessageCharacters: number
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
  phEvents: {
    online: {
      PvpQuizCreated: {
        name: "PvpQuizCreated",
      },
      PvpQuizCompleted: {
        name: "PvpQuizCompleted",
        qualificationName: "",
        questionCount: 0,
      },
    },
    aiChat: {
      aiChatMessage: {
        name: "aiChatMessage",
        type: "normal",
      },
    },
    practicalExam: {
      pracitcalExamCheck: {
        checkCompleted: {
          name: "checkCompleted",
          type: "standard",
        },
      },
    },
  },
  questionExplanation: {
    maxOutputTokens: 1000,
    model: "google/gemini-2.5-flash",
    price: 0.5,
    system: `Jesteś ekspertem edukacyjnym specjalizującym się w wyjaśnianiu pytań egzaminacyjnych (polski egzamin zawodowy).
             Twoim zadaniem jest wygenerowanie jasnego, zwięzłego wyjaśnienia dla podanego pytania egzaminacyjnego.
             Nie witaj się z użytkownikiem, od razu przejdź do wyjaśnienia, twoja odpowiedź ma zawierać tylko wyjaśnienie.
             Potrzebne ci dane, czyli treść pytania i odpowiedzi do niego zostana ci podane przez użytkownika.
             Każda odpowiedz bedzie miala dopisek 'Poprawna', jestli jest ona poprawna. Twoim zadaniem nie jest decyzja która
             odpowiedz jest poprawna, tylko wyjaśnienie dlaczego zaznaczona Poprawna odpowiedź jest faktycznie poprawna.

             Wyjaśnienie powinno:
             1. Wyjaśnić dlaczego poprawna odpowiedź jest poprawna
             2. Krótko wyjaśnić dlaczego inne odpowiedzi są niepoprawne (jeśli to pomocne)
             3. Podać dodatkowy kontekst lub informacje pomocne w zrozumieniu tematu
             4. Być napisane w języku polskim, milym i pomocnym tonem.
             5. Być krótkie i zwięzłe.
             `,
  },
  onlinePvpQuiz: {
    defaultQuestionCount: 5,
    questionCountOptions: [5, 10, 15, 20, 40],
  },
  defaultFullScreenErrorMessage: "Przepraszamy, coś poszło nie tak.",
  feedback: {
    maxFeedbacksSentPerHour: 8,
  },
  navbarDisplay: {
    blockNavbarSitesArr: ["welcome", "sign-in", "dashboard"],
  },
  landingPage: {
    mainTitle: "Szybkie i przyjemne przygotowania do egzaminów zawodowych",
    mainDescription: `Zapomnij o żmudnym kuciu! Z nami nauka staje się angażującą przygodą,
    a wsparcie AI zagwarantuje, że na egzamin pójdziesz z uśmiechem i pełnym
    przygotowaniem.`,
  },
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
    friendsPerPage: 50,
  },
  baseCreditPrice: 0,
  ai_wyjasnia: {
    maxMessagesPerChat: 100,
    maxUserMessageCharacters: 600,
    creditPricePerMessage: 2,
    maxOutputTokens: 500,
    // model: groq("llama-3.3-70b-versatile"),
    model: "google/gemini-2.0-flash",
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
        title: "Normalny" as const,
        description: "Domyślna, zbalansowana odpowiedź",
      },
      {
        id: "eli5",
        title: "ELI5" as const,
        description: "Wyjaśnienie jak dla 5 latka (uproszczone)",
      },

      {
        id: "detailed",
        title: "Szczegółowy" as const,
        description: "Wyczerpujące, techniczne wyjaśnienie",
      },
    ],
  },
}
