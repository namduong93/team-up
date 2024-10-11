import { defaultTheme, Theme } from "./defaultTheme";

export const darkTheme: Theme = {
  fonts: {
    ...defaultTheme.fonts,
    colour: "#FFFFFF",
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
    confirm: "#558964",
    confirmDark: "#6AC38A",
    sidebarBackground: "#333333",
    optionUnselected: "#333333",
    optionSelected: "#BCCFF8",
    filterText: "#EBEBEB",
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
    coachBackgrond: "#BCCFF8",
    siteCoordinatorText: "#9747FF",
    siteCoordinatorBackground: "#ECDCFF",
    adminText: "#D268D1",
    adminBackground: "#FDE2FC",
    studentText: "#35B4C2",
    studentBackground: "#E1FAFC",
  },
};
