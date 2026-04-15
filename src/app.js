const express = require("express");
const cors = require("cors");
const shoppingListRoutes = require("./routes/shoppingList");
const shoppingListItemRoutes = require("./routes/shoppingListItem");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/lists", shoppingListRoutes);
app.use("/lists", shoppingListItemRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});
