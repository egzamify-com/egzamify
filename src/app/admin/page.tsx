"use client"

import { api } from "convex/_generated/api"
import type { Doc, Id } from "convex/_generated/dataModel"
import { useQuery } from "convex/custom_helpers"
import { useMutation } from "convex/react"
import type { FunctionReturnType } from "convex/server"
import { parseInt } from "lodash"
import { XIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, type ChangeEvent } from "react"
import { toast } from "sonner"
import SpinnerLoading from "~/components/spinner-loading"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { env } from "~/env"

const ALLOWED_USER_IDS = [
  "m573jqef6hm00djq54z7cba8297w5wps",
  "m57e7rqtbht92q76q6zntwxrhn7w7w7n",
  "m57ffahn142v6q9y3w1305d4rh7w4069",
  "kn74ezbhg29y9y3zp9rccmbsqd7skrx5",
  "kn72g8m7ver00fh75dqehqxtms7vmxcs",
  "kn7d9wvakgyppy3m69p0hy59gd7vg7dn",
]

export default function Page() {
  const router = useRouter()
  const { data: listTodo, error } = useQuery(
    api.seed.listQAndAThatNeedImages,
    {},
  )
  const { data: user, isPending } = useQuery(api.users.query.getCurrentUser)
  if (isPending) return null
  if (!user && !isPending) {
    router.replace("/")
    return
  }
  console.log({ user })

  if (!ALLOWED_USER_IDS.includes(user._id)) {
    router.replace("/")
    return
  }

  if (error) {
    console.error(error)
    return <div>error: {error.message}</div>
  }

  return (
    <div className="flex flex-col items-center justify-start space-y-5">
      <PdfUploader />
      <div className="flex w-3/4 flex-col items-start justify-center gap-5">
        {listTodo?.questions.map((q) => {
          return <FileHandlerQuestion question={q} />
        })}
        {listTodo?.answers.map((a) => {
          return <FileHandlerAnswer answer={a} />
        })}
      </div>
    </div>
  )
}

function FileHandlerQuestion({
  question,
}: {
  question: FunctionReturnType<
    typeof api.seed.listQAndAThatNeedImages
  >["questions"][number]
}) {
  const { uploadFile } = useUploader()
  const updateQuestion = useMutation(api.seed.updateQuestion)
  const disMiss = useMutation(api.seed.disMissQuestion)
  const [isPending, setIsPending] = useState(false)

  async function startAction(file: File) {
    setIsPending(true)
    if (!file) {
      console.error("No file provided for upload.")
      toast.error("provide file")
      setIsPending(false)
      return
    }

    try {
      const fileId = await uploadFile(file)

      if (!fileId) {
        setIsPending(false)
        throw new Error("Failed to upload")
      }

      try {
        await updateQuestion({ questionId: question._id, attachmentId: fileId })
      } catch (e) {
        console.error("Failed to edit question")
        toast.error("Failed to edit question")
      }

      setIsPending(false)
    } catch (e) {
      console.error("Failed to do something")
      toast.error("Failed to do something")
      setIsPending(false)
      return
    }
  }

  // @ts-ignore jfkdsl
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault() // Required to indicate this is a valid drop target
  }

  // @ts-ignore jfkdsl
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      await startAction(droppedFiles[0])
    }
  }
  return (
    <Card
      className="w-full border-white"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardHeader>
        <CardTitle className="flex flex-col gap-2">
          <Button
            variant={"outline"}
            className="w-1/4"
            onClick={async () => {
              await disMiss({ questionId: question._id })
            }}
          >
            <XIcon fill="red" color="red" />
          </Button>
          <h1 className="text-2xl text-yellow-500">Pytanie</h1>
          <h1>{question.content}</h1>
          <h1 className="text-muted-foreground">
            {question.qualification.nameLabelCombined}
          </h1>
          <h1 className="text-muted-foreground">{question.year}</h1>
          <h1 className="text-muted-foreground">{question.month}</h1>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row justify-start gap-10">
        <input
          type="file"
          multiple
          onChange={async (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files?.[0]) {
              await startAction(e.target.files[0])
            }
          }}
        />

        {isPending && <SpinnerLoading />}
      </CardContent>
    </Card>
  )
}

function FileHandlerAnswer({ answer }: { answer: Doc<"answers"> }) {
  const questionQuery = useQuery(api.seed.getQuestionForAnswer, {
    questionId: answer.questionId,
  })
  const disMiss = useMutation(api.seed.disMissAnswer)
  const { uploadFile } = useUploader()
  const updateAnswer = useMutation(api.seed.updateAnswer)
  const [isPending, setIsPending] = useState(false)

  async function startAction(file: File) {
    setIsPending(true)
    if (!file) {
      console.error("No file provided for upload.")
      toast.error("provide file")
      setIsPending(false)
      return
    }

    try {
      const fileId = await uploadFile(file)

      if (!fileId) {
        setIsPending(false)
        throw new Error("Failed to upload")
      }

      try {
        await updateAnswer({ answerId: answer._id, attachmentId: fileId })
      } catch (e) {
        console.error("Failed to edit answer")
        toast.error("Failed to edit answer")
      }

      setIsPending(false)
    } catch (e) {
      console.error("Failed to do something")
      toast.error("Failed to do something")
      setIsPending(false)
      return
    }
  }

  // @ts-ignore jfkdsl
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault() // Required to indicate this is a valid drop target
  }

  // @ts-ignore jfkdsl
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      await startAction(droppedFiles[0])
    }
  }
  return (
    <Card
      className="w-full border-white"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardHeader>
        <CardTitle className="flex flex-col gap-2">
          <Button
            variant={"outline"}
            className="w-1/4"
            onClick={async () => {
              await disMiss({ answerId: answer._id })
            }}
          >
            <XIcon fill="red" color="red" />
          </Button>
          <h1 className="text-2xl text-yellow-200">Odpowiedz</h1>
          <h1>{answer.content}</h1>
          <p>{answer._id}</p>
          <p>{answer.label}</p>
          <p>{answer.isCorrect && "correct"}</p>
          <h1>{questionQuery.data?.question.content}</h1>
          <h1 className="text-muted-foreground">
            {questionQuery.data?.qualification.nameLabelCombined}
          </h1>
          <h1 className="text-muted-foreground">
            {questionQuery.data?.question.year}
          </h1>
          <h1 className="text-muted-foreground">
            {questionQuery.data?.question.month}
          </h1>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row justify-start gap-10">
        <input
          type="file"
          multiple
          onChange={async (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files?.[0]) {
              await startAction(e.target.files[0])
            }
          }}
        />

        {isPending && <SpinnerLoading />}
      </CardContent>
    </Card>
  )
}

function PdfUploader() {
  const qualificationsQuery = useQuery(api.teoria.query.getQualificationsList, {
    search: "",
  })
  console.log({ qualificationsQuery })
  const { uploadFile } = useUploader()
  const [qualificationId, setQualificationId] = useState("")
  const [year, setYear] = useState(0)
  const [month, setMonth] = useState("")
  const [selectedContentPdf, setSelectedContentPdf] = useState<File | null>(
    null,
  )
  const [adminKey, setAdminKey] = useState("")
  const [selectedRatingPdf, setSelectedRatingPdf] = useState<File | null>(null)

  async function startAction() {
    if (!selectedContentPdf || !selectedRatingPdf) {
      console.error("No file provided for upload.")
      toast.error("provide both files")
      return
    }
    if (!year || !month || !qualificationId) {
      console.error("missing metadata")
      toast.error("missing metadata")
      return
    }

    try {
      const contentId = await uploadFile(selectedContentPdf)
      const ratingId = await uploadFile(selectedRatingPdf)

      if (!contentId || !ratingId) {
        throw new Error("Failed to upload")
      }

      const data = new FormData()
      data.set("contentPdf", contentId)
      data.set("ratingPdf", ratingId)
      data.set("qualificationId", qualificationId)
      data.set("year", year.toString())
      data.set("month", month)

      toast.info("sending req")
      const uploadRequest = await fetch(
        `${env.NEXT_PUBLIC_BASE_SERVER_URL}/api/seed-db/seed-teoria`,
        {
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${adminKey}`,
          },
        },
      )
    } catch (e) {
      console.error("Failed to upload some pdf")
      return
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-start">
      <div className="flex w-1/3 flex-col gap-2">
        <Label>qualification id</Label>

        <Select
          onValueChange={(value) => setQualificationId(value)}
          value={qualificationId}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="qualification" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {qualificationsQuery.data?.qualifications.map((q) => {
                return (
                  <SelectItem value={q.qualification._id}>
                    {q.qualification.name}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* <Input */}
        {/*   onChange={(e) => setQualificationId(e.target.value)} */}
        {/*   value={qualificationId} */}
        {/* /> */}
      </div>

      <div className="flex w-1/3 flex-col gap-2">
        <Label>year</Label>
        <Select
          onValueChange={(value) => setYear(parseInt(value))}
          value={year.toString()}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="year" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2020">2020</SelectItem>
              <SelectItem value="2019">2019</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* <Input */}
        {/*   type="number" */}
        {/*   onChange={(e) => setYear(parseInt(e.target.value))} */}
        {/*   value={year} */}
        {/* /> */}
      </div>

      <div className="flex w-1/3 flex-col gap-2">
        <Label>month</Label>

        <Select onValueChange={(value) => setMonth(value)} value={month}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="month" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Czerwiec">Czerwiec</SelectItem>
              <SelectItem value="Styczeń">Styczeń</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* <Input onChange={(e) => setMonth(e.target.value)} value={month} /> */}
      </div>

      <div className="flex w-1/3 flex-col gap-2">
        <Label>admin key</Label>
        <Input onChange={(e) => setAdminKey(e.target.value)} value={adminKey} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          content pdf
          <input
            type="file"
            multiple
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files?.[0]) {
                setSelectedContentPdf(e.target.files[0])
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          rating pdf
          <input
            type="file"
            multiple
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files?.[0]) {
                setSelectedRatingPdf(e.target.files[0])
              }
            }}
          />
        </div>
      </div>
      <Button onClick={() => startAction()}>upload </Button>
    </div>
  )
}
function useUploader() {
  const generateUploadUrl = useMutation(api.praktyka.mutate.generateUploadUrl)

  async function uploadFile(file: File) {
    try {
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl()

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type }, // Use the file's actual type
        body: file,
      })

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`)
      }

      const { storageId } = await result.json()
      return storageId as Id<"_storage">
    } catch (error) {
      console.error("Error during image upload:", error)
      toast.error("Nie udało się przesłać pliku!", {
        description: `Plik ${file.name} nie został przesłany poprawnie.`,
      })
    }
  }
  return {
    uploadFile,
  }
}
