import { router } from "../../lib/api-router";

export default router
  .post((req, res) => {
    res.send("Hello world");
  })
  .get((req, res) => {
    res.send("get request");
  })
  .handle();
