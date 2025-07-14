// Vercel serverless function wrapper
import { createServer } from "../dist/server/node-build.mjs";

const app = createServer();

export default app;
