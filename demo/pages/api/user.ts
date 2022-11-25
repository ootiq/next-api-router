import { router } from "../../lib/api-router";

export default router
  .get((req, res) => {
    res.send("User: hello");
  })
  .handle();
