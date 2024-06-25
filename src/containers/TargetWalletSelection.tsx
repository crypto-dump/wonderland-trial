import { Button, Typography, styled } from '@mui/material';
import Box from '@mui/material/Box';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { isAddress } from 'viem';
import Input from '@/components/Input';
import { useStateContext } from '@/hooks';
import { AddressStringType } from '@/types';

const TargetWalletSelection = () => {
  const { setTargetAddress } = useStateContext();
  const [input, setInput] = useState<string>('');

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSet = useCallback(() => {
    setTargetAddress(input as AddressStringType);
  }, [input, setTargetAddress]);

  const handleClear = useCallback(() => {
    setInput('');
  }, []);

  const isValidAddress = useMemo(() => input && isAddress(input), [input]);

  return (
    <Container>
      <SBox flex={1}>
        <Typography>Target wallet : </Typography>
        <Input error={!isValidAddress} value={input} onChange={handleInputChange} />
      </SBox>
      <SBox>
        <Button onClick={handleSet} variant='contained' color='primary' disabled={!isValidAddress}>
          Set
        </Button>
        <Button onClick={handleClear} variant='outlined'>
          Clear
        </Button>
      </SBox>
    </Container>
  );
};

const Container = styled(Box)(() => ({
  width: '100%',
  maxWidth: '40rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
  },
}));

const SBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
}));

export default TargetWalletSelection;
