import 'dotenv/config';
import compression from 'compression';
import config from 'config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { initRoutes } from './routes';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(compression());

app.use(cors({ origin: config.get('cors.origin'), credentials: config.get('cors.credentials') }));

app.use(cookieParser());

initRoutes(app);

const port = process.env.PORT || 3000;

export const server = app.listen(port, () => {
  console.log(`App is running at http://localhost:${port} in %s mode`, app.get('env'));
});
