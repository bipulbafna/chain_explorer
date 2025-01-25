import { decodeAddress, encodeAddress } from '@polkadot/keyring';

export const isValidAddress = (address) => {
  try {
    const decoded = decodeAddress(address);
    encodeAddress(decoded);
    return true;
  } catch (error) {
    return false;
  }
};