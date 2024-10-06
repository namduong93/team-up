import { defaultTheme } from "./defaultTheme";

export const darkTheme = {
  fonts: {
    ...defaultTheme.fonts,
  },
  colours: {
    primaryLight: "#4C5D7A",
    primaryDark: "#2C3956",
    secondaryLight: "#CC9A36",
    secondaryDark: "#A26E00",
    cancel: "#F68486",
    cancelDark: "#AD0B0B",
    confirm: "#6AC38A",
    confirmDark: "#3F7A55",
    sidebarBackground: "#333333",
  },
  teamView: {
    pending: "#D46A6A",
    unregistered: "#CBA24E",
    registered: "#6AC38A",
  },
  roles: {
    coachText: "#BCCFF8",
    coachBackgrond: "#2C3956",
    siteCoordinatorText: "#C49AFF",
    siteCoordinatorBackground: "#5A336D",
    adminText: "#F5A3F3",
    adminBackground: "#70245E",
    studentText: "#6FD1E2",
    studentBackground: "#2C5A5F",
  },
};
