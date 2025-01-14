// For handle UI display logic
export type Keyword = {
  id: string;
  isLoading?: boolean;
  totalLinks: number;
  totalAds: number;
  value: string;
  htmlPath: string;
};

// For post keyword which received from crawl service
export type PostKeyword = Omit<Keyword, "isLoading" | "id"> & {
  userId: string;
};
