import React, { FC, useState } from "react";
import { Button } from "../../screens/login/AccountInformation";

interface TimeoutButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  seconds?: number;
}

export const TimeoutButton: FC<TimeoutButtonProps> = ({ seconds = 5, onClick = () => {}, style, children, ...props }) => {
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
    <Button type="button" style={style} $disabled={!!timeoutSeconds} onClick={handleClick} {...props}>
      {timeoutSeconds > 0 ? timeoutSeconds : children}
    </Button>
  )
}