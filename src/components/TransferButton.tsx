import { Button, styled } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { BaseError, erc20Abi } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import useGetTokenAllowance from '~/hooks/useGetTokenAllowance';
import useGetTokenBalance from '~/hooks/useGetTokenBalance';
import { AddressStringType, ERC20Token } from '~/types';

enum ERROR_CODES {
  INSUFFICIENT_BALANCE = 'No enough funds',
  INSUFFICIENT_ALLOWANCE = 'Need to approve first.',
}

type TransferButtonProps = {
  token: ERC20Token;
  targetAddress: AddressStringType;
  amount: bigint;
  onUpdateError: (msg: string) => void;
};

const TransferButton = ({ token, targetAddress, amount, onUpdateError }: TransferButtonProps) => {
  const allowance = useGetTokenAllowance({ contractAddress: token.address, to: targetAddress });
  const balance = useGetTokenBalance({ contractAddress: token.address });

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const isPendingTransfer = isPending || isConfirming;

  const handleTransfer = useCallback(() => {
    onUpdateError('');

    if (!balance || amount > balance) {
      onUpdateError(ERROR_CODES.INSUFFICIENT_BALANCE);
    } else if (amount > (allowance || 0n)) {
      onUpdateError(ERROR_CODES.INSUFFICIENT_ALLOWANCE);
    } else {
      writeContract({
        address: token.address,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [targetAddress, amount],
      });
    }
  }, [onUpdateError, balance, amount, allowance, writeContract, token.address, targetAddress]);

  useEffect(() => {
    if (!error) {
      onUpdateError('');
      return;
    }
    onUpdateError((error as BaseError).shortMessage || error.message);
  }, [onUpdateError, error]);

  return (
    <SButton variant='contained' size='small' onClick={handleTransfer} disabled={!targetAddress || isPendingTransfer}>
      {isPendingTransfer ? 'Transfering...' : 'Transfer'}
    </SButton>
  );
};

const SButton = styled(Button)({
  flex: 1,
});

export default TransferButton;
