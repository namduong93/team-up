/* eslint-disable no-irregular-whitespace */
import { FC } from "react";
import { FlexBackground } from "../../../components/general_utility/Background";
import { styled } from "styled-components";
import { CompRegistrationProgressBar } from "../../../components/progress_bar/ProgressBar";
import { useNavigate, useParams } from "react-router-dom";

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.fonts.colour};
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  min-width: 200px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  margin-top: 30px;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 90px;
`;

export const Button = styled.button<{ $disabled?: boolean }>`
  max-width: 150px;
  width: 25%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ $disabled: disabled, theme }) =>
    disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  pointer-events: ${({ $disabled: disabled }) => (disabled ? "none" : "auto")};
  cursor: ${({ $disabled: disabled }) =>
    disabled ? "not-allowed" : "pointer"};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

export const CompetitionInformation: FC = () => {
  const navigate = useNavigate();
  const { code } = useParams<{ code?: string }>();

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleNext = () => {
    navigate(`/competition/individual/${code}`);
  };

  return (
    <FlexBackground
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <CompRegistrationProgressBar progressNumber={0} />
      <Container>
        <ContentContainer>
          <Title>Competition Information</Title>

          <p>
            This form is for registering to participate in the 2024 South
            Pacific ICPC Preliminary Contest. The Preliminary Contest will be
            held on 31st August 2024, and the top qualifying teams will progress
            to the Regional Finals, to be held in Sydney on 19th and 20th
            October 2024.The full qualification rules can be found at
            <a
              href="https://sppcontests.org/regional-qualification-rules/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://sppcontests.org/regional-qualification-rules/
            </a>
            .
          </p>

          <p>
            A team is official if all three team members meet the ICPC
            eligibility rules. The full eligibility rules can be found at{" "}
            <a
              href="https://icpc.global/regionals/rules/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://icpc.global/regionals/rules/
            </a>
            , but the most notable criteria are:
          </p>

          <ul>
            <li>
              enrolled in a degree program at the team's institution (in
              particular, high school teams are unofficial
            </li>
            <li>
              taking at least 1/2 load, or co-op, exchange or intern student
            </li>
            <li>have not competed in two ICPC World Finals</li>
            <li>
              have not competed in ICPC regional contests in five different
              years
            </li>
            <li>
              commenced post secondary studies in 2020 or later OR born in 2001
              or later
            </li>
          </ul>

          <p>
            Official teams will be charged a registration fee of $100, typically
            paid by the institution. Each team member will receive a T-shirt if
            the team is registered in this form and on{" "}
            <a
              href="https://icpc.global"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              icpc.global
            </a>{" "}
            by 31st July 2024.
          </p>

          <p>
            Unofficial (including high school) teams are not charged any
            registration fee, will not receive T-shirts, and do not need to be
            registered on icpc.global.
          </p>

          <p>
            To help check eligibility, every official competitor must use the
            email address associated with their institution of study, and must
            also provide the email address address that is linked to their
            icpc.global account.
          </p>

          <p>
            Additionally, all teams must choose whether to compete in Level A or
            Level B.
          </p>

          <ul>
            <li>
              The Level A problem set will be significantly more challenging
              than the Level B problem set and is designed to differentiate
              between the best teams in the region
            </li>
            <li>
              The Level B problem set is aimed towards less experienced teams
            </li>
            <li>
              There will be awards for the top teams in each Level. Only teams
              competing in Level A will be considered for qualification to
              Regional Finals
            </li>
          </ul>

          <p>
            If you have not previously competed in Regional Finals nor had a top
            10 result in the 2024 SPAR contests, we strongly advise you to
            register for Level B.
          </p>

          <ButtonContainer>
            <Button onClick={handleBack}>Back</Button>
            <Button onClick={handleNext}>Next</Button>
          </ButtonContainer>
        </ContentContainer>
      </Container>
    </FlexBackground>
  );
};
