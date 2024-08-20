"use client"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { useSearchParams } from "next/navigation"
import { Box, Container, Typography, Grid, Card, Button } from "@mui/material"
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/navigation'
import Link from "next/link"

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
    const theme = useTheme()
    const router = useRouter()

    const searchParams = useSearchParams()
    const search = searchParams.get("id")

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return
            const colRef = collection(doc(collection(db, "users"), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []

            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() })
            })
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [user, search])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleGoHome = () => {
        router.push('/')
    }

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1">Flashcards</Typography>
                <Link href="/flashcard">
                <Button variant="contained" color="primary">
                    Go Back
                </Button>
                </Link>
            </Box>
            <Grid container spacing={4}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                height: 240,
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                },
                                position: 'relative',
                                transformStyle: 'preserve-3d',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleCardClick(index)}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    transition: 'transform 0.6s',
                                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: theme.palette.background.paper,
                                    padding: 2,
                                    overflowY: 'auto',
                                    '&::-webkit-scrollbar': {
                                        width: '8px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: 'rgba(0,0,0,.2)',
                                        borderRadius: '4px',
                                    },
                                }}
                            >
                                <Typography variant="h6" align="center">
                                    {flashcard.front}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    transition: 'transform 0.6s',
                                    transform: flipped[index] ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: theme.palette.background.paper,
                                    padding: 2,
                                    overflowY: 'auto',
                                    '&::-webkit-scrollbar': {
                                        width: '8px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: 'rgba(0,0,0,.2)',
                                        borderRadius: '4px',
                                    },
                                }}
                            >
                                <Typography variant="body1" align="center">
                                    {flashcard.back}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}