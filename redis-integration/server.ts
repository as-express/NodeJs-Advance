import express from 'express';
import Redis from 'ioredis'
import 'colors'


const app = express();
const hostType = process.env.REDIS_HOST || 'localhost'
const redis = new Redis({
    host: hostType,
    port: 6379
})

const port = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Redis with Express.js and TypeScript!');
});

app.get('/cache', async (req, res) => {
    const cachedData = await redis.get('cachedData');
  
    if (cachedData) {
      res.send(JSON.parse(cachedData));
    } else {
      const dataToCache = { message: 'Data to be cached' };
      await redis.set('cachedData', JSON.stringify(dataToCache), 'EX', 3600); 
      
      res.send(dataToCache);
    }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`.bgGreen);
});

