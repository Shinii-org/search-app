import { Keyword } from "@/types/keyword";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);


export const createRandomIds = (): string => {
  return Math.random().toString(36).substring(2, 12);
};
export const createTempListOfKeywords = (keywords: string[]): Keyword[] => {
  return keywords.map((keyword) => ({
    id: createRandomIds(),
    isLoading: true,
    totalLinks: 0,
    totalAds: 0,
    value: keyword,
    htmlPath: "",
  }));
};
