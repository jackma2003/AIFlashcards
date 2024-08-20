"use client"
import React from 'react';
import Link from "next/link"
import getStripe from '@/utils/get-stripe';
import { AppBar, Button, Container, Typography, Toolbar, Box, Grid, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Head from "next/head";
import TextFieldsIcon from '@mui/icons-material/TextFields';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DevicesIcon from '@mui/icons-material/Devices';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f0f4f8', // Light blue-gray background
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

const FeatureCard = ({ title, description, icon }) => (
  <Card sx={{
    height: '100%',
    backgroundColor: 'background.paper',
    borderRadius: 2,
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    },
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        {icon}
      </Box>
      <Typography variant="h6" component="h3" gutterBottom sx={{ color: 'primary.main', textAlign: 'center', fontWeight: 600 }}>
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
      title: 'Easy Text Input',
      description: 'Simply input your text and let our software do the rest. Creating flashcards has never been easier.',
      icon: <TextFieldsIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    },
    {
      title: 'Smart Flashcards',
      description: 'Our AI intelligently breaks down your text into concise flashcards, perfect for studying.',
      icon: <PsychologyIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    },
    {
      title: 'Accessible Anywhere',
      description: 'Access your flashcards from any device at any time. Study on the go with ease.',
      icon: <DevicesIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    },
  ];

  return (
    <Box sx={{ py: 10, backgroundColor: 'background.default' }}>
      <Typography variant="h2" component="h2" gutterBottom sx={{ textAlign: 'center', color: 'primary.main', mb: 8 }}>
        Features
      </Typography>
      <Grid container spacing={6}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <FeatureCard {...feature} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "What is Text2Card?",
      answer: "Text2Card is a platform that helps you create flashcards intelligently. It uses AI to generate flashcards from your notes and documents."
    },
    {
      question: "How do I create flashcards?",
      answer: "To create flashcards, simply input your text into our system. Our AI will then analyze the content and generate appropriate flashcards for you."
    },
    {
      question: "How does the application work?",
      answer: "The application uses advanced natural language processing to understand your text and extract key concepts. It then transforms these concepts into question-answer pairs suitable for flashcards."
    },
    {
      question: "How do I upgrade my account?",
      answer: "To upgrade your account, go to the pricing section and purchase one of our subscriptions. You can choose between our Basic and Pro plans."
    }
  ];

  return (
    <Box sx={{ my: 10, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "primary.main", mb: 6 }}>
        Frequently Asked Questions
      </Typography>
      {faqs.map((faq, index) => (
        <Accordion key={index} sx={{
          backgroundColor: "background.paper",
          color: "text.primary",
          "&:before": {
            display: "none",
          },
          boxShadow: "none",
          "& .MuiAccordionSummary-root": {
            borderBottom: "1px solid",
            borderColor: "divider",
          },
        }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}a-content`}
            id={`panel${index}a-header`}
          >
            <Typography sx={{ fontWeight: 600 }}>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default function Home() {
  const handleSubmit = async (planType) => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "https://text2card-mu-inky.vercel.app/",
      },
      body: JSON.stringify({planType})
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

  {/*Front End*/}
  return(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <Head>
          <title>Text2Card - Create Flashcards Easily</title>
          <meta name="description" content="Create flashcards from your text effortlessly with AI-powered Text2Card"/>
        </Head>

        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            <Typography variant="h6" style={{flexGrow: 1, fontWeight: 700}}>Text2Card</Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in">Login</Button>
              <Button color="inherit" href="/sign-up" variant="outlined" sx={{ ml: 2 }}>Sign Up</Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        <Box 
          sx={{
            textAlign: "center",
            py: 12,
            backgroundColor: 'primary.main',
            color: 'white',
          }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Welcome to Text2Card
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            The easiest way to make flashcards from your text
          </Typography>
          <Grid item xs={12} sm={6} md={4}>
          <Link href="/generate" passHref>
            <Button variant="contained" color="secondary" size="large" sx={{ mt: 2, py: 1.5, px: 4 }}>
              Get Started
            </Button>
          </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
          <Link href="/flashcard" passHref>
            <Button variant="contained" color="secondary" size="large" sx={{ mt: 2, py: 1.5, px: 4 }}>
              View Flashcard Collection
            </Button>
          </Link>
          </Grid>
        </Box>

        <FeaturesSection />

        <Box sx={{ my: 10, textAlign: "center", backgroundColor: 'background.paper', py: 10 }}>
          <Typography variant="h2" sx={{ mb: 8, color: 'primary.main' }}>Pricing</Typography>
          <Grid container spacing={6} justifyContent="center">
            <Grid item xs={12} md={5}>
              <Card sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              }}>
                <div>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                    Basic
                  </Typography>
                  <Typography variant="h3" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                    $5 / month
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 4 }}>
                    Access to basic flashcard features and limited storage.
                  </Typography>
                </div>
                <Button variant="outlined" color="primary" size="large" sx={{ mt: 2 }} onClick={() => handleSubmit("basic")}>
                  Choose Basic
                </Button>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                borderColor: 'primary.main',
                borderWidth: 2,
                borderStyle: 'solid',
              }}>
                <div>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                    Pro
                  </Typography>
                  <Typography variant="h3" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                    $10 / month
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 4 }}>
                    Unlimited flashcards and storage, with priority support.
                  </Typography>
                </div>
                <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }} onClick={() => handleSubmit("pro")}>
                  Choose Pro
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <FAQSection />

        <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', py: 6, textAlign: 'center' }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Text2Card. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  )
}