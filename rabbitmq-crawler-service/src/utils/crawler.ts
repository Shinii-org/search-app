import puppeteer from "puppeteer";

export async function crawlData(
  keyword: string,
): Promise<
  | { totalAds: number; totalLinks: number; html: string }
  | { keyword: string; error: string }
> {
  const browser = await puppeteer.launch({
    headless: true, //
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;
    await page.goto(searchUrl, { waitUntil: "networkidle2" });

    const data = await page.evaluate(() => {
      const totalAds: number =
        document.querySelectorAll("[data-pla-slot-pos]").length +
        document.querySelectorAll("[data-ta-slot-pos]").length;

      const totalLinks: number = document.querySelectorAll("a").length;

      return { totalAds, totalLinks, html: document.documentElement.outerHTML };
    });

    return data;
  } catch (error) {
    console.error("Crawl error:", error);
    return {
      keyword,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  } finally {
    await browser.close();
  }
}
