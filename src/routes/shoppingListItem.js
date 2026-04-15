const express = require("express");
const router = express.Router();
const { authenticatedUser, isMember } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");

// shoppingListItem/create
router.post("/:listId/items", authenticatedUser, isMember, validateBody(["name"]), (req, res) => {
  const { name } = req.body;
  res.status(200).json({
    id: "new-item-id",
    listId: req.params.listId,
    name,
    resolved: false,
  });
});

// shoppingListItem/update
router.post("/:listId/items/:itemId", authenticatedUser, isMember, validateBody(["name"]), (req, res) => {
  const { name } = req.body;
  res.status(200).json({
    id: req.params.itemId,
    listId: req.params.listId,
    name,
    resolved: false,
  });
});

// shoppingListItem/delete
router.delete("/:listId/items/:itemId", authenticatedUser, isMember, (req, res) => {
  res.status(200).json({
    itemId: req.params.itemId,
    listId: req.params.listId,
  });
});

// shoppingListItem/resolve
router.post("/:listId/items/:itemId/resolve", authenticatedUser, isMember, (req, res) => {
  res.status(200).json({
    id: req.params.itemId,
    listId: req.params.listId,
    resolved: true,
  });
});

module.exports = router;