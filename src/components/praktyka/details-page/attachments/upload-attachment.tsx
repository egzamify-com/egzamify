"use client";

import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Upload } from "lucide-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import SpinnerLoading from "~/components/SpinnerLoading";
import { Button } from "~/components/ui/button";

export default function UploadAttachment({
  userExam,
}: {
  userExam: Doc<"usersPracticalExams">;
}) {
  const generateUploadUrl = useMutation(api.praktyka.mutate.generateUploadUrl);
  const sendAttachment = useMutation(api.praktyka.mutate.sendAttachment);

  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false); // State to track upload in progress

  // This function now exclusively handles the upload logic
  async function uploadSelectedFile(file: File) {
    if (!file) {
      console.error("No file provided for upload.");
      return;
    }

    // setIsUploading(true); // Indicate that upload has started
    console.log("Starting upload for file:", file.name);

    try {
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();
      console.log("Generated upload URL:", postUrl);

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type }, // Use the file's actual type
        body: file,
      });

      if (!result.ok) {
        console.log(result);
        throw new Error(`HTTP error! status: ${result.status}`);
      }

      const { storageId } = await result.json();
      console.log("Received storageId:", storageId);

      // Step 3: Save the newly allocated storage id to the database
      await sendAttachment({
        storageId,
        attachmentName: file.name,
        userExamId: userExam._id,
      });
    } catch (error) {
      console.error("[EXAM CHECK] Error during image upload:", error);
      toast.error("Failed to upload file!", {
        description: `File ${file.name} failed to upload.`,
      });
    }
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      console.log("files selected");
      setSelectedFiles(event.target.files);
    }
  };
  useEffect(() => {
    (async () => {
      await handleStartUpload();
      setSelectedFiles(null);
    })();
  }, [selectedFiles]);

  async function handleStartUpload() {
    console.log("[P-EXAM RATING] upload func start");
    if (!selectedFiles) {
      console.log("[P-EXAM RATING] upload func end, no files to upload");
      return;
    }
    const promises = [...selectedFiles].map((file) => {
      return uploadSelectedFile(file);
    });
    setIsUploading(true);
    console.log("exec promsies");
    await Promise.all(promises);
    setIsUploading(false);
    toast.success("Attachments uploaded successfully");
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
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
        variant={"outline"}
        type="button"
        onClick={async () => {
          if (!isUploading) {
            imageInput.current?.click();

            console.log("image input clicked");
          }
        }}
        disabled={isUploading}
      >
        {isUploading ? (
          <SpinnerLoading />
        ) : (
          <>
            <Upload />
            <p>Upload exam attachments</p>
          </>
        )}
      </Button>
    </form>
  );
}
