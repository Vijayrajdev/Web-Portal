import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  source: text("source"),
  text: text("text").notNull(),
  options: text("options").array().notNull(),
  correctAnswer: integer("correct_answer").notNull(), // 0-based index
  rationale: text("rationale"),
});

export const attempts = pgTable("attempts", {
  id: serial("id").primaryKey(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  correctCount: integer("correct_count").notNull(),
  wrongCount: integer("wrong_count").notNull(),
  timeSpentSeconds: integer("time_spent_seconds").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

// === SCHEMAS ===
export const insertQuestionSchema = createInsertSchema(questions).omit({ id: true });
export const insertAttemptSchema = createInsertSchema(attempts).omit({ id: true, completedAt: true });

// === EXPLICIT API TYPES ===
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

export type Attempt = typeof attempts.$inferSelect;
export type InsertAttempt = z.infer<typeof insertAttemptSchema>;

export type CreateAttemptRequest = InsertAttempt;
export type AttemptResponse = Attempt;
