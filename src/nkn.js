import nkn from 'nkn-client';

const client = nkn({
  identifier: `${parseInt(Math.random() * 2)}`,
  privateKey: 'cd5fa29ed5b0e951f3d1bce5997458706186320f1dd89156a73d54ed752a7f37',
});

export default client;

export const remoteAddr = (1 - parseInt(client.identifier)) + '.' + client.addr.split('.')[1];
