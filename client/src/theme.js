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
    divider: "#e0e0e0",
    background: {
      paper: "#ffffff",
      div: "#f7f7f7",
      header: "#f5f5f5", // Колір для шапки таблиці у світлій темі
    },
  },
  components: {
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#f5f5f5", // Можна використовувати 'palette.background.header'
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "--scrollbar-track": "#FFFFFF",
          "--scrollbar-thumb": "#b0b0b0",
          "--scrollbar-thumb-hover": "#909090",
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
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)", // Менша тінь
          borderRadius: 8, // Згладжені краї
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
      contrastText: "#fff",
      fontWeight: 600,
    },
    divider: "#424242",
    background: {
      paper: "#1D1E26",
      div: "#272833",
      header: "#333333", // Колір для шапки таблиці у темній темі
    },
    text: {
      primary: "#ffffff",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          "--paper-overlay": "unset", // Видаляємо значення
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#333333", // Використання кольору для темної теми
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "--scrollbar-track": "#121212",
          "--scrollbar-thumb": "#777",
          "--scrollbar-thumb-hover": "#999",
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
            backgroundColor: "#64b5f6",
          },
        },
        outlined: {
          borderColor: "#90caf9",
          color: "#90caf9",
          "&:hover": {
            backgroundColor: "rgba(144, 202, 249, 0.1)",
            borderColor: "#64b5f6",
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)", // Менша, м’якша тінь
          borderRadius: 8, // Згладжені краї
        },
      },
    },
  },
});
