"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadCSV } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createTempListOfKeywords } from "@/lib/utils";
import { useKeywordStore } from "@/store/keyword";
import { FileIcon, UploadIcon } from "lucide-react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { updateKeywords } = useKeywordStore();
  const validateCSV = async (file: File): Promise<boolean> => {
    if (file.size > 4 * 1024 * 1024) {
      toast.error("File size exceeds 4MB litmit.");
      return false;
    }
    const content = await file.text();
    const lines = content.split("\n").map((line) => line.trim());

    // Check if there's at least one line (header)
    if (lines.length < 1) {
      toast.error("CSV file is empty.");
      return false;
    }

    // Check if the first cell of the first row is "keywords"
    const firstCell = lines[0].split(",")[0].trim().toLowerCase();
    if (firstCell !== "keywords") {
      toast.error('The first cell of the CSV must contain "keywords".');
      return false;
    }

    // Extract the first column from lines 2 to 101 (or end of file)
    const keywords = lines
      .slice(1, 101)
      .map((line) => line.split(",")[0].trim())
      .filter(Boolean);

    if (keywords.length < 1 || keywords.length > 100) {
      toast.error(
        `CSV must contain between 1 and 100 keywords in the first column (excluding header). Found ${keywords.length} keywords.`,
      );

      return false;
    }
    // Check if there are duplicate keywords
    const keywordSet = new Set(keywords);
    if (keywordSet.size !== keywords.length) {
      toast.error("Keywords must be unique. Duplicate keywords found.");
      return false;
    }

    setKeywords(keywords);

    return true;
  };
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      const isValid = await validateCSV(selectedFile);
      if (isValid) {
        setFile(selectedFile);
      }
    } else {
      setFile(null);
      toast.error("Please select a valid CSV file.");
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    try {
      await uploadCSV(formData).then(() => {
        updateKeywords(createTempListOfKeywords(keywords));
        setFile(null);
        setKeywords([]);
        toast.success("File uploaded and processing");
      });
    } catch (_) {
      toast.error("An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full mx-auto text-center"
    >
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
          }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex flex-col items-center space-y-2">
            <FileIcon className="size-6 text-primary" />
            <div className="text-sm font-medium">{file.name}</div>
            <div className="text-xs text-gray-500">
              {(file.size / 1024).toFixed(2)} KB • {file.type}
            </div>
            <div className="text-xs text-gray-500">
              {keywords.length} keywords found
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <UploadIcon className="size-6 text-gray-400" />
            <div className="text-sm font-medium">
              Drag & drop your CSV file here, or click to select
            </div>
            <div className="text-xs text-gray-500">Maximum file size: 4MB</div>
          </div>
        )}
      </div>

      <Button className="mx-auto" type="submit" disabled={!file || isUploading}>
        {isUploading ? "Uploading..." : "Upload CSV"}
      </Button>
    </form>
  );
}
