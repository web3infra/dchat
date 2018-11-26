import IPFS from 'ipfs';
import OrbitDB from 'orbit-db';

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
				db = await orbitdb.keyvalue('keyValSample')
				resolve(db);
			});
		})
	}else{
		return db;
	}
};


module.exports.add = async (key, value) => {
	try {
		if (!key.length) {
			return {message: 'invalid input'}
		}
		await db.put(key, value)
		await db.close();
		return {message: 'success'};
	} catch (err) {
		throw err;
	}	
}

module.exports.read = async (key) => {
	try {
		if (!key.length) {
			return {message: 'invalid key'}
		}
		await db.load();
		const value = await db.get(key);
		return value;
	} catch (err) {
		throw err;
	}	
}

module.exports.diconnect = async () => {
	try {
		await ipfs.stop();
	} catch (err) {
		throw err;
	}	
};