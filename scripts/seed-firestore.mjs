import { faker } from '@faker-js/faker';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const projectId = 'tepache-mode';
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
initializeApp({ projectId });

const db = getFirestore();

(async () => {
  try {
    await db.collection('tepacheGames').add({
      urn: `urn:tepache-game:${faker.random.numeric(5)}`,
      title: faker.lorem.word(),
      description: faker.lorem.sentence(),
      active: faker.datatype.boolean(),
      createdAt: Timestamp.now(),
      logo: faker.internet.avatar(),
      playModes: ['TEAM', 'ADMIN_CONTROL'],
    });

    console.log('Successfully seeded firestore emulation');
  } catch (error) {
    console.error(error, 'Unable to seed firestore emulation');
  }
})();
