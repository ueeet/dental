import axios from "axios";
import prisma from "../prismaClient";
import logger from "./logger";

const DGIS_API_KEY = process.env.DGIS_API_KEY;
const DGIS_FIRM_ID = process.env.DGIS_FIRM_ID;

// Парсинг отзывов с 2GIS через API
async function fetch2GISReviews(): Promise<void> {
  if (!DGIS_API_KEY || !DGIS_FIRM_ID) {
    logger.debug("2GIS ключи не заданы, пропускаю");
    return;
  }

  try {
    const response = await axios.get(
      `https://catalog.api.2gis.com/3.0/items/${DGIS_FIRM_ID}/reviews`, {
        params: { key: DGIS_API_KEY, page_size: 50, sort_by: "date_created" },
      }
    );

    const reviews = response.data?.reviews || [];

    for (const review of reviews) {
      const sourceId = `2gis_${review.id}`;

      const exists = await prisma.review.findUnique({ where: { sourceId } });
      if (exists) continue;

      await prisma.review.create({
        data: {
          authorName: review.user?.name || "Аноним",
          text: review.text || "",
          rating: review.rating || 5,
          source: "2gis",
          sourceId,
          isApproved: true,
          isVisible: true,
          createdAt: new Date(review.date_created || Date.now()),
        },
      });

      logger.info({ sourceId }, "Новый отзыв с 2GIS");
    }
  } catch (error) {
    logger.error({ error }, "Ошибка парсинга 2GIS");
  }
}

// Парсинг отзывов с Яндекс.Карт (через неофициальный API)
async function fetchYandexReviews(): Promise<void> {
  const yandexOrgId = process.env.YANDEX_ORG_ID;
  if (!yandexOrgId) {
    logger.debug("YANDEX_ORG_ID не задан, пропускаю");
    return;
  }

  try {
    const response = await axios.get(
      `https://yandex.ru/maps/api/business/fetchReviews`, {
        params: { business_oid: yandexOrgId, page_size: 50 },
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/json",
        },
      }
    );

    const reviews = response.data?.data?.reviews || [];

    for (const review of reviews) {
      const sourceId = `yandex_${review.reviewId}`;

      const exists = await prisma.review.findUnique({ where: { sourceId } });
      if (exists) continue;

      await prisma.review.create({
        data: {
          authorName: review.author?.name || "Аноним",
          text: review.text || "",
          rating: review.rating || 5,
          source: "yandex",
          sourceId,
          isApproved: true,
          isVisible: true,
          createdAt: new Date(review.updatedTime || Date.now()),
        },
      });

      logger.info({ sourceId }, "Новый отзыв с Яндекс.Карт");
    }
  } catch (error) {
    logger.error({ error }, "Ошибка парсинга Яндекс.Карт");
  }
}

export async function syncAllReviews(): Promise<void> {
  logger.info("Начинаю синхронизацию отзывов...");
  await Promise.allSettled([fetch2GISReviews(), fetchYandexReviews()]);
  logger.info("Синхронизация отзывов завершена");
}
