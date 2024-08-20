"use client"
import { useUser } from "@clerk/nextjs"
import { doc, collection, setDoc, getDoc, writeBatch } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { db } from "@/firebase"
import { 
  Box, Paper, TextField, Container, Typography, Button, CardActionArea, CardContent, 
  Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, Grid, Card,
  ThemeProvider, createTheme, CssBaseline
} from "@mui/material"

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
      default: '#f0f4f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
});

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState("")
    const [name, setName] = useState("")
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        fetch("api/generate", {
            method: "POST",
            body: text,
        })
        .then((res) => res.json())
        .then((data) => setFlashcards(data))
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    } 

    const handleClose = () => {
        setOpen(false)
    } 

    const saveFlashcards = async () => {
        if (!name) {
            alert("Please enter a name")
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, "users"), user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert("Flashcard collection with the same name already exists")
                return 
            }
            else {
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        }
        else {
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push("/flashcard")
    }

    return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box 
          sx={{
            mt: 8, 
            mb: 6, 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center"
        }}>
          <Typography variant="h4" gutterBottom color="primary">Generate Flashcards</Typography>
          <Paper sx={{ p: 4, width: "100%", borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <TextField 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              label="Enter text"
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              sx={{
                mb: 3
              }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSubmit} 
              fullWidth
              size="large"
              sx={{ py: 1.5 }}
            >
              Generate Flashcards
            </Button>
          </Paper>
        </Box>

        {flashcards.length > 0 && (
        <Box sx={{ mt: 8, mb: 8 }}>
          <Typography variant="h5" gutterBottom color="primary">Flashcards Preview</Typography>
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
          <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleOpen}
              size="large"
              sx={{ py: 1.5, px: 4 }}
            >
              Save Flashcards
            </Button>
          </Box>
        </Box>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Save Flashcards</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your flashcards collection
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Collection Name"
              type="text"
              fullWidth 
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={saveFlashcards} color="primary" variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
    )
}