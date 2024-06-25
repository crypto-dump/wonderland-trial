import { Button, styled } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { BaseError, erc20Abi, zeroAddress } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { AddressStringType, ERC20Token } from '@/types';

type ApproveButtonProps = {
  token: ERC20Token;
  targetAddress?: AddressStringType;
  amount: bigint;
  onUpdateError: (msg: string) => void;
};

const ApproveButton = ({ token, targetAddress, amount, onUpdateError }: ApproveButtonProps) => {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const isPendingApproval = isPending || isConfirming;

  const handleApprove = useCallback(() => {
    onUpdateError('');

    writeContract({
      address: token.address,
      abi: erc20Abi,
      functionName: 'approve',
      args: [targetAddress ?? zeroAddress, amount],
    });
  }, [amount, token.address, onUpdateError, targetAddress, writeContract]);

  useEffect(() => {
    if (!error) {
      onUpdateError('');
      return;
    }
    onUpdateError((error as BaseError).shortMessage || error.message);
  }, [error, onUpdateError]);

  return (
    <SButton variant='contained' size='small' onClick={handleApprove} disabled={!targetAddress || isPendingApproval}>
      {isPendingApproval ? 'Approving...' : 'Approve'}
    </SButton>
  );
};

const SButton = styled(Button)({
  flex: 1,
});

export default ApproveButton;
