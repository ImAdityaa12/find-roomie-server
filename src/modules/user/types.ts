import { userPreferences } from "@/db/schema";

export type NewUserPreferences = typeof userPreferences.$inferInsert;
