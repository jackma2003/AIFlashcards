import { SignUp } from "@clerk/nextjs"
import {AppBar, Container, Typography, Toolbar, Button, Box} from "@mui/material"
import Link from "next/link"

export default function SignUpPage() {
  return (
  <Container maxWidth="100vw">
    <AppBar position="static" sx={{backgroundColor: "#3f51b5"}}>
      <Toolbar>
        <Typography variant="h6" s={{
          flexGrow: 1
        }}>
        Text2Card
        </Typography>
      </Toolbar>
    </AppBar>

    <Box
      display = "flex"
      flexDirection = "column"
      alignItems="center"
      justifyContent="center"
      >
        <Typography variant="h4">Sign Up</Typography>
        <SignUp/>
    </Box>
  </Container>
  )
}