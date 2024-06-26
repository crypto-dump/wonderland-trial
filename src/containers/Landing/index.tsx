import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

import TargetWalletSelection from '@/containers/TargetWalletSelection';
import TokenTransferCard from '@/containers/TokenTransferCard';
import { DAI, USDC } from '@/config/tokens';
import { useStateContext } from '@/hooks';

export const Landing = () => {
  const { targetAddress } = useStateContext();
  return (
    <LandingContainer data-testid='wonderland-trial'>
      <TargetWalletSelection />
      <STypography>
        Send following tokens to <i data-testid='target-address'>{targetAddress || '__'}</i>
      </STypography>
      <TransactionContainer>
        <TokenTransferCard token={DAI} />
        <TokenTransferCard token={USDC} />
      </TransactionContainer>
    </LandingContainer>
  );
};

const LandingContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: `calc(100vh - 5rem)`,
  padding: '0 8rem',
  alignItems: 'center',
  justifyContent: 'center',
  width: '67.5rem',
  '@media (max-width: 1080px)': {
    width: '100%',
    padding: '0 1rem',
  },
});

const TransactionContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  gap: '2rem',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
  },
});

const STypography = styled(Typography)({
  marginTop: '4rem',
  marginBottom: '1rem',
});
