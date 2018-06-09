const assert = require('assert');
const ganache = require('ganache-cli');
const provider = ganache.provider();
const Web3 = require('web3');
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {
    // Get list of accounts
    accounts = await web3.eth.getAccounts();

    // Choose of this accounts to deploy the smart contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hi there!'] })
        .send({ from: accounts[0], gas: '1000000' });

    inbox.setProvider(provider);
});

describe('Inbox', () => {
    it('Get unlock accounts', () => {
        assert.ok(accounts);
    });

    it('Deploys a contract by using unlock account', () => {
        assert.ok(inbox.options.address);
    });

    it('Get default message after deploy', async () => {
        const defaultMessage = await inbox.methods.message().call();
        assert.equal(defaultMessage, 'Hi there!');
    });

    it('Set new message', async () => {
        await inbox.methods.setMessage('Hello').send({ from: accounts[0] })
        const defaultMessage = await inbox.methods.message().call();
        assert.equal(defaultMessage, 'Hello');
    });
});