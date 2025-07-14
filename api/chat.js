import { createServer } from "../server/index.js";

// Create Express app
const app = createServer();

// Export as serverless function
export default async function handler(req, res) {
  return app(req, res);
}
