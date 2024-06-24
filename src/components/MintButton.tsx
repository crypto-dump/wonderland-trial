import { Button, Tooltip } from '@mui/material';
import { useCallback } from 'react';
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { WTAbi } from '~/contracts/abi/WTAbi';
import { AddressStringType } from '~/types';

type MintButtonProps = {
  contractAddress: AddressStringType;
  amount: bigint;
};

const MintButton = ({ contractAddress, amount }: MintButtonProps) => {
  const account = useAccount();
  const { data: symbol } = useReadContract({
    address: contractAddress,
    abi: WTAbi,
    functionName: 'symbol',
  });

  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const isPendingMint = isPending || isConfirming;

  const handleMint = useCallback(() => {
    writeContract({
      address: contractAddress,
      abi: WTAbi,
      functionName: 'mint',
      args: account.address ? [account.address, amount] : undefined,
    });
  }, [account.address, amount, contractAddress, writeContract]);

  return (
    <Tooltip title={`Mint 100 ${symbol}`} arrow>
      <Button variant='contained' size='small' onClick={handleMint} disabled={isPendingMint}>
        {isPendingMint ? 'Minting...' : 'Mint'}
      </Button>
    </Tooltip>
  );
};

export default MintButton;
