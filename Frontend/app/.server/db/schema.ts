import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
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

const chatRelation = relations(chats, ({ many }) => ({
  messages: many(messages)
}));

const messageRelation = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id]
  }),
}));

type Chat = typeof chats.$inferSelect;
type ChatInsert = typeof chats.$inferInsert;
type Message = typeof messages.$inferSelect;
type MessageInsert = typeof messages.$inferInsert;

export { chats, messages, chatRelation, messageRelation, type Chat, type Message, type ChatInsert, type MessageInsert };
