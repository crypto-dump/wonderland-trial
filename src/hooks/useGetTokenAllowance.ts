import { erc20Abi } from 'viem';
import { useAccount, useChainId, useReadContract } from 'wagmi';
import { AddressStringType } from '~/types';

type Props = {
  contractAddress: AddressStringType;
  from?: AddressStringType;
  to?: AddressStringType;
};

const useGetTokenAllowance = ({ contractAddress, from, to }: Props) => {
  const chainId = useChainId();
  const account = useAccount();

  const fromAddress = from ?? account.address;
  const toAddress = to;

  const { data: allowance } = useReadContract({
    address: contractAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    chainId,
    args: fromAddress && toAddress ? [fromAddress, toAddress] : undefined,
    query: {
      refetchInterval: 1000,
    },
  });

  return allowance;
};

export default useGetTokenAllowance;
