require('dotenv').config();
const port = process.env.port || 3000;
const app = (require('connect'))()
    .use(require('./middleware/auth'))
    .use(require('./middleware/body'))
    .use(require('./middleware/router'))
    .listen(port);

console.log(`Server running at https://localhost:${port}/`);
