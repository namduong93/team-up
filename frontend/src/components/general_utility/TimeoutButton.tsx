import React, { FC, useState } from "react";
import { useTheme } from "styled-components";
import { Button } from "../../screens/auth/RegisterForm/subroutes/AccountDataInput/AccountDataInput.styles";

interface TimeoutButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  seconds?: number;
  bgColor?: string;
}

export const TimeoutButton: FC<TimeoutButtonProps> = ({ seconds = 5,
    bgColor, onClick = () => {}, style, children, ...props }) => {

  const theme = useTheme();
  const [timeoutSeconds, setTimeoutSeconds] = useState(0);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    function countdown(timeoutSeconds: number) {
      const newTimeout = timeoutSeconds - 1;
      setTimeoutSeconds(newTimeout);
      if (newTimeout !== 0) {
        setTimeout(countdown, 1000, timeoutSeconds - 1);
      }
    }

    setTimeoutSeconds(seconds);
    setTimeout(countdown, 1000, seconds);

    onClick(e);
  }
  return (
    <Button $bgColor={bgColor || theme.colours.primaryLight} type="button" style={style} $disabled={!!timeoutSeconds} onClick={handleClick} {...props}>
      {timeoutSeconds > 0 ? timeoutSeconds : children}
    </Button>
  )
}