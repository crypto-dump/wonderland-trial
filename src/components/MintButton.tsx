import { Button, Tooltip } from '@mui/material';
import { useCallback } from 'react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { WTAbi } from '@/contracts/abi/WTAbi';
import { ERC20Token } from '@/types';

type MintButtonProps = {
  token: ERC20Token;
  amount: bigint;
};

const MintButton = ({ token, amount }: MintButtonProps) => {
  const account = useAccount();

  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const isPendingMint = isPending || isConfirming;

  const handleMint = useCallback(() => {
    writeContract({
      address: token.address,
      abi: WTAbi,
      functionName: 'mint',
      args: account.address ? [account.address, amount] : undefined,
    });
  }, [account.address, amount, token.address, writeContract]);

  return (
    <Tooltip title={`Mint 100 ${token.symbol}`} arrow>
      <Button variant='contained' size='small' onClick={handleMint} disabled={isPendingMint}>
        {isPendingMint ? 'Minting...' : 'Mint'}
      </Button>
    </Tooltip>
  );
};

export default MintButton;
