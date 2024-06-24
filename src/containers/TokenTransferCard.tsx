import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import { Box, Typography, styled } from '@mui/material';
import { ERC20TokenByChain } from '~/types';
import { useChainId } from 'wagmi';
import { formatUnits, parseUnits, zeroAddress } from 'viem';
import Input from '~/components/Input';
import { useStateContext } from '~/hooks';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import useGetTokenAllowance from '~/hooks/useGetTokenAllowance';
import useGetTokenBalance from '~/hooks/useGetTokenBalance';
import ApproveButton from '~/components/ApproveButton';
import TransferButton from '~/components/TransferButton';
import MintButton from '~/components/MintButton';

type TokenTransferCardProps = {
  token: ERC20TokenByChain;
};

const TokenTransferCard = ({ token: tokenByChain }: TokenTransferCardProps) => {
  const chainId = useChainId();

  const { targetAddress } = useStateContext();

  const token = tokenByChain[chainId];

  const [amount, setAmount] = useState<number>(0);

  const handleAmountChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value ? +e.target.value : 0);
  }, []);

  const bigIntAmount = parseUnits(`${amount}`, token.decimals);

  const allowance = useGetTokenAllowance({ contractAddress: token.address, to: targetAddress });
  const balance = useGetTokenBalance({ contractAddress: token.address });

  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [amount]);

  return (
    <SCard variant='outlined'>
      <CardContent>
        <Box display='flex' gap={2} flexDirection='column'>
          <Box display='flex' gap={1} alignItems='center'>
            <Typography>
              Token:&nbsp;<b>{token.name}</b>
            </Typography>
            <MintButton token={token} amount={parseUnits(`100`, token.decimals)} />
          </Box>
          <Typography>
            Balance:&nbsp;
            <b>
              {formatUnits(balance || 0n, token.decimals)} {token.symbol}
            </b>
          </Typography>
          <Typography>
            Allowance:&nbsp;
            <b>
              {formatUnits(allowance || 0n, token.decimals)} {token.symbol}
            </b>
          </Typography>
          <Box display='flex' alignItems='center' gap={2}>
            <Typography>Amount:</Typography>
            <Input type='number' value={amount} onChange={handleAmountChange} />
          </Box>
        </Box>
      </CardContent>
      <Box>
        <Box display='flex' alignItems='center' gap={1}>
          <ApproveButton token={token} targetAddress={targetAddress} amount={bigIntAmount} onUpdateError={setError} />
          <TransferButton
            token={token}
            targetAddress={targetAddress || zeroAddress}
            amount={bigIntAmount}
            onUpdateError={setError}
          />
        </Box>
        <ErrorLabel test-id='transaction-error-msg'>{error}</ErrorLabel>
      </Box>
    </SCard>
  );
};

const SCard = styled(Card)({
  flex: 1,
  padding: '1rem',
});

const ErrorLabel = styled(Typography)({
  color: 'red',
  textAlign: 'center',
  fontSize: '0.75rem',
  marginTop: '0.5rem',
});

export default TokenTransferCard;
