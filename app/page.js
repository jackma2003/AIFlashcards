"use client"
import React from 'react';
import Link from "next/link"
import getStripe from '@/utils/get-stripe';
import { AppBar, Button, Container, Typography, Toolbar, Box, Grid, Card, CardContent } from '@mui/material';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Head from "next/head";
import TextFieldsIcon from '@mui/icons-material/TextFields';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DevicesIcon from '@mui/icons-material/Devices';


{/*UI for the features section*/}
const FeatureCard = ({ title, description, icon }) => (
  <Card sx={{
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 2,
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    },
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        {icon}
      </Box>
      <Typography variant="h6" component="h3" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const FeaturesSection = () => {
  const features = [
    {
      title: 'Easy Text input',
      description: 'Simply input your text and let our software do the rest. Creating flashcards has never been easier.',
      icon: <TextFieldsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: 'Smart Flashcards',
      description: 'Our AI intelligently breaks down your text into concise flashcards, perfect for studying',
      icon: <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: 'Accessible Anywhere',
      description: 'Access your flashcards from any device at anytime. Study on the go with ease.',
      icon: <DevicesIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
  ];


  return (
    <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
      <Typography variant="h2" component="h2" gutterBottom sx={{ textAlign: 'center', color: 'primary.main', mb: 6 }}>
        Features
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <FeatureCard {...feature} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};


{/* Front-end */}
export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
      }
    }) 
    
    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return 
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    })

    if (error) {
      console.warn(error.message)
    }
  }

  return(
    <Container maxWidth="100vw">
      <Head>
        <title>Text2Card</title>
        <meta name="description" content="Create Flashcards from your text"/>
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}}>Text2Card</Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton></UserButton>
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box 
        sx={{
          textAlign: "center",
          my: 4,
        }}>
        <Typography variant="h2" gutterBottom>
          Welcome to Text2Card
        </Typography>
        <Typography variant="h5" gutterBottom>
          {" "}
          The easiest way to make flashcards from your text
        </Typography>
        <Link href="/generate" passHref>
        <Button variant="contained" color="primary" sx={{mt: 2}}>
          Get Started
        </Button>
        </Link>
      </Box>

      <FeaturesSection />

      <Box sx={{my: 6, textAlign: "center"}}>
        <Typography variant="h4">Pricing</Typography>
        <Box sx={{my: 6}}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{
                p: 3,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2,
              }}>
                <Typography variant="h5" gutterBottom>
                  Basic
                </Typography>
                <Typography variant="h6" gutterBottom>
                  $5 / month
                </Typography>
                <Typography>
                  {" "}
                  Access to basic flashcard features and limited storage.
                </Typography>
                <Button variant="contained" color="primary" sx={{mt: 2}} onClick={handleSubmit}>
                  Choose Basic
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{
                p: 3,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2,
              }}>
                <Typography variant="h5" gutterBottom>
                  Pro
                </Typography>
                <Typography variant="h6" gutterBottom>
                  $10 / month
                </Typography>
                <Typography>
                  {" "}
                  Unlimited flashcards and storage, with priority support.
                </Typography>
                <Button variant="contained" color="primary" sx={{mt: 2}} onClick={handleSubmit}>
                  Choose Pro
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}