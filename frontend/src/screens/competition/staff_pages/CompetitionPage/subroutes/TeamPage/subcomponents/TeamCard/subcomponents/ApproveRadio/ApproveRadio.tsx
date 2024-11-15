import { FC, useState } from "react";
import { ApproveDiv, RadioCircleDiv } from "../../TeamCard.styles";

export const ApproveRadio: FC<React.HTMLAttributes<HTMLDivElement>> = ({ onClick = () => {}, children, ...props }) => {
  const [selected, setSelected] = useState<boolean>(false);
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setSelected((prev) => !prev);
    onClick(e);
  }
  return (
    <ApproveDiv onClick={handleClick} {...props}>
      <RadioCircleDiv $selected={selected} />
      {children}
    </ApproveDiv>
  );
}