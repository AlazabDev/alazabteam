import {
  getSessionCookieName,
  getSessionCookieOptions,
} from "./_core/cookies";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { FoundryAgentError, invokeFoundryAgent } from "./foundry";
import { getEntraAccessToken } from "./_core/entra";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(getSessionCookieName(ctx.req), {
        ...cookieOptions,
        maxAge: -1,
      });
      return {
        success: true,
      } as const;
    }),
  }),

  foundry: router({
    chat: publicProcedure
      .input(z.object({ message: z.string().trim().min(1).max(4000), conversationId: z.string().trim().max(200).optional() }))
      .mutation(async ({ input, ctx }) => {
        const userToken = getEntraAccessToken(ctx.req);
        if (!userToken) throw new TRPCError({ code: "UNAUTHORIZED", message: "اربط حساب Microsoft Entra أولًا لتفعيل وكيل العزب." });
        try {
          return await invokeFoundryAgent(input.message, { conversationId: input.conversationId, userToken });
        } catch (error) {
          if (error instanceof FoundryAgentError) {
            throw new TRPCError({ code: error.status === 401 ? "UNAUTHORIZED" : "BAD_GATEWAY", message: error.message });
          }
          throw new TRPCError({ code: "BAD_GATEWAY", message: "تعذر الاتصال بوكيل العزب حاليًا." });
        }
      }),
    summarizeNotification: publicProcedure
      .input(z.object({ title: z.string().trim().min(1).max(300), body: z.string().trim().min(1).max(4000), project: z.string().trim().min(1).max(300), priority: z.string().trim().min(1).max(50) }))
      .mutation(async ({ input, ctx }) => {
        const prompt = [
          "حلّل الإشعار التالي لصالح فريق شركة العزب للمقاولات.",
          "أعد إجابة عربية قصيرة ومنظمة في ثلاثة أسطر معنونة: ملخص، الأولوية المقترحة (عاجل أو مهم أو عادي)، مسودة رد.",
          `المشروع: ${input.project}`,
          `الأولوية الحالية: ${input.priority}`,
          `العنوان: ${input.title}`,
          `المحتوى: ${input.body}`,
        ].join("\n");
        const userToken = getEntraAccessToken(ctx.req);
        if (!userToken) throw new TRPCError({ code: "UNAUTHORIZED", message: "اربط حساب Microsoft Entra أولًا لتحليل الإشعار." });
        try {
          return await invokeFoundryAgent(prompt, { userToken });
        } catch (error) {
          if (error instanceof FoundryAgentError) {
            throw new TRPCError({ code: error.status === 401 ? "UNAUTHORIZED" : "BAD_GATEWAY", message: error.message });
          }
          throw new TRPCError({ code: "BAD_GATEWAY", message: "تعذر تحليل الإشعار عبر وكيل العزب حاليًا." });
        }
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
