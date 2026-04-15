const express = require("express");
const router = express.Router();
const { authenticatedUser, isMember, isOwner } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");

// shoppingList/create
router.post("/", authenticatedUser, validateBody(["name"]), (req, res) => {
  const { name } = req.body;
  res.status(200).json({
    id: "new-list-id",
    name,
    ownerId: req.user.id,
    archived: false,
    members: [{ id: req.user.id, name: req.user.name }],
    items: [],
  });
});

// shoppingList/list
router.get("/", authenticatedUser, (req, res) => {
  const userLists = req.db.lists.filter((l) =>
    l.members.some((m) => m.id === req.user.id)
  );
  res.status(200).json({ itemList: userLists });
});

// shoppingList/get
router.get("/:listId", authenticatedUser, isMember, (req, res) => {
  res.status(200).json(req.list);
});

// shoppingList/update
router.post("/:listId", authenticatedUser, isOwner, validateBody(["name"]), (req, res) => {
  const { name } = req.body;
  res.status(200).json({ ...req.list, name });
});

// shoppingList/delete
router.delete("/:listId", authenticatedUser, isOwner, (req, res) => {
  res.status(200).json({ id: req.list.id });
});

// shoppingList/archive
router.post("/:listId/archive", authenticatedUser, isOwner, (req, res) => {
  res.status(200).json({ ...req.list, archived: true });
});

// shoppingList/addMember
router.post("/:listId/members", authenticatedUser, isOwner, validateBody(["userId"]), (req, res) => {
  const { userId } = req.body;
  const newMember = req.db.users.find((u) => u.id === userId);

  if (!newMember) {
    return res.status(404).json({ error: "Uživatel nenalezen" });
  }

  res.status(200).json({
    listId: req.list.id,
    members: [...req.list.members, newMember],
  });
});

// shoppingList/removeMember
router.delete("/:listId/members/:userId", authenticatedUser, isOwner, (req, res) => {
  res.status(200).json({
    listId: req.list.id,
    members: req.list.members.filter((m) => m.id !== req.params.userId),
  });
});

// shoppingList/leave
router.delete("/:listId/members/me", authenticatedUser, isMember, (req, res) => {
  res.status(200).json({ listId: req.list.id });
});

module.exports = router;