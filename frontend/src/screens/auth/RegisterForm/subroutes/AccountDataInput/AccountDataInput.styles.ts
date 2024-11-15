import { styled } from "styled-components"

export const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.fonts.colour};
`

export const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  min-width: 200px;
`

export const DoubleInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 0.8%;
`

export const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 90px;
`

export const Button = styled.button<{ $disabled?: boolean, $bgColor?: string }>`
  max-width: 150px;
  width: 25%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ $disabled: disabled, theme, $bgColor }) => (
    disabled ? theme.colours.sidebarBackground : ($bgColor || theme.colours.primaryLight)
    )};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  /* font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold}; */
  pointer-events: ${({ $disabled: disabled }) => disabled ? 'none' : 'auto'};
  cursor: ${({ $disabled: disabled }) => (disabled ? 'not-allowed' : 'pointer' )};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`

export const Title = styled.h1`
  margin-bottom: 20px;
  margin-top: 30px;
`