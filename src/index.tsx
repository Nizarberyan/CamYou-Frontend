import { serve } from "bun";
import index from "./index.html";

const server = serve({
  port: 5173,
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Frontend Server running at ${server.url}`);
