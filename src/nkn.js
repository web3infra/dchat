import nkn from 'nkn-multiclient';

const seed = 'da8dea583695175b0c50f35f6a74ce9c1ec45d34381b58b59cea31631e5254d7';
const publicKey = 'd9f6430095742ec3ef54a540edbe0e50ef78b7e895904beb0e9c84163bb7af15';

export function getNKNAddr(username) {
  return username + '.' + publicKey;
}

export function newNKNClient(username) {
  return nkn({
    identifier: username,
    seed: seed,
    originalClient: true,
  })
}
