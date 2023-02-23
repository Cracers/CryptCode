import { ButtonProps, Button } from "@mui/material";
import React, { FC, MouseEvent, useCallback } from "react";
import { useWalletModal } from "./useWalletModal";

export const WalletModalButton: FC<ButtonProps> = ({
  children = "Select Wallet",
  onClick,
  ...props
}) => {
  const { visible, setVisible } = useWalletModal();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (onClick) onClick(event);
      if (!event.defaultPrevented) setVisible(!visible);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClick, visible]
  );
  return (
    <Button className="wallet-connect" onClick={handleClick} {...props}>
      {children}
    </Button>
  );
};
