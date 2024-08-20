"use client"
import { SignIn } from "@clerk/nextjs"
import {AppBar, Container, Typography, Toolbar, Button, Box, ThemeProvider, createTheme, CssBaseline} from "@mui/material"
import Link from "next/link"
import HomeIcon from "@mui/icons-material/Home";

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f0f4f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
  },
});

export default function SignUpPage() {
  return (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Container maxWidth="100vw" disableGutters>
      <AppBar position="static" sx={{backgroundColor: "#3f51b5"}}>
        <Toolbar>
          <Typography variant="h6" sx={{
            flexGrow: 1
          }}>
            Text2Card
          </Typography>
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<HomeIcon />}
              sx={{ color: 'white' }}
            >
              Back to Home
            </Button>
          </Link>
        </Toolbar>
      </AppBar>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="calc(100vh - 64px)" // Adjust for AppBar height
        p={3}
      >
        <Typography variant="h4" gutterBottom>Sign In</Typography>
        <SignIn/>
      </Box>
    </Container>
  </ThemeProvider>
  )
}