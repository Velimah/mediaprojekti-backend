import puppeteer from "puppeteer";

const generateImageFromHTML = async (htmlCode: string): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 800, height: 400 });

  await page.setContent(htmlCode);

  const screenshot = await page.screenshot({
    type: "jpeg",
    fullPage: false,
    quality: 50,
  });

  await browser.close();

  return screenshot;
};

export { generateImageFromHTML };
