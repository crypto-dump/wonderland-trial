export type AddressStringType = `0x${string}`;

export type ERC20Token = {
  name: string;
  decimals: number;
  symbol: string;
  address: AddressStringType;
  chainId: number;
};

export type ERC20TokenByChain = { [chainId: number]: ERC20Token };
