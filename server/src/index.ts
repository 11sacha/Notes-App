import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
const port = 1234;

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get('/api/notes', async (req, res) => {
    const notes = await prisma.note.findMany();
    res.json(notes);
});

app.post('/api/notes', async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res
            .status(400)
            .send("Title or content fiedls are required.")
    };

    try {
        const note = await prisma.note.create({
            data: {
                title,
                content
            },
        });
        res.json(note);
    } catch (error) {
        res
            .status(500)
            .send("Server error..")
        console.log(error)
    }
});

app.put('/api/notes/:id', async (req, res) => {
    const { title, content } = req.body
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
        return res
            .status(400)
            .send("ID must be a valid number.")
    }

    try {
        const updateNote = await prisma.note.update({
            where: { id },
            data: { title, content }
        })
        res.json(updateNote)
    } catch (error) {
        res
            .status(500)
            .send("Server error..")
        console.log(error)
    };
});

app.delete('/api/notes/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
        return res
            .status(400)
            .send("ID must be a valid number.")
    }

    try {
        const deleteNote = await prisma.note.delete({
            where: { id },
        })
        res.status(204).send();
    } catch (error) {
        res
            .status(500)
            .send("Server error..")
        console.log(error)
    };
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
});
