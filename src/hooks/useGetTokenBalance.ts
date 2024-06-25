import { erc20Abi } from 'viem';
import { useAccount, useChainId, useReadContract } from 'wagmi';
import { AddressStringType } from '@/types';

type Props = {
  contractAddress: AddressStringType;
  address?: AddressStringType;
};

const useGetTokenAllowance = ({ contractAddress, address }: Props) => {
  const chainId = useChainId();
  const account = useAccount();

  const targetAddress = address ?? account.address;

  const { data: balance } = useReadContract({
    address: contractAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    chainId,
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      refetchInterval: 1000,
    },
  });

  return balance;
};

export default useGetTokenAllowance;
