const USERS = [
  { id: "u1", name: "Petr Novák" },
  { id: "u2", name: "Anna Nováková" },
  { id: "u3", name: "Mike Novák" },
];

const SHOPPING_LISTS = [
  {
    id: "list1",
    name: "Seznam na party",
    ownerId: "u1",
    archived: false,
    members: [
      { id: "u1", name: "Petr Novák" },
      { id: "u2", name: "Anna Nováková" },
      { id: "u3", name: "Mike Novák" },
    ],
    items: [],
  },
  {
    id: "list2",
    name: "Nákup na dovolenou",
    ownerId: "u2",
    archived: false,
    members: [
      { id: "u1", name: "Petr Novák" },
      { id: "u2", name: "Anna Nováková" },
    ],
    items: [],
  },
];

function authenticatedUser(req, res, next) {
  const userId = req.headers["x-user-id"];
  const user = USERS.find((u) => u.id === userId);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized - neznámý uživatel" });
  }

  req.user = user;
  req.db = { users: USERS, lists: SHOPPING_LISTS };
  next();
}

function isMember(req, res, next) {
  const listId = req.params.listId || req.body.listId;
  const list = req.db.lists.find((l) => l.id === listId);

  if (!list) {
    return res.status(404).json({ error: "Seznam nenalezen" });
  }

  if (!list.members.some((m) => m.id === req.user.id)) {
    return res.status(403).json({ error: "Forbidden - nejsi členem tohoto seznamu" });
  }

  req.list = list;
  next();
}

function isOwner(req, res, next) {
  const listId = req.params.listId || req.body.id;
  const list = req.db.lists.find((l) => l.id === listId);

  if (!list) {
    return res.status(404).json({ error: "Seznam nenalezen" });
  }

  if (list.ownerId !== req.user.id) {
    return res.status(403).json({ error: "Forbidden - nejsi vlastníkem tohoto seznamu" });
  }

  req.list = list;
  next();
}

module.exports = { authenticatedUser, isMember, isOwner };