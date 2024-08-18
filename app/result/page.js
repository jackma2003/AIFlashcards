"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import getStripe from "@/utils/get-stripe"
import { CircularProgress, Typography, Container, Box } from "@mui/material"

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
            <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
                <CircularProgress />
                <Typography variant="h6">Loading...</Typography>
            </Container>
        )
    }

    if (error || !session) {
        return (
            <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h4">Payment Failed</Typography>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">
                        Your payment was not successful. Please try again.
                    </Typography>
                </Box>
            </Container>
        )
    }

    return (
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h4">Thank you for your purchase!</Typography>
            <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Session ID: {session_id}</Typography>
                <Typography variant="body1">
                    We have received your payment. You will receive an email with the order details shortly.
                </Typography>
            </Box>
        </Container> 
    )
}

export default ResultPage