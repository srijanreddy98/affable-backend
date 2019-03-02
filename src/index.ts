import App from './App';

import { routes } from './Routes/routes';
const app = new App();
app.setRoutes(routes);
app.serve();