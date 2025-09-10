import { server, PORT } from "./app.js";

server.listen(PORT, () => {
  console.log("Server has started on Port", PORT);
});
