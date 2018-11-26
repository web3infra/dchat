# React-truffle

This project is design to connect to blockchain and interact with MetaMask to send transaction on smart contract.  

## 💡[Document](./DOCUMENT.md)

### Technical stack

#### Frontend
- React
- Redux
- Saga
- Web3(MetaMask)

#### UI
- Sass
- Material-UI

#### Smart contract/Solidity
- [Truffle](./TRUFFLE.md)

### Install flow

#### Clone repo

```
git clone https://github.com/PortalNetwork/react-truffle.git
cd react-truffle-metamask
```

#### Install ganache

```
npm install -g ganache-cli
```

#### Install truffle

```
npm install -g truffle
```

#### Build repo

```
npm install
truffle compile
```

#### Start repo

Open a new console
```
ganache-cli
```

```
truffle migrate
npm start
```

#### Build repo

```
npm run build
```

## Reference

- ganache-cli: https://github.com/trufflesuite/ganache-cli
- truffle: https://github.com/trufflesuite/truffle
