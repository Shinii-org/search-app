// CSV File
import {  PostKeyword } from "@/types/keyword";
import db from "./db";

export const uploadCSV = async (formData: FormData) => {
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Error during upload");
  }

  return response.json();
};

// Keywords
export const getKeywords = async (search:string = '') => {
  try {
    const response = await fetch(`/api/keywords?search=${encodeURIComponent(search)}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Cannot get keywords: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching keywords:", error);
    throw error;
  }
};

export const createOrUpdateKeyword = async (keyword: PostKeyword) => {
  const { userId, value, totalLinks, totalAds, htmlPath } = keyword;

  // Check if the keyword is associated with the user
  const existingKeyword = await db.keyword.findFirst({
    where: {
      value,
      users: {
        some: {
          id: userId, // Check if the user is associated with the keyword
        },
      },
    },
  });

  if (existingKeyword) {
    // Update the existing keyword
    const updatedKeyword = await db.keyword.update({
      where: { id: existingKeyword.id },
      data: {
        totalLinks,
        totalAds,
        htmlPath,
      },
    });

    return updatedKeyword;
  } else {
    // Create a new keyword and associate it with the user
    const newKeyword = await db.keyword.create({
      data: {
        value,
        totalLinks,
        totalAds,
        htmlPath,
        users: {
          connect: { id: userId }, // Connect the keyword to the user
        },
      },
    });

    return newKeyword;
  }
};
