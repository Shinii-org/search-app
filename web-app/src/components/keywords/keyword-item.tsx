"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Keyword } from "@/types/keyword";
import Link from "next/link";

interface KeywordItemProps {
  keyword: Keyword;
}

export default function KeywordItem({ keyword }: KeywordItemProps) {
  if (keyword.isLoading) {
    return <Skeleton className="h-6 w-20" />;
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Badge
          variant="secondary"
          className="cursor-pointer hover:bg-secondary/80"
        >
          {keyword.value}
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">{keyword.value}</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex gap-3">
              <span>Total Ads:</span>
              <b>{keyword.totalAds}</b>
            </div>
            <div className="flex gap-3">
              <span>Total Links:</span>
              <b>{keyword.totalLinks}</b>
            </div>
            <div className="flex gap-3">
              <span>URL:</span>
              <Link
                target="_blank"
                href={keyword.htmlPath}
                className="text-blue-700 truncate "
              >
                {keyword.htmlPath}
              </Link>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
