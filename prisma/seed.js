const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const faker = require("faker");

const seed = async () => {
  // Create Users
  const users = [];
  for (let i = 0; i < 5; i++) {
    users.push(
      prisma.user.create({
        data: {
          name: faker.name.findName(),
          email: faker.internet.email(),
        },
      })
    );
  }
  const createdUsers = await Promise.all(users);

  const tracks = [];
  for (let i = 0; i < 20; i++) {
    tracks.push(
      prisma.track.create({
        data: {
          title: faker.lorem.words(),
          artist: faker.name.findName(),
        },
      })
    );
  }
  const createdTracks = await Promise.all(tracks);

  const playlists = [];
  for (let i = 0; i < 10; i++) {
    const owner = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const selectedTracks = createdTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * createdTracks.length) + 1);

    playlists.push(
      prisma.playlist.create({
        data: {
          name: faker.lorem.words(),
          description: faker.lorem.sentence(),
          ownerId: owner.id,
          tracks: {
            create: selectedTracks.map((track) => ({
              trackId: track.id,
            })),
          },
        },
      })
    );
  }
  await Promise.all(playlists);

};

seed()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
