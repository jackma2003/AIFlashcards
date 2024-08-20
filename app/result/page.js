"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import getStripe from "@/utils/get-stripe"
import { CircularProgress, Typography, Container, Box, Paper, Button, Fade } from "@mui/material"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Link from "next/link"

const ResultPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get("session_id")

    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) return 

            try {
                const res = await fetch(`/api/checkout_session?session_id=${session_id}`)
                const sessionData = await res.json()
                if (res.ok) {
                    setSession(sessionData)
                } else {
                    setError(sessionData.error || "Payment failed")
                }
            } catch (err) {
                setError("An error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchCheckoutSession()
    }, [session_id])

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ 
                height: '100vh', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center' 
            }}>
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" sx={{ mt: 2 }}>Processing your payment...</Typography>
            </Container>
        )
    }

    const Content = () => {
        if (error || !session) {
            return (
                <>
                    <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                    <Typography variant="h4" gutterBottom>Payment Failed</Typography>
                    <Typography variant="body1" paragraph>
                        We're sorry, but your payment was not successful. Please try again or contact support if the problem persists.
                    </Typography>
                    <Button variant="contained" color="primary" component={Link} href="/">
                        Return to Home
                    </Button>
                </>
            )
        }

        return (
            <>
                <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom>Thank You for Your Purchase!</Typography>
                <Typography variant="body1" paragraph>
                    Your payment was successful. You will receive an email with the order details shortly.
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Session ID: {session_id}
                </Typography>
                <Button variant="contained" color="primary" component={Link} href="/" sx={{ mt: 2 }}>
                    Go Back Home
                </Button>
            </>
        )
    }

    return (
        <Container maxWidth="sm" sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            py: 4
        }}>
            <Fade in={!loading}>
                <Paper elevation={3} sx={{ 
                    p: 4, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    textAlign: 'center',
                    maxWidth: 400,
                    width: '100%'
                }}>
                    <Content />
                </Paper>
            </Fade>
        </Container> 
    )
}

export default ResultPage