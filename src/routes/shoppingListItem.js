const express = require("express");
const router = express.Router();
const { authenticatedUser, isMember } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const dao = require("../db/shoppingListItemDao");

// shoppingListItem/create
router.post("/:listId/items", authenticatedUser, isMember, validateBody(["name"]), async (req, res) => {
  try {
    const item = await dao.addItem(req, req.params.listId, req.body.name);
    res.status(200).json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// shoppingListItem/update
router.post("/:listId/items/:itemId", authenticatedUser, isMember, validateBody(["name"]), async (req, res) => {
  try {
    const item = await dao.updateItem(req, req.params.listId, req.params.itemId, req.body.name);
    res.status(200).json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// shoppingListItem/delete
router.delete("/:listId/items/:itemId", authenticatedUser, isMember, async (req, res) => {
  try {
    const result = await dao.deleteItem(req, req.params.listId, req.params.itemId);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// shoppingListItem/resolve
router.post("/:listId/items/:itemId/resolve", authenticatedUser, isMember, async (req, res) => {
  try {
    const result = await dao.resolveItem(req, req.params.listId, req.params.itemId);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;