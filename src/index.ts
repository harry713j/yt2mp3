import { app, PORT } from "./app.js";

app.listen(PORT, () => {
  console.log(
    "Server has started on Port",
    PORT,
    " | ",
    new Date().toLocaleString()
  );
});
