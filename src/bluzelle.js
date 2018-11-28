const { BluzelleClient } = require('bluzelle');

const wsAddr = 'ws://test.network.bluzelle.com:51010';

export function newBluzelleClient(uuid) {
  return new BluzelleClient(wsAddr, uuid);
}

export async function getAllKeys(databaseID) {
  let bluzelleClient = newBluzelleClient(databaseID);
  await bluzelleClient.connect();
  let keys = await bluzelleClient.keys()
  bluzelleClient.disconnect();
  return keys;
}

export async function writeToDB(databaseID, key, value) {
  let bluzelleClient = newBluzelleClient(databaseID);
  await bluzelleClient.connect();
  await bluzelleClient.create(key, value);
  await bluzelleClient.disconnect();
}

export function getUserDatabaseID(username) {
  return 'dchat_history_' + username;
}

export function getChatDatabaseID(chatID) {
  return 'dchat_messages_history_' + chatID;
}
