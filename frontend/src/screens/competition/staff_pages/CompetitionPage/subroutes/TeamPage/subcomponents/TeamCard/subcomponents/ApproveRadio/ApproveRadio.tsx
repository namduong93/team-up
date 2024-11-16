import { FC, useState } from "react";
import { StyledApproveDiv, StyledRadioCircleDiv } from "../../TeamCard.styles";

export const ApproveRadio: FC<React.HTMLAttributes<HTMLDivElement>> = ({ onClick = () => {}, children, ...props }) => {
  const [selected, setSelected] = useState<boolean>(false);
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setSelected((prev) => !prev);
    onClick(e);
  }
  return (
    <StyledApproveDiv
      onClick={handleClick}
      {...props}
      data-test-id="approve-radio--StyledApproveDiv-0">
      <StyledRadioCircleDiv $selected={selected} data-test-id="approve-radio--StyledRadioCircleDiv-0" />
      {children}
    </StyledApproveDiv>
  );
}