const express = require("express");
const router = express.Router();
const { authenticatedUser, isMember, isOwner } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const dao = require("../db/shoppingListDao");

// shoppingList/create
router.post("/", authenticatedUser, validateBody(["name"]), async (req, res) => {
  try {
    const list = await dao.createList(req, req.body.name, req.user);
    res.status(200).json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// shoppingList/list
router.get("/", authenticatedUser, async (req, res) => {
  try {
    const lists = await dao.getListsByUser(req, req.user.id);
    res.status(200).json({ itemList: lists });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// shoppingList/get
router.get("/:listId", authenticatedUser, isMember, async (req, res) => {
  res.status(200).json(req.list);
});

// shoppingList/update
router.post("/:listId", authenticatedUser, isOwner, validateBody(["name"]), async (req, res) => {
  try {
    const list = await dao.updateList(req, req.params.listId, req.body.name);
    res.status(200).json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// shoppingList/delete
router.delete("/:listId", authenticatedUser, isOwner, async (req, res) => {
  try {
    const result = await dao.deleteList(req, req.params.listId);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// shoppingList/archive
router.post("/:listId/archive", authenticatedUser, isOwner, async (req, res) => {
  try {
    const list = await dao.archiveList(req, req.params.listId);
    res.status(200).json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// shoppingList/addMember
router.post("/:listId/members", authenticatedUser, isOwner, validateBody(["userId"]), async (req, res) => {
  try {
    const USERS = [
      { id: "u1", name: "Petr Novák" },
      { id: "u2", name: "Anna Nováková" },
      { id: "u3", name: "Mike Novák" },
    ];
    const newMember = USERS.find((u) => u.id === req.body.userId);
    if (!newMember) {
      return res.status(404).json({ error: "Uživatel nenalezen" });
    }
    const list = await dao.addMember(req, req.params.listId, newMember);
    res.status(200).json({ listId: req.params.listId, members: list.members });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// shoppingList/removeMember
router.delete("/:listId/members/:userId", authenticatedUser, isOwner, async (req, res) => {
  try {
    const list = await dao.removeMember(req, req.params.listId, req.params.userId);
    res.status(200).json({ listId: req.params.listId, members: list.members });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// shoppingList/leave
router.delete("/:listId/members/me", authenticatedUser, isMember, async (req, res) => {
  try {
    await dao.removeMember(req, req.params.listId, req.user.id);
    res.status(200).json({ listId: req.params.listId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;