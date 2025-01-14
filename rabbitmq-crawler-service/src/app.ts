import express  from 'express';
import routes from './routes';
import { setupRabbitMQ } from './utils/rabbit-mq';
import { startWorker } from './utils/worker';

process.on('uncaughtException', (e) => {
  console.error(e);
});
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(
  express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
);
setupRabbitMQ()
  .then(() => {
    console.log("RabbitMQ setup completed.");
    startWorker().then(() => console.log("Worker started successfully."));
  })
  .catch((error) => console.error("Error initializing RabbitMQ or Worker:", error));
// Routes
app.use('/', routes);
export default app;
