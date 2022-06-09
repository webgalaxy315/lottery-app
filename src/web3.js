import Web3 from 'web3';
let web3;
try {
    web3 = new Web3(window.web3.currentProvider);    
} catch (error) {
    console.log(error);
}
export default web3;
