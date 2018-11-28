const { BluzelleClient } = require('bluzelle');

const wsAddr = 'ws://test.network.bluzelle.com:51010';

export function newBluzelleClient(uuid) {
  return new BluzelleClient(wsAddr, uuid);
}
