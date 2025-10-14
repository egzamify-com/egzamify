import { main } from "./practicals"
const EE09 = "kd72bqykqqyaypdnyzt1p06rm97sd6t4"
const INF04 = "kd7a5gcz2bsv72yydn8xbbqx8x7scxkg"
export type Input = {
  contentPdf: string
  ratingPdf: string
  qualificationId: string
  attachments: {
    attachmentName: string
    attachmentId: string
    attachmentType: string
    attachmentPath: string
  }[]
}
export async function GET() {
  ;(async () => {
    const toDo: Input[] = [
      {
        contentPdf:
          "/Users/antoni-ostrowski/Desktop/ee9/ee09-2025-styczen-egzamin-zawodowy-praktyczny.pdf",
        ratingPdf:
          "/Users/antoni-ostrowski/Desktop/ee9/ee09-2025-styczen-egzamin-zawodowy-praktyczny-zasady-oceniania.pdf",
        qualificationId: EE09,
        attachments: [
          {
            attachmentName: "egzamin.sql",
            attachmentId: "",
            attachmentType: "text/plain",
            attachmentPath:
              "/Users/antoni-ostrowski/Desktop/ee9/ee09-2025-styczen-egzamin-zawodowy-praktyczny-zalaczniki/dane/egzamin.sql",
          },
          {
            attachmentName: "zad1.png",
            attachmentId: "",
            attachmentType: "image/png",
            attachmentPath:
              "/Users/antoni-ostrowski/Desktop/ee9/ee09-2025-styczen-egzamin-zawodowy-praktyczny-zalaczniki/dane/zad1.png",
          },

          {
            attachmentName: "obraz1.jpg",
            attachmentId: "",
            attachmentType: "image/jpg",
            attachmentPath:
              "/Users/antoni-ostrowski/Desktop/ee9/ee09-2025-styczen-egzamin-zawodowy-praktyczny-zalaczniki/dane/obraz1.jpg",
          },
        ],
      },
      // {
      //   contentPdf:
      //     "/Users/antoni-ostrowski/Desktop/ee9/ee09-2024-czerwiec-egzamin-zawodowy-praktyczny.pdf",
      //   ratingPdf:
      //     "/Users/antoni-ostrowski/Desktop/ee9/ee09-2024-czerwiec-egzamin-zawodowy-praktyczny-zasady-oceniania.pdf",
      //   qualificationId: EE09,
      // },
      // {
      //   contentPdf:
      //     "/Users/antoni-ostrowski/Desktop/ee9/ee09-2024-styczen-egzamin-zawodowy-praktyczny.pdf",
      //   ratingPdf:
      //     "/Users/antoni-ostrowski/Desktop/ee9/ee09-2024-styczen-egzamin-zawodowy-praktyczny-zasady-oceniania.pdf",
      //   qualificationId: EE09,
      // },
    ]

    const promises = toDo.map((info) => {
      return main(info)
    })
    const a = await Promise.all(promises)
  })()

  return new Response("Hello, World!")
}
