import { Button } from '@mui/material';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { Wallet } from '@solana/wallet-adapter-react';
import React, { FC, MouseEventHandler } from 'react';
import { WalletIcon } from './WalletIcon';

export interface WalletListItemProps {
  handleClick: MouseEventHandler<HTMLButtonElement>;
  tabIndex?: number;
  wallet: Wallet;
}

export const WalletListItem: FC<WalletListItemProps> = ({ handleClick, tabIndex, wallet }) => {
  return (
    <li style={{ display: 'flex', justifyContent: 'center' }}>
      <Button
        className="wallet-modal-link-text"
        onClick={handleClick}
        startIcon={
          <WalletIcon wallet={wallet} style={{ marginRight: '10p!importantx', color: '#fff' }} />
        }
        tabIndex={tabIndex}
        sx={{ margin: '15px auto' }}
      >
        {wallet.adapter.name}
      </Button>
    </li>
  );
};
