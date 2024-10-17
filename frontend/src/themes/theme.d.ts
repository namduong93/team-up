import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    background: string;
    colours: {
        primaryLight: string;
        primaryDark: string;
        secondaryLight: string;
        secondaryDark: string;
        cancel: string;
        cancelDark: string;
        confirm: string;
        confirmDark: string;
        sidebarBackground: string;
        optionUnselected: string;
        optionSelected: string;
        filterText: string;
        sidebarLine: string;
        staffOption: string;
        error: string;
        notifDate: string;
        notifLight: string;
        notifDark: string;
        progressStart: string;
        progressEnd: string;
      };
      teamView: {
          pending: string;
          unregistered: string;
          registered: string;
      };
      roles: {
          coachText: string;
          coachBackground: string;
          siteCoordinatorText: string;
          siteCoordinatorBackground: string;
          adminText: string;
          adminBackground: string;
          studentText: string;
          studentBackground: string;
      };
      fonts: {
          fontFamily: string;
          fontSizes: {
            small: string;
            medium: string;
            large: string;
            subheading: string;
            heading: string;
            title: string;
          };
          fontWeights: {
            regular: number;
            medium: number;
            bold: number;
          };
          spacing: {
            normal: string;
            wide: string;
          };
          colour: string;
          descriptor: string;
          style: string;
      };
    }
}