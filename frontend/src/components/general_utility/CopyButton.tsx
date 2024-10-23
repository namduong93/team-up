import { FC, useState } from "react";
import { FaRegCopy, FaCheck } from "react-icons/fa";
import styled from "styled-components";

interface CopyButtonProps {
  textToCopy: string;
}

const IconButton = styled(FaRegCopy)<{ $copied: boolean }>`
  margin-left: 3%;
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  color: ${({ theme, $copied }) =>
    $copied ? theme.colours.confirm : theme.colours.primaryDark};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colours.secondaryDark};
  }
`;

const CheckIcon = styled(FaCheck)`
  margin-left: 5%;
  width: 1rem;
  height: 1rem;
  color: ${({ theme }) => theme.colours.confirm};
`;

export const CopyButton: FC<CopyButtonProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return copied ? <CheckIcon /> : <IconButton $copied={copied} onClick={copyToClipboard} />;
};
