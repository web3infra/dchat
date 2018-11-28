const { BluzelleClient } = require('bluzelle');

const wsAddr = 'ws://test.network.bluzelle.com:51010';

export function newBluzelleClient(uuid) {
  return new BluzelleClient(wsAddr, uuid);
}

export async function writeToDB(databaseID, key, value) {
  let bluzelleClient = newBluzelleClient(databaseID);
  await bluzelleClient.connect();
  await bluzelleClient.create(key, value);
}

export function getUserDatabaseID(username) {
  return 'dchat_history_' + username;
}

export function getChatDatabaseID(chatID) {
  return '' + chatID;
}
