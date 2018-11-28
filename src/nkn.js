import nkn from 'nkn-client/dist/nkn.min.js';

const seedRpcServerAddr = 'http://104.196.247.255:30003';
const privateKey = 'cd5fa29ed5b0e951f3d1bce5997458706186320f1dd89156a73d54ed752a7f37';
const publicKey = '036f900853f1909834994f40cfe1d1308939550dafe3d84de5758412bc5caa169b';

export function getNKNAddr(username) {
  return username + '.' + publicKey;
}

export function newNKNClient(username) {
  return nkn({
    identifier: username,
    privateKey: privateKey,
    seedRpcServerAddr: seedRpcServerAddr,
  })
}
