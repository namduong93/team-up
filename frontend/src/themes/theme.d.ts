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
        progressBackground: string;
        userInfoCardHeader: string,
  };
      teamProfile: {
        invite: string;
        inviteBorder: string;
        join: string;
        joinBorder: string;
        name: string;
        nameBorder: string;
        site: string;
        siteBorder: string;
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
      access: {
        acceptedBackground: string;
        acceptedText: string;
        rejectedBackground: string;
        rejectedText: string;
        pendingBackground: string;
        pendingText: string;
      },
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
          email: string;
          style: string;
      };
    }
}