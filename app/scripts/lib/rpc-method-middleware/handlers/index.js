import addEthereumChain from './add-ethereum-chain';
import ethAccounts from './eth-accounts';
import getProviderState from './get-provider-state';
import requestAccounts from './request-accounts';
import sendMetadata from './send-metadata';
import switchEthereumChain from './switch-ethereum-chain';
import watchAsset from './watch-asset';

const handlers = [
  addEthereumChain,
  ethAccounts,
  getProviderState,
  requestAccounts,
  sendMetadata,
  switchEthereumChain,
  watchAsset,
];
export default handlers;
