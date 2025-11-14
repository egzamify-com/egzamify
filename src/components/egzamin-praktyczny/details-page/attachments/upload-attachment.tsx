"use client"

import { api } from "convex/_generated/api"
import type { UserExam } from "convex/praktyka/helpers"
import { useMutation } from "convex/react"
import { Upload } from "lucide-react"
import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useRef,
  useState,
} from "react"
import { toast } from "sonner"
import SpinnerLoading from "~/components/spinner-loading"
import { Button } from "~/components/ui/button"

export default function UploadAttachment({ userExam }: { userExam: UserExam }) {
  const generateUploadUrl = useMutation(api.praktyka.mutate.generateUploadUrl)
  const sendAttachment = useMutation(api.praktyka.mutate.sendAttachment)

  const imageInput = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [isUploading, setIsUploading] = useState(false) // State to track upload in progress
  const [isDragging, setIsDragging] = useState(false)

  // This function now exclusively handles the upload logic
  async function uploadSelectedFile(file: File) {
    if (!file) {
      console.error("No file provided for upload.")
      return
    }

    // setIsUploading(true); // Indicate that upload has started

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

      await sendAttachment({
        storageId,
        attachmentName: file.name,
        userExamId: userExam._id,
      })
    } catch (error) {
      console.error("[EXAM CHECK] Error during image upload:", error)
      toast.error("Nie udało się przesłać pliku!", {
        description: `Plik ${file.name} nie został przesłany poprawnie.`,
      })
    }
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files)
    }
  }

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault() // Prevents browser from opening a file
    setIsDragging(false)

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFiles(event.dataTransfer.files)
    }
  }

  useEffect(() => {
    if (selectedFiles) {
      ;(async () => {
        await handleStartUpload()
        setSelectedFiles(null)
      })()
    }
  }, [selectedFiles])

  async function handleStartUpload() {
    if (!selectedFiles) {
      return
    }
    const promises = [...selectedFiles].map((file) => {
      return uploadSelectedFile(file)
    })
    setIsUploading(true)
    await Promise.all(promises)
    setIsUploading(false)
  }
  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <input
        hidden
        type="file"
        multiple
        ref={imageInput}
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={isUploading}
      />
      <Button
        onDragOver={(event: DragEvent<HTMLButtonElement>) => {
          event.preventDefault()
        }}
        onDragEnter={(event: DragEvent<HTMLButtonElement>) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(event: DragEvent<HTMLButtonElement>) => {
          event.preventDefault()
          setIsDragging(false)
        }}
        onDrop={handleDrop}
        className="text-foreground hover:bg-accent w-full border-3 border-dashed bg-transparent py-8"
        type="button"
        onClick={async () => {
          if (!isUploading) {
            imageInput.current?.click()
          }
        }}
        disabled={isUploading}
      >
        {isUploading ? (
          <SpinnerLoading />
        ) : (
          <>
            <Upload />
            <p>Prześlij pliki</p>
          </>
        )}
      </Button>
    </form>
  )
}
