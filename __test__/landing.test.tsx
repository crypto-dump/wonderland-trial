import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Landing } from '@/containers/Landing';
import * as hooks from '@/hooks';
import TargetWalletSelection from '@/containers/TargetWalletSelection';
import TokenTransferCard from '@/containers/TokenTransferCard';

jest.mock('@/config/tokens', () => ({
  DAI: { symbol: 'DAI' },
  USDC: { symbol: 'USDC' },
}));

jest.mock('@/containers/TargetWalletSelection', () => jest.fn(() => null));
jest.mock('@/containers/TokenTransferCard', () => jest.fn((props) => <div {...props} />));

// Mock the useStateContext hook
jest.mock('@/hooks', () => ({
  useStateContext: jest.fn(),
}));

describe('<Landing />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Landing component', () => {
    // Mock the targetAddress value
    jest
      .spyOn(hooks, 'useStateContext')
      .mockImplementation(() => ({ targetAddress: '0x123', setTargetAddress: jest.fn() }));

    render(<Landing />);

    // Check if the Landing component is rendered
    const landingElement = screen.getByTestId('wonderland-trial');
    expect(landingElement).toBeInTheDocument();

    // Check if TargetWalletSelection component is rendered
    expect(TargetWalletSelection).toHaveBeenCalled();

    // Check if TokenTransferCard component is rendered
    expect(TokenTransferCard).toHaveBeenCalled();

    // Check if Typography element contains the correct text
    const typographyElement = screen.getByText(/Send following tokens to/i);
    expect(typographyElement).toBeInTheDocument();
  });

  it('displays placeholder when targetAddress is not provided', () => {
    // Mock the targetAddress value as null
    jest
      .spyOn(hooks, 'useStateContext')
      .mockImplementation(() => ({ targetAddress: undefined, setTargetAddress: jest.fn() }));

    render(<Landing />);

    // Check if Typography element contains the placeholder text
    const targetAddressElement = screen.getByTestId('target-address').innerHTML;
    expect(targetAddressElement).toContain('__');
  });

  it('displays targetAddress when provided', () => {
    // Mock the targetAddress value
    jest
      .spyOn(hooks, 'useStateContext')
      .mockImplementation(() => ({ targetAddress: '0x123', setTargetAddress: jest.fn() }));

    render(<Landing />);

    // Check if Typography element contains the placeholder text
    const targetAddressElement = screen.getByTestId('target-address').innerHTML;
    expect(targetAddressElement).toContain('0x123');
  });
});
