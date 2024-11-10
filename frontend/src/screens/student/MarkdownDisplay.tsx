import { FC } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";

interface MarkdownDisplayProps {
  content: string;
}

const Markdown = styled(ReactMarkdown)`
  font-size: 1rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.fonts.colour};

  a {
    color: ${({ theme }) => theme.colours.primaryDark};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const MarkdownDisplay: FC<MarkdownDisplayProps> = ({ content }) => {
  return <Markdown>{content}</Markdown>;
};
