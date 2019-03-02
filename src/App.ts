import * as express from 'express';
import * as bodyParser from 'body-parser';

export default class App {
    app: any;
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json({
        parameterLimit: 1000000,
        limit: '50mb',
        extended: true
        }));
        this.app.use(bodyParser.urlencoded({
        parameterLimit: 1000000,
        limit: '50mb',
        extended: true
        }));
    }
    serve() {
        this.app.listen(3000, () => console.log('Server is up and on port 3000'))
    }
    setRoutes(routes) {
        routes(this.app);
    }
}