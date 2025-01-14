import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";
import { auth } from "@/auth";
import csvParser from "csv-parser";

export const config = {
  api: { bodyParser: false },
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorize" }, { status: 401 });
  }

  const formData = await request.formData();

  // Get the file from FormData
  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file instanceof File) {
    // Convert the file into a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Define upload directory
    const uploadDir = path.join(process.cwd(), "uploads/tmp");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Define file path
    const filePath = path.join(uploadDir, file.name);

    // Write the file to the local directory
    const writeFilePromise = new Promise((resolve, reject) => {
      fs.writeFile(filePath, buffer, (err) => {
        if (err) reject(err);
        else resolve(filePath);
      });
    });

    // Read data from the buffer
    const readKeywordsPromise = new Promise((resolve, reject) => {
      const keywords: string[] = [];
      const readStream = fs.createReadStream(filePath).pipe(csvParser());

      let rowIndex = 0;
      readStream
        .on("data", (row) => {
          rowIndex++;
          if (rowIndex >= 1 && rowIndex <= 101) {
            const value = Object.values(row)[0];
            if (typeof value === "string") {
              const keyword = value.trim();
              if (keyword) keywords.push(keyword);
            }
          }
        })
        .on("end", () => resolve(keywords))
        .on("error", (err) => reject(err));
    });
    try {
      const [fileResult, keywords] = await Promise.all([
        writeFilePromise,
        readKeywordsPromise,
      ]);

      // Send data to the crawling service
      const serviceResponse = await fetch("http://localhost:3001/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          keywords,
        }),
      });
      if (!serviceResponse.ok) {
        throw new Error("Failed to send data to the service");
      }

      return NextResponse.json({
        message: "File is uploaded and processing",
        filePath: fileResult,
      });
    } catch (error) {
      console.error("Error processing file:", error);
      return NextResponse.json(
        { error: "Failed to process file" },
        { status: 500 },
      );
    }
  }
  return NextResponse.json(
    { error: "Failed to process file" },
    { status: 500 },
  );
}
