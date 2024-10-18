import { DefaultTheme } from 'styled-components';
import { defaultTheme } from './defaultTheme';

export const darkTheme: DefaultTheme = {
  fonts: {
    ...defaultTheme.fonts,
    colour: "#FFFFFF",
    descriptor: "#EBEBEB",
  },
  background: "#121212",
  colours: {
    ...defaultTheme.colours,
    primaryLight: "#6688D2",
    primaryDark: "#BCCFF8",
    secondaryLight: "#EA9C0D",
    secondaryDark: "#FDD386",
    cancel: "#F68486",
    cancelDark: "#AD0B0B",
    confirmDark: "#558964",
    confirm: "#8BDFA5",
    sidebarBackground: "#333333",
    optionUnselected: "#333333",
    optionSelected: "#BCCFF8",
    filterText: "#EBEBEB",
    notifDate: "#BCCFF8",
    notifLight: "#333333",
    notifDark: "#EBEBEB",
    progressEnd: "#283e6c",
    progressStart: "#6688D2",
    progressBackground: "#EBEBEB",
  },
  teamView: {
    ...defaultTheme.teamView,
    pending: "#F68486",
    unregistered: "#FDD386",
    registered: "#8BDFA5",
  },
  roles: {
    ...defaultTheme.roles,
    coachText: "#6688D2",
    coachBackground: "#BCCFF8",
    siteCoordinatorText: "#9747FF",
    siteCoordinatorBackground: "#ECDCFF",
    adminText: "#D268D1",
    adminBackground: "#FDE2FC",
    studentText: "#35B4C2",
    studentBackground: "#E1FAFC",
  },
  teamProfile: {
    ...defaultTheme.teamProfile,
  }
};
