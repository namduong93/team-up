import { FC } from "react";
import { FlexBackground } from "../general_utility/Background";
import { backendURL } from "../../../config/backendURLConfig";

export const LoginPage: FC = () => {
  return (
  <FlexBackground>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '50%',
      height: '100%',
      alignItems: 'end',
      justifyContent: 'center'
    }}>
        <img style={{
          height: '100%',
          maxHeight: 'min(calc(60vw * 5 / 8), 100vh)',
        }} src={`${backendURL.HOST}:${backendURL.PORT}/images/icpc_logo.png`} />     
    </div>
    <div style={{
      display: 'flex',
      width: '50%',
      height: '100%',
    }}>
    </div>
  </FlexBackground>
  );
}