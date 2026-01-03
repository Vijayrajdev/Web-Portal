import { db } from "./db";
import { questions, attempts, type Question, type InsertQuestion, type Attempt, type InsertAttempt } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getQuestions(): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  createAttempt(attempt: InsertAttempt): Promise<Attempt>;
  getAttempts(): Promise<Attempt[]>;
}

export class DatabaseStorage implements IStorage {
  async getQuestions(): Promise<Question[]> {
    return await db.select().from(questions).orderBy(questions.id);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [question] = await db.insert(questions).values(insertQuestion).returning();
    return question;
  }

  async createAttempt(insertAttempt: InsertAttempt): Promise<Attempt> {
    const [attempt] = await db.insert(attempts).values(insertAttempt).returning();
    return attempt;
  }

  async getAttempts(): Promise<Attempt[]> {
    return await db.select().from(attempts).orderBy(desc(attempts.completedAt));
  }
}

export const storage = new DatabaseStorage();
