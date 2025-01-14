"use client";
import { Keyword } from "@/types/keyword";
import KeywordItem from "./keyword-item";
import { useKeywordStore } from "@/store/keyword";
import { useEffect, useCallback } from "react";
import { getSocket } from "@/lib/socket";
import { SOCKET_IO_EVENTS } from "@/constants";
import { redirect } from "next/navigation";
import { Search } from "./seach";
export default function KeywordsWrapper({ session }: any) {
  const { updateKeywords, fetchKeywords, keywords } = useKeywordStore();
  const handleSearch = useCallback(
    async (value: string) => {
      fetchKeywords(value);
    },
    [fetchKeywords],
  );
  useEffect(() => {
    fetchKeywords();
    const socket = getSocket();
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });
    socket.on(
      SOCKET_IO_EVENTS.UPDATE_KEYWORD,
      (keyword: Keyword & { userId: string }) => {
        if (!session || !session.user) redirect("/sign-in");
        if (session.user.id === keyword.userId) {
          const { userId, isLoading, ...rest } = keyword;
          updateKeywords([rest], "fetch");
        }
      },
    );

    return () => {
      socket.off(SOCKET_IO_EVENTS.UPDATE_KEYWORD);
    };
  }, [fetchKeywords, session, updateKeywords ]);

  return (
    <div>
      <Search
        onSearch={handleSearch}
        placeholder="Search keywords"
        className="w-[300px] my-4 "
      />
      <div className="flex flex-wrap gap-2 ">
        {keywords.map((keyword) => (
          <KeywordItem key={keyword.id} keyword={keyword} />
        ))}
      </div>
    </div>
  );
}
