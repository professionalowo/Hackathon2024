import {
  sqliteTable,
  text,
  integer,
  foreignKey,
} from "drizzle-orm/sqlite-core";

// Define the chats table
const chats = sqliteTable("chats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  timestamp: integer("timestamp").notNull(),
});

// Define the messages table
const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  chatId: integer("chat_id")
    .references(() => chats.id)
    .notNull(),
  message: text("message").notNull(),
  timestamp: integer("timestamp").notNull(),
  ai: integer("ai", { mode: "boolean" }).notNull().default(false),
});

export { chats, messages };
