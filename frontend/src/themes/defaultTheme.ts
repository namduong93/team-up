import { DefaultTheme } from 'styled-components';

export const defaultTheme: DefaultTheme = {
  background: "#FFFFFF",
  colours: {
    primaryLight: "#BCCFF8",
    primaryDark: "#6688D2",
    secondaryLight: "#FDD386",
    secondaryDark: "#EA9C0D",
    cancel: "#F68486",
    cancelDark: "#AD0B0B",
    confirm: "#8BDFA5",
    confirmDark: "#558964",
    sidebarBackground: "#EBEBEB",
    optionUnselected: "#EBEBEB",
    optionSelected: "#BCCFF8",
    filterText: "#6c757d",
    sidebarLine: "rgba(122, 122, 122, 90%)",
    staffOption: "#FEB1B1",
    error: "red",
    notifDate: "#6688D2",
    notifLight: "#EBEBEB",
    notifDark: "#333333",
    progressStart: "#283e6c",
    progressEnd: "#6688D2",
    progressBackground: "#BCCFF8",
    userInfoCardHeader: "#D6D6D6",
  },
  teamProfile: {
    invite: "#DFE8FB",
    inviteBorder: "#6688D2",
    join: "#FEEBC8",
    joinBorder: "#EA9C0D",
    name: "#FDE2FC",
    nameBorder: "#F19EDC",
    site: "#E1FAFC",
    siteBorder: "#35B4C2",
  },
  staffActions: {
    competition: "#DFE8FB",
    competitionBorder: "#6688D2",
    registration: "#FEEBC8",
    registrationBorder: "#EA9C0D",
    seat: "#FDE2FC",
    seatBorder: "#F19EDC",
  },
  teamView: {
    pending: "#F68486",
    unregistered: "#FDD386",
    registered: "#8BDFA5",
  },
  roles: {
    coachText: "#6688D2",
    coachBackground: "#BCCFF8",
    siteCoordinatorText: "#9747FF",
    siteCoordinatorBackground: "#ECDCFF",
    adminText: "#D268D1",
    adminBackground: "#FDE2FC",
    studentText: "#35B4C2",
    studentBackground: "#E1FAFC",
  },
  access: {
    acceptedBackground: 'rgba(139, 223, 165, 54%)',
    acceptedText: '#63A577',
    rejectedBackground: 'rgba(255, 29, 32, 28%)',
    rejectedText: '#ED1E21',
    pendingBackground: 'rgb(253, 211, 134, 31%)',
    pendingText: '#EA9C0D',
  },
  fonts: {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSizes: {
      small: "14px",
      medium: "16px",
      large: "20px",
      subheading: "24px",
      heading: "28px",
      title: "32px"
    },
    fontWeights: {
      regular: 400,
      medium: 500,
      bold: 600,
    },
    spacing: {
      normal: "0.3px",
      wide: "1px",
    },
    colour: "#000000",
    descriptor: "#333333",
    email: "blue",
    style: "italic",
  },
};


// However the default Theme is structured will be the type of the theme
// export type Theme = typeof defaultTheme;