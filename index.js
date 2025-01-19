const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    include: { playlists: true },
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

app.get("/playlists", async (req, res) => {
  const playlists = await prisma.playlist.findMany();
  res.json(playlists);
});

app.post("/playlists", async (req, res) => {
  const { name, description, ownerId, trackIds } = req.body;
  try {
    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        ownerId,
        tracks: {
          create: trackIds.map((trackId) => ({ trackId })),
        },
      },
    });
    res.json(playlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/playlists/:id", async (req, res) => {
  const { id } = req.params;
  const playlist = await prisma.playlist.findUnique({
    where: { id: parseInt(id) },
    include: { tracks: { include: { track: true } } },
  });
  if (!playlist) return res.status(404).json({ error: "Playlist not found" });
  res.json(playlist);
});

app.get("/tracks", async (req, res) => {
  const tracks = await prisma.track.findMany();
  res.json(tracks);
});

app.get("/tracks/:id", async (req, res) => {
  const { id } = req.params;
  const track = await prisma.track.findUnique({
    where: { id: parseInt(id) },
  });
  if (!track) return res.status(404).json({ error: "Track not found" });
  res.json(track);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
