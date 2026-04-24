require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const shoppingListRoutes = require("./routes/shoppingList");
const shoppingListItemRoutes = require("./routes/shoppingListItem");

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

async function start() {
  await client.connect();
  const db = client.db("shoppingListDB");
  app.locals.db = db;

  app.use("/lists", shoppingListRoutes);
  app.use("/lists", shoppingListItemRoutes);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
  });
}

start().catch(console.error);
