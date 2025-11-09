import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
// @ts-ignore
import { admins, gameResults, contactSubmissions } from "../shared/schema.ts";
import { eq, and, desc } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(connectionString);
export const db = drizzle(sql);

export const storage = {
  // Admin methods
  async getAdminByUsername(username) {
    const result = await db.select().from(admins).where(eq(admins.username, username)).limit(1);
    return result[0];
  },

  async createAdmin(admin) {
    const result = await db.insert(admins).values(admin).returning();
    return result[0];
  },

  async updateAdminPassword(username, hashedPassword) {
    const result = await db
      .update(admins)
      .set({ password: hashedPassword })
      .where(eq(admins.username, username))
      .returning();
    return result[0];
  },

  async setResetToken(username, token, expiry) {
    const result = await db
      .update(admins)
      .set({ resetToken: token, resetTokenExpiry: expiry })
      .where(eq(admins.username, username))
      .returning();
    return result[0];
  },

  async getAdminByResetToken(token) {
    const result = await db
      .select()
      .from(admins)
      .where(eq(admins.resetToken, token))
      .limit(1);
    return result[0];
  },

  async clearResetToken(username) {
    const result = await db
      .update(admins)
      .set({ resetToken: null, resetTokenExpiry: null })
      .where(eq(admins.username, username))
      .returning();
    return result[0];
  },

  // Game Results methods
  async createGameResult(result) {
    const newResult = await db.insert(gameResults).values(result).returning();
    return newResult[0];
  },

  async updateGameResult(id, updates) {
    const result = await db
      .update(gameResults)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(gameResults.id, id))
      .returning();
    return result[0];
  },

  async deleteGameResult(id) {
    await db.delete(gameResults).where(eq(gameResults.id, id));
  },

  async getResultsByDate(date) {
    const results = await db
      .select()
      .from(gameResults)
      .where(eq(gameResults.date, date))
      .orderBy(gameResults.createdAt);
    return results;
  },

  async getAllResults(limit = 30) {
    const results = await db
      .select()
      .from(gameResults)
      .orderBy(desc(gameResults.createdAt))
      .limit(limit);
    return results;
  },

  async getTodayResults() {
    const today = new Date().toLocaleDateString('en-GB');
    return this.getResultsByDate(today);
  },

  // Contact Submissions methods
  async createContactSubmission(submission) {
    const result = await db.insert(contactSubmissions).values(submission).returning();
    return result[0];
  },

  async getAllContactSubmissions() {
    const results = await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));
    return results;
  },
};
