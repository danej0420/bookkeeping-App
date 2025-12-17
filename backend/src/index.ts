import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import transactionsRoutes from './routes/transactions';
import accountsRoutes from './routes/accounts';
import summaryRoutes from './routes/summary';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Root handler helps verify the API is running
app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Bookkeeping API is running' });
});

// Register route modules
app.use('/auth', authRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/accounts', accountsRoutes);
app.use('/summary', summaryRoutes);

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
