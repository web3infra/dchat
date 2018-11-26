// import IPFS from 'ipfs';
// import OrbitDB from 'orbit-db';
const IPFS = require('ipfs');
const OrbitDB = require('orbit-db');

const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true
  },
};

// Create IPFS instance
const ipfs = new IPFS(ipfsOptions);
let db;

module.exports.connect = async () => {
	if(!db){
		return new Promise((resolve, reject) => {
			ipfs.on('ready', async () => {
				// Create OrbitDB instance
				const orbitdb = new OrbitDB(ipfs);
				db = await orbitdb.eventlog('logSample')
				resolve(db);
			});
		})
	}else{
		return db;
	}
	
};

module.exports.add = async (value) => {
	try {
		if(!value.length) {
			return {message: 'invalid input'};
		}
		if(!db) {
			return {message: 'CONNECTION FAILED'}
		}
		const hash = await db.add(value)
		await db.close();
		return hash;
	} catch (err) {
		throw err;
	}	
};

module.exports.read = async (hash) => {
	try {
		if (!hash.length) {
			return {message: 'invalid hash'}
		}
		if(!db) {
			return {message: 'CONNECTION FAILED'}
		}
		await db.load();
		const log = await db.get(hash);
		await db.close();
		return log;
	} catch (err) {
		throw err;
	}	
};

module.exports.diconnect = async () => {
	try {
		
		await ipfs.stop();
	} catch (err) {
		throw err;
	}	
};