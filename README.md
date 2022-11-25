# next-api-router

Custom route handler for Nextjs's file-sytem api routing.

## Install

```sh
# pnpm
pnpm add @ootiq/next-api-router

# yarn
yarn add @ootiq/next-api-router

# npm
npm install @ootiq/next-api-router
```

## Usage

```ts
// pages/api/hello.ts
import Router from "@ootiq/next-api-router";

const router = new Router();

export default router
  .post((req, res) => {
    res.send("Hello world");
  })
  .get((req, res) => {
    res.send("get request");
  })
  .all((req, res) => {
    res.status(404).send("not found");
  })
  .handle();
```

##

**&copy; 2022 | TheBoringDude**
