const { ObjectId } = require("mongodb");

function getCollection(req) {
  return req.app.locals.db.collection("shoppingLists");
}

async function createList(req, name, owner) {
  const collection = getCollection(req);
  const newList = {
    name,
    ownerId: owner.id,
    ownerName: owner.name,
    archived: false,
    members: [{ id: owner.id, name: owner.name }],
    items: [],
    createdAt: new Date(),
  };
  const result = await collection.insertOne(newList);
  return { ...newList, _id: result.insertedId };
}

async function getListsByUser(req, userId) {
  const collection = getCollection(req);
  const lists = await collection
    .find({ "members.id": userId, archived: false })
    .toArray();
  return lists;
}

async function getListById(req, listId) {
  const collection = getCollection(req);
  const list = await collection.findOne({ _id: new ObjectId(listId) });
  return list;
}

async function updateList(req, listId, name) {
  const collection = getCollection(req);
  await collection.updateOne(
    { _id: new ObjectId(listId) },
    { $set: { name } }
  );
  return getListById(req, listId);
}

async function deleteList(req, listId) {
  const collection = getCollection(req);
  await collection.deleteOne({ _id: new ObjectId(listId) });
  return { id: listId };
}

async function archiveList(req, listId) {
  const collection = getCollection(req);
  await collection.updateOne(
    { _id: new ObjectId(listId) },
    { $set: { archived: true } }
  );
  return getListById(req, listId);
}

async function addMember(req, listId, newMember) {
  const collection = getCollection(req);
  await collection.updateOne(
    { _id: new ObjectId(listId) },
    { $push: { members: newMember } }
  );
  return getListById(req, listId);
}

async function removeMember(req, listId, userId) {
  const collection = getCollection(req);
  await collection.updateOne(
    { _id: new ObjectId(listId) },
    { $pull: { members: { id: userId } } }
  );
  return getListById(req, listId);
}

module.exports = {
  createList,
  getListsByUser,
  getListById,
  updateList,
  deleteList,
  archiveList,
  addMember,
  removeMember,
};