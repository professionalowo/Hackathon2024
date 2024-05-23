import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './app/.server/db/client';

// This will run migrations on the database, skipping the ones already applied
//@ts-expect-error
await migrate(db, { migrationsFolder: './drizzle' });