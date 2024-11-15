import { FC } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import rehypeRaw from "rehype-raw";

interface MarkdownDisplayProps {
  content: string;
}

const StyledMarkdown = styled(ReactMarkdown)`
  font-size: 1rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.fonts.colour};
  font-family: ${({ theme }) => theme.fonts.fontFamily};

  a {
    color: ${({ theme }) => theme.colours.primaryDark};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const MarkdownDisplay: FC<MarkdownDisplayProps> = ({ content }) => {
  return <StyledMarkdown children={content} rehypePlugins={[rehypeRaw]} />;
};
