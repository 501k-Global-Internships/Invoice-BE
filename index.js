import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import scheduleInvoice from './utils/invoice-overdue-schedule';
import routes from './routes/routes';

const dotenv = require('dotenv');

dotenv.config();

const app = express();

const corsOptions = {
  origin: '*',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(express.json());

const port = 8080;

// Homepage route
app.get('/', (req, res) => {
  res.send('Welcome to Invoice');
});

routes(app);

scheduleInvoice();

app.listen(port, () => console.log(`index app listening on http://localhost:${port}`));
