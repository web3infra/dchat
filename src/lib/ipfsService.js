import ipfsClient from 'ipfs-http-client';

const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

export const add = async (files) => {
    try {
        const hash = await ipfs.add(files, { recursive: false });
        return hash;
    } catch (err) {
        console.log('add: ', files, err);
        return 'add not found';
    }
}
