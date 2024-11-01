// client/src/theme.js
import { createContext, useMemo, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={{ ...colorMode, mode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    divider: "#e0e0e0", // Колір для світлої теми
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "--scrollbar-track": "#FFFFFF", // Колір треку скролбара для світлої теми
          "--scrollbar-thumb": "#b0b0b0", // Колір скролбара
          "--scrollbar-thumb-hover": "#909090", // Колір скролбара при наведенні

          /* Стилі для скролбара */
          "&::-webkit-scrollbar": {
            width: "8px",
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "var(--scrollbar-track)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "var(--scrollbar-thumb)",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "var(--scrollbar-thumb-hover)",
            },
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Основний колір кнопки
      contrastText: "#fff", // Колір тексту на кнопці
      fontWeight: 600,
    },
    divider: "#424242", // Колір для темної теми
    text: {
      primary: "#ffffff", // Основний колір тексту білим
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "--scrollbar-track": "#121212", // Колір треку скролбара для темної теми
          "--scrollbar-thumb": "#777", // Колір скролбара
          "--scrollbar-thumb-hover": "#999", // Колір скролбара при наведенні

          /* Стилі для скролбара */
          "&::-webkit-scrollbar": {
            width: "8px",
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "var(--scrollbar-track)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "var(--scrollbar-thumb)",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "var(--scrollbar-thumb-hover)",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#64b5f6", // Колір при наведенні для темної теми
          },
        },
        outlined: {
          borderColor: "#90caf9", // Колір рамки
          color: "#90caf9", // Колір тексту
          "&:hover": {
            backgroundColor: "rgba(144, 202, 249, 0.1)", // Колір фону при наведенні
            borderColor: "#64b5f6", // Колір рамки при наведенні
          },
        },
      },
    },
  },
});