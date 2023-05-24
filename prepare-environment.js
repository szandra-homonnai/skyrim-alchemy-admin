const dotenv = require('dotenv');
const fs = require('fs');

const targetPath = './src/environments/environment.ts';
const envPath = './src/environments/.env';

dotenv.config({ path: envPath });

const environmentFile = `
import { Environment } from '@environments/environment.interface';

export const environment: Environment = {
  firebase: {
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    appId: '${process.env.FIREBASE_APP_ID}',
    databaseURL: '${process.env.FIREBASE_DATABASE_URL}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    locationId: '${process.env.FIREBASE_LOCATION_ID}',
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}'
  }
};
`;

fs.writeFile(targetPath, environmentFile, 'utf8', (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log(`${targetPath} has been successfully updated.`);
  }
});
