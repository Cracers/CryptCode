import { Wallet } from '@solana/wallet-adapter-react';
import React, { DetailedHTMLProps, FC, ImgHTMLAttributes } from 'react';
import Image from 'next/image';

export interface WalletIconProps
  extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  wallet: Wallet | null;
}

export const WalletIcon: FC<WalletIconProps> = ({ wallet, ...props }) => {
  return (
    wallet && (
      <Image
        src={wallet.adapter.icon}
        alt={`${wallet.adapter.name} icon`}
        width={50}
        height={50}
        // {...props}
      />
    )
  );
};
