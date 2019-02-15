import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import router from './MainRouter';
dotenv.config();

class App {
    private _app: express.Application;

    constructor() {
        this._app = express();
        this.config();
    }

    private config(): void {
        // Set for JSON responses
        this._app.use(bodyParser.json());
        // Set all routes to use api version prefix
        this._app.use(process.env.API_URL as string, router);
        // Start server
        this._app.listen(process.env.PORT || 3000);
    }

    get app(): express.Application {
        return this._app;
    }
}

export default new App().app;