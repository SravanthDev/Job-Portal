const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);

// middlewares
app.use(cors());
app.use(express.json());

// routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const realJobsRoutes = require('./routes/realJobs');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/realjobs', realJobsRoutes);

app.get('/', (req, res) => res.send({ ok: true }));

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
