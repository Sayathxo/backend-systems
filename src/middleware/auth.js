const { ObjectId } = require("mongodb");

const USERS = [
  { id: "u1", name: "Petr Novák" },
  { id: "u2", name: "Anna Nováková" },
  { id: "u3", name: "Mike Novák" },
];

function authenticatedUser(req, res, next) {
  const userId = req.headers["x-user-id"];
  const user = USERS.find((u) => u.id === userId);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized - neznámý uživatel" });
  }

  req.user = user;
  next();
}

async function isMember(req, res, next) {
  const listId = req.params.listId || req.body.listId;
  try {
    const collection = req.app.locals.db.collection("shoppingLists");
    const list = await collection.findOne({ _id: new ObjectId(listId) });

    if (!list) {
      return res.status(404).json({ error: "Seznam nenalezen" });
    }

    if (!list.members.some((m) => m.id === req.user.id)) {
      return res.status(403).json({ error: "Forbidden - nejsi členem tohoto seznamu" });
    }

    req.list = { ...list, id: list._id.toString() };
    next();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function isOwner(req, res, next) {
  const listId = req.params.listId || req.body.id;
  try {
    const collection = req.app.locals.db.collection("shoppingLists");
    const list = await collection.findOne({ _id: new ObjectId(listId) });

    if (!list) {
      return res.status(404).json({ error: "Seznam nenalezen" });
    }

    if (list.ownerId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden - nejsi vlastníkem tohoto seznamu" });
    }

    req.list = { ...list, id: list._id.toString() };
    next();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = { authenticatedUser, isMember, isOwner };