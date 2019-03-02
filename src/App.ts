import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
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
        const port = process.env.PORT || 3000;
        this.app.listen(port, () => console.log(`Server is up and on port ${port}`))
    }
    setRoutes(routes) {
        routes(this.app);
        this.app.use(express.static(__dirname + '/frontend'));
        this.app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname + '/frontend', 'index.html'));
        });
    }
}