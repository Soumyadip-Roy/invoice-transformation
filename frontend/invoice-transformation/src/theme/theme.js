import { extendTheme } from "@mui/material/styles";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        primary: {
          main: "#1976d2",
        },
        secondary: {
          main: "#dc004e",
        },
      },
    },
    dark: {
      palette: {
        mode: "dark",
        primary: {
          main: "#90caf9",
        },
        secondary: {
          main: "#f48fb1",
        },
      },
    },
  },
  colorSchemeSelector: "class", // Enables toggling between light and dark modes via CSS classes
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  shape: {
    borderRadius: 8, // Customize border radius
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default theme;
