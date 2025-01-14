import { getKeywords } from "@/lib/actions";
import { Keyword } from "@/types/keyword";
import { create } from "zustand";

interface KeywordState {
  keywords: Keyword[];
  updateKeywords: (newKeywords: Keyword[], status?: "fetch" | "update") => void;
  fetchKeywords: (search?: string) => Promise<void>;
}

export const useKeywordStore = create<KeywordState>((set) => ({
  keywords: [],
  updateKeywords: (
    newKeywords: Keyword[],
    status: "fetch" | "update" = "update",
  ) => {
    set((state) => {
      const updatedKeywords = state.keywords.map((keyword) => {

        const newKeyword = newKeywords.find((k) => k.value === keyword.value);

        if (newKeyword) {
          if (status === "update") {
            // If status is "update", upload isLoading 
            return { ...keyword, isLoading: true };
          }

          if (status === "fetch") {
            // If status is "fetch", update whole data
            return { ...keyword, ...newKeyword, isLoading: false };
          }
        }

        return keyword;
      });
       // Filter new keywords 
      const nonDuplicateNewKeywords = newKeywords.filter(
        (newKeyword) =>
          !state.keywords.some((keyword) => keyword.value === newKeyword.value),
      );
      // Add new kewords into the list and make sure all items are unique
      const finalKeywords = [
        ...updatedKeywords,
        ...nonDuplicateNewKeywords.map((keyword) => ({
          ...keyword,
          isLoading: status === "update", 
        })),
      ];

      return { keywords: finalKeywords };
    });
  },
  fetchKeywords: async (search:string = '') => {
    try {
      const keywords = await getKeywords(search);
      set({ keywords });
    } catch (error) {
      console.error("Error fetching keywords:", error);

      throw error;
    }
  },
}));
