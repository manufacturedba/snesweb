import { faker } from '@faker-js/faker';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync, writeFileSync } from 'fs';
import { getAuth } from 'firebase-admin/auth';

const ONLY_SEED_EMPTY = process.env.ONLY_SEED_EMPTY;

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

const configFile = 'remote_config.json';
const projectId = 'tepache-mode';
initializeApp({ projectId });

const db = getFirestore();
const auth = getAuth();

(async () => {
  try {
    const allUsers = await auth.listUsers(1000);

    const litmus = await db.collection('tepacheGames').get();

    if (litmus.size > 0 && ONLY_SEED_EMPTY) {
      console.log('Database is not empty, skipping seed');
      return;
    }

    const gameUrn = `urn:tepache-game:${faker.random.numeric(5)}`;
    const gameSessionUrn = `urn:tepache-game-session:${faker.random.numeric(
      5
    )}`;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const expiresAt = Timestamp.fromDate(tomorrow);

    await db.collection('tepacheGames').add({
      urn: gameUrn,
      title: faker.lorem.word(),
      description: faker.lorem.sentence(),
      active: true,
      createdAt: Timestamp.now(),
      logo: faker.internet.avatar(),
      playModes: ['TEAM', 'ADMIN_CONTROL'],
    });

    await db.collection('tepacheGameSessions').add({
      urn: gameSessionUrn,
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
      expiresAt,
      createdAt: Timestamp.now(),
    });

    allUsers.users.forEach((user) => {
      db.collection('tepacheAdmins').doc(user.uid).set({
        role: 1,
      });
    });

    const config = JSON.parse(readFileSync(configFile, 'utf8'));

    config.game_session_urn = gameSessionUrn;

    writeFileSync(configFile, JSON.stringify(config, null, 2), 'utf8');

    console.log('Successfully seeded firestore emulation');
  } catch (error) {
    console.error(error, 'Unable to seed firestore emulation');
  }
})();
