import { faker } from '@faker-js/faker';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const projectId = 'tepache-mode';
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
initializeApp({ projectId });

const db = getFirestore();

(async () => {
  try {
    const gameUrn = `urn:tepache-game:${faker.random.numeric(5)}`;

    await db.collection('tepacheGames').add({
      urn: gameUrn,
      title: faker.lorem.word(),
      description: faker.lorem.sentence(),
      active: faker.datatype.boolean(),
      createdAt: Timestamp.now(),
      logo: faker.internet.avatar(),
      playModes: ['TEAM', 'ADMIN_CONTROL'],
    });

    await db.collection('tepacheGameSessions').add({
      urn: `urn:tepache-game-session:${faker.random.numeric(5)}`,
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      logo: faker.internet.avatar(),
      gameUrn,
      state: 'ACTIVE',
      stateHistory: [
        {
          state: 'ACTIVE',
          at: Timestamp.now(),
        },
      ],
      playMode: 'ADMIN_CONTROL',
      expiresAt: Timestamp.now(),
      createdAt: Timestamp.now(),
    });

    console.log('Successfully seeded firestore emulation');
  } catch (error) {
    console.error(error, 'Unable to seed firestore emulation');
  }
})();
