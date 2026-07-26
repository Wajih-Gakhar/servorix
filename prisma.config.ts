import 'dotenv/config'; // Loads variables from .env into process.env
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
    schema: './prisma/schema.prisma',
    datasource: {
        // This helper ensures it looks for the DATABASE_URL environment variable
        url: env('DATABASE_URL'),
    },
    migrations: {
        seed: 'npx tsx prisma/seed.ts',
    },
});