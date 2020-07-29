import express from 'express';
import cors from 'cors';
import { parse } from './parse.js';

const port = 3000
const app = express();

app.use(cors());

app.get('/parse', async (req, res) => {
  const result = await parse();
  res.json(result);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
