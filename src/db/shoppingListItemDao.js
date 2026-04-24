const { ObjectId } = require("mongodb");

function getCollection(req) {
  return req.app.locals.db.collection("shoppingLists");
}

async function addItem(req, listId, name) {
  const collection = getCollection(req);
  const newItem = {
    id: new ObjectId().toString(),
    name,
    resolved: false,
  };
  await collection.updateOne(
    { _id: new ObjectId(listId) },
    { $push: { items: newItem } }
  );
  return { ...newItem, listId };
}

async function updateItem(req, listId, itemId, name) {
  const collection = getCollection(req);
  await collection.updateOne(
    { _id: new ObjectId(listId), "items.id": itemId },
    { $set: { "items.$.name": name } }
  );
  return { id: itemId, listId, name, resolved: false };
}

async function deleteItem(req, listId, itemId) {
  const collection = getCollection(req);
  await collection.updateOne(
    { _id: new ObjectId(listId) },
    { $pull: { items: { id: itemId } } }
  );
  return { itemId, listId };
}

async function resolveItem(req, listId, itemId) {
  const collection = getCollection(req);
  await collection.updateOne(
    { _id: new ObjectId(listId), "items.id": itemId },
    { $set: { "items.$.resolved": true } }
  );
  return { id: itemId, listId, resolved: true };
}

module.exports = { addItem, updateItem, deleteItem, resolveItem };