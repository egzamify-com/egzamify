import { main } from "./practicals"
const EE09 = "kd72bqykqqyaypdnyzt1p06rm97sd6t4"
const INF04 = "kd7a5gcz2bsv72yydn8xbbqx8x7scxkg"
export type Input = {
  contentPdf: string
  ratingPdf: string
  qualificationId: string
}
export async function GET() {
  ;(async () => {
    const toDo: Input[] = [
      {
        contentPdf:
          "/Users/antoni-ostrowski/Desktop/ee9/ee09-2021-czerwiec-egzamin-zawodowy-praktyczny-zalaczniki/ee09-2021-czerwiec-egzamin-zawodowy-praktyczny.pdf",
        ratingPdf:
          "/Users/antoni-ostrowski/Desktop/ee9/ee09-2021-czerwiec-egzamin-zawodowy-praktyczny-zalaczniki/ee09-2021-czerwiec-egzamin-zawodowy-praktyczny-zasady-oceniania.pdf",
        qualificationId: EE09,
      },
      {
        contentPdf:
          "/Users/antoni-ostrowski/Desktop/ee9/ee09-2019-czerwiec-egzamin-zawodowy-praktyczny-zalaczniki/ee09-2019-czerwiec-egzamin-zawodowy-praktyczny.pdf",
        ratingPdf:
          "/Users/antoni-ostrowski/Desktop/ee9/ee09-2019-czerwiec-egzamin-zawodowy-praktyczny-zalaczniki/ee09-2019-czerwiec-egzamin-zawodowy-praktyczny-zasady-oceniania.pdf",
        qualificationId: EE09,
      },
      {
        contentPdf:
          "/Users/antoni-ostrowski/Desktop/ee9/ee09-2020-czerwiec-egzamin-zawodowy-praktyczny-zalaczniki/ee09-2020-czerwiec-egzamin-zawodowy-praktyczny.pdf",
        ratingPdf:
          "/Users/antoni-ostrowski/Desktop/ee9/ee09-2020-czerwiec-egzamin-zawodowy-praktyczny-zalaczniki/ee09-2020-czerwiec-egzamin-zawodowy-praktyczny-zasady-oceniania.pdf",
        qualificationId: EE09,
      },
      {
        contentPdf:
          "/Users/antoni-ostrowski/Desktop/ee9/ee09-2020-styczen-egzamin-zawodowy-praktyczny-zalaczniki/ee09-2020-styczen-egzamin-zawodowy-praktyczny.pdf",
        ratingPdf:
          "/Users/antoni-ostrowski/Desktop/ee9/ee09-2020-styczen-egzamin-zawodowy-praktyczny-zalaczniki/ee09-2020-styczen-egzamin-zawodowy-praktyczny-zasady-oceniania.pdf",
        qualificationId: EE09,
      },
    ]

    const promises = toDo.map((info) => {
      return main(info)
    })
    const a = await Promise.all(promises)
  })()

  return new Response("Hello, World!")
}
