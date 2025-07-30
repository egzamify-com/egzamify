"use client";

import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Upload } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { Button } from "~/components/ui/button";

export default function UploadAttachment({
  userExam,
}: {
  userExam: Doc<"usersPracticalExams">;
}) {
  const generateUploadUrl = useMutation(api.praktyka.mutate.generateUploadUrl);
  const sendAttachment = useMutation(api.praktyka.mutate.sendAttachment);

  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false); // State to track upload in progress

  const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));

  // This function now exclusively handles the upload logic
  async function uploadSelectedImage(file: File) {
    if (!file) {
      console.log("No file provided for upload.");
      return;
    }

    setIsUploading(true); // Indicate that upload has started
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
      console.log("Storage ID saved to database.");
    } catch (error) {
      console.error("Error during image upload:", error);
      alert(`Failed to upload image "${file.name}". Please try again.`); // User feedback
    } finally {
      setSelectedFile(null); // Clear the selected image state
      if (imageInput.current) {
        imageInput.current.value = ""; // Clear the file input element's value
      }
      setIsUploading(false); // Indicate that upload has finished
      console.log("Upload process finished.");
    }
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
      setSelectedFile(file);
      await uploadSelectedImage(file);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        hidden
        type="file"
        accept="image/*"
        ref={imageInput}
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={isUploading}
      />
      <Button
        variant={"outline"}
        type="button"
        onClick={() => {
          if (!isUploading) {
            imageInput.current?.click();
          }
        }}
        disabled={isUploading}
      >
        <Upload />
        {isUploading ? "Uploading..." : "Upload exam attachment"}
      </Button>
    </form>
  );
}
