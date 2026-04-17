import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import type { Request, Response } from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';
import cors from 'cors';

dotenv.config();

// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

const startApolloServer = async () => {
  await server.start();
  await db();

  const app = express();
  const allowedOrigins = [
    'https://roam-sigma.vercel.app',
    'http://localhost:8081',
    'http://localhost:3000',
    'http://localhost:19006',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (native mobile apps, Postman, curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origin ${origin} not allowed`));
      },
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Authorization', 'Content-Type'],
      credentials: true,
    })
  );
  const PORT = process.env.PORT || 3001;

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // ── External API proxy routes ─────────────────────────────────
  // Keeps API keys server-side and avoids CORS issues with external APIs.

  app.get('/api/nps', async (req: Request, res: Response) => {
    try {
      const params = new URLSearchParams();
      params.set('api_key', process.env.NPS_API_KEY ?? '');
      params.set('limit', String(req.query.limit ?? '100'));

      if (req.query.id) {
        // Fetch by UUID — NPS uses `id`, not `parkCode` (parkCode is the short code like "abli")
        params.set('id', String(req.query.id));
      } else {
        if (req.query.stateCode) params.set('stateCode', String(req.query.stateCode));
        if (req.query.q)         params.set('q', String(req.query.q));
      }

      const upstream = await fetch(
        `https://developer.nps.gov/api/v1/parks?${params.toString()}`
      );
      const data = await upstream.json();
      res.json(data);
    } catch (err) {
      console.error('NPS proxy error:', err);
      res.status(502).json({ error: 'NPS proxy failed' });
    }
  });

  app.get('/api/ridb', async (req: Request, res: Response) => {
    try {
      const params = new URLSearchParams();
      params.set('apikey', process.env.RIDB_API_KEY ?? '');
      params.set('limit', String(req.query.limit ?? '50'));

      if (req.query.state) params.set('state', String(req.query.state));
      if (req.query.query) params.set('query', String(req.query.query));

      const upstream = await fetch(
        `https://ridb.recreation.gov/api/v1/facilities?${params.toString()}`
      );
      const data = await upstream.json();
      res.json(data);
    } catch (err) {
      console.error('RIDB proxy error:', err);
      res.status(502).json({ error: 'RIDB proxy failed' });
    }
  });

  app.get('/api/weather', async (req: Request, res: Response) => {
    try {
      const lat = req.query.lat;
      const lon = req.query.lon;
      if (!lat || !lon) {
        res.status(400).json({ error: 'lat and lon are required' });
        return;
      }
      const params = new URLSearchParams({
        key: process.env.WEATHER_API_KEY ?? '',
        q: `${lat},${lon}`,
      });
      const upstream = await fetch(
        `https://api.weatherapi.com/v1/current.json?${params.toString()}`
      );
      const data = await upstream.json();
      res.json(data);
    } catch (err) {
      console.error('Weather proxy error:', err);
      res.status(502).json({ error: 'Weather proxy failed' });
    }
  });

  // ─────────────────────────────────────────────────────────────

  app.use(
    '/graphql',
    expressMiddleware(server as any, {
      context: authenticateToken as any,
    })
  );

  // Serve static assets in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
