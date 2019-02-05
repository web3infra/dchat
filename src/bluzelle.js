const { bluzelle } = require('bluzelle');

const wsAddr = 'ws://bernoulli.bluzelle.com:51010';
const privatePem = 'MHQCAQEEIFNmJHEiGpgITlRwao/CDki4OS7BYeI7nyz+CM8NW3xToAcGBSuBBAAKoUQDQgAEndHOcS6bE1P9xjS/U+SM2a1GbQpPuH9sWNWtNYxZr0JcF+sCS2zsD+xlCcbrRXDZtfeDmgD9tHdWhcZKIy8ejQ==';

export function newBluzelleClient(uuid) {
  return bluzelle({
    entry: wsAddr,
    uuid: uuid,
    private_pem: privatePem,
  });
}

export async function getAllKeys(databaseID) {
  let bluzelleClient = newBluzelleClient(databaseID);
  let keys = await bluzelleClient.keys();
  bluzelleClient.close();
  return keys;
}

export async function createDB(databaseID) {
  let bluzelleClient = newBluzelleClient(databaseID);
  await bluzelleClient.createDB();
}

export async function writeToDB(databaseID, key, value) {
  let bluzelleClient = newBluzelleClient(databaseID);
  await bluzelleClient.create(key, value);
  console.log(await bluzelleClient.keys());
  bluzelleClient.close();
}

export function getUserDatabaseID(username) {
  return 'dchat_history_' + username;
}

export function getChatDatabaseID(chatID) {
  return 'dchat_messages_history_' + chatID;
}
