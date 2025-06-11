"use client";

import { UploadButton } from "~/lib/upladthing";

export default function Page() {
  return (
    <div>
      <UploadButton
        appearance={{ button: { color: "black" } }}
        endpoint="profilePicUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
}
