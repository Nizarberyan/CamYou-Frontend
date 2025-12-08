Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest` (compatible with Jest-style tests)
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>`
- Bun automatically loads .env, so don't use dotenv.

## Backend Stack (Aligned with Project Specs)

- **Runtime**: Bun
- **Framework**: Express.js (Run via Bun)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT or HttpBasic

## Frontend Stack

- **Framework**: React.js
- **State Management**: Context API or Redux
- **Routing**: Nested Routes
- **Build Tool**: Vite (recommended for Bun) or strictly Bun-bundled if preferred.

## Testing

Use `bun test` to run unit tests for the backend (it is Jest-compatible).

```ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Implementation Notes

- **Backend**: Develop using Node.js style (Express + Mongoose) but **run** with Bun.
- **Frontend**: Use React hooks (useState, useEffect) and Context/Redux as specified.
- **Scripts**: Ensure `package.json` scripts use `bun` where applicable.
