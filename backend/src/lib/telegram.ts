import { Telegraf, Markup } from "telegraf";
import logger from "./logger";
import prisma from "../prismaClient";
import { broadcast } from "./sse";

let bot: Telegraf | null = null;

export function initTelegramBot(): void {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    logger.warn("TELEGRAM_BOT_TOKEN не задан, бот не запущен");
    return;
  }

  bot = new Telegraf(token);

  // Обработка inline-кнопок
  bot.action(/^confirm_(\d+)$/, async (ctx) => {
    const bookingId = Number(ctx.match[1]);
    try {
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "confirmed" },
        include: { doctor: true, service: true },
      });
      broadcast("booking_updated", booking);
      await ctx.editMessageReplyMarkup(undefined);
      await ctx.reply(
        `✅ Запись #${bookingId} подтверждена\n` +
        `Пациент: ${booking.patientName}\n` +
        `Врач: ${booking.doctor.name}\n` +
        `Дата: ${booking.date.toLocaleDateString("ru-RU")} ${booking.time}`
      );
    } catch (error) {
      logger.error({ bookingId, error }, "Telegram: ошибка подтверждения");
      await ctx.reply(`❌ Ошибка при подтверждении записи #${bookingId}`);
    }
  });

  bot.action(/^reject_(\d+)$/, async (ctx) => {
    const bookingId = Number(ctx.match[1]);
    try {
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "cancelled" },
        include: { doctor: true, service: true },
      });
      broadcast("booking_updated", booking);
      await ctx.editMessageReplyMarkup(undefined);
      await ctx.reply(`❌ Запись #${bookingId} отклонена (${booking.patientName})`);
    } catch (error) {
      logger.error({ bookingId, error }, "Telegram: ошибка отклонения");
      await ctx.reply(`❌ Ошибка при отклонении записи #${bookingId}`);
    }
  });

  bot.launch().then(() => {
    logger.info("Telegram-бот запущен");
  });

  process.once("SIGINT", () => bot?.stop("SIGINT"));
  process.once("SIGTERM", () => bot?.stop("SIGTERM"));
}

export async function notifyNewBooking(booking: {
  id: number;
  patientName: string;
  phone: string;
  date: Date;
  time: string;
  comment?: string | null;
  doctor: { name: string };
  service: { name: string };
}): Promise<void> {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!bot || !chatId) return;

  const message =
    `🦷 Новая запись #${booking.id}\n\n` +
    `👤 ${booking.patientName}\n` +
    `📱 ${booking.phone}\n` +
    `👨‍⚕️ ${booking.doctor.name}\n` +
    `🔧 ${booking.service.name}\n` +
    `📅 ${booking.date.toLocaleDateString("ru-RU")} в ${booking.time}\n` +
    (booking.comment ? `💬 ${booking.comment}` : "");

  try {
    await bot.telegram.sendMessage(
      chatId,
      message,
      Markup.inlineKeyboard([
        Markup.button.callback("✅ Подтвердить", `confirm_${booking.id}`),
        Markup.button.callback("❌ Отклонить", `reject_${booking.id}`),
      ])
    );
  } catch (error) {
    logger.error({ error }, "Telegram: ошибка отправки уведомления");
  }
}
