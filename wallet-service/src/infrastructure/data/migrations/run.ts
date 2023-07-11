import 'dotenv/config';
import * as fs from 'fs';
import { join } from 'path';
import { Client } from 'pg';
import { environment } from '../../config/environment.config';

const client = new Client({
  connectionString: environment().databaseUrl,
});

client.connect().then(async () => {
  const files = fs.readdirSync(__dirname);

  for (const file of files) {
    if (file.includes('.ts')) continue;

    const sql = fs.readFileSync(join(__dirname, file)).toString();

    try {
      await client.query(sql);
    } catch (err) {
      console.log(`Current file ${file}`);
      console.log(err);

      await client.end();
    }
  }

  await client.end();
});
