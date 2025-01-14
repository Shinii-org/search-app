import app from './app';
import { PORT } from './config';

app
  .listen(PORT, () => {
    console.info(`server running on port : ${PORT}`);

  })
  .on('error', (e) => console.error(e));
