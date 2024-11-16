import React, { FC, useState } from "react";
import { useTheme } from "styled-components";
import { StyledButton } from "../../screens/auth/RegisterForm/subroutes/AccountDataInput/AccountDataInput.styles";

interface TimeoutButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  seconds?: number;
  bgColor?: string;
}

/**
 * A React button component with a built-in timer
 *
 * @param {TimeoutButtonProps} props - React TimeoutButtonProps specified above
 * @returns {JSX.Element} - Web page component button that resets after a
 * timer
 */
export const TimeoutButton: FC<TimeoutButtonProps> = ({
  seconds = 5,
  bgColor,
  onClick = () => {},
  style,
  children,
  ...props
}) => {
  const theme = useTheme();
  const [timeoutSeconds, setTimeoutSeconds] = useState(0);

  /**
   * Handles the button click event:
   * 1. Prevents the default form submission (if any).
   * 2. Starts a countdown timer, updating the `timeoutSeconds` state every second.
   * 3. Disables the button while the timer is active.
   * 4. Calls the provided `onClick` callback function.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} e - The button click event.
   */
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    /**
     * Recursively decreases the timer value every second until it reaches zero.
     *
     * @param {number} timeoutSeconds - Current timer value in seconds.
     */
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
  };

  return (
    <StyledButton
      $bgColor={bgColor || theme.colours.primaryLight}
      type="button"
      style={style}
      $disabled={!!timeoutSeconds}
      onClick={handleClick}
      {...props}
    >
      {timeoutSeconds > 0 ? timeoutSeconds : children}
    </StyledButton>
  );
};
