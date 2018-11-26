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
				db = await orbitdb.docs('docSample')
				resolve(db);
			});
		})
	}else{
		return db;
	}
	
};

module.exports.add = async (doc) => {
	try {
		if(!doc) {
			return {message: 'invalid input'};
		}
		if(!db) {
			return {message: 'CONNECTION FAILED'}
		}
		const hash = await db.put(doc)
		await db.close();
		return hash;
	} catch (err) {
		throw err;
	}	
};

module.exports.read = async (id) => {
	try {
		if (!id) {
			return {message: 'invalid id'}
		}
		if(!db) {
			return {message: 'CONNECTION FAILED'}
		}
		await db.load();
		const doc = db.get(id)
		await db.close();
		console.log(doc);
		return doc[0];
	} catch (err) {
		throw err;
	}	
};

module.exports.query = async (mapper) => {
	try {
		await db.load();
		const all = await db.query(mapper)
		await db.close();
		console.log(all);
		return all;
	} catch (err) {
		throw err;
	}	
};

module.exports.delete = async (id) => {
	try {
		if (!id) {
			return {message: 'invalid id'}
		}
		await db.load();
		const hash = await db.del(id)
		await db.close();

		return hash;
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