import * as express from 'express';
import * as multer from 'multer';
import TextToSpeechController from './controllers/TextToSpeechController';
import SpeechToTextController from './controllers/SpeechToTextController';
import AssistantController from './controllers/AssistantController';

class MainRouter {
    private _router: express.Router;
    private storage: multer.StorageEngine;
    private upload: multer.Instance;

    constructor() {
        this._router = express.Router();
        this.storage = multer.memoryStorage();
        this.upload = multer({storage: this.storage});
        this.configRoutes();
    }

    private configRoutes(): void {
        this._router.post('/texttospeech', (req: express.Request, res: express.Response) => {
            TextToSpeechController.convertToSpeech(req, res);
        });
       this._router.post('/speechtotext', this.upload.single('audio'), (req: express.Request, res: express.Response) => {
           SpeechToTextController.convertAudio(req, res);
       });
       this._router.post('/assistant-send',(req: express.Request, res: express.Response) => {
            AssistantController.converse(req, res);
       });
    }

    get router(): express.Router {
        return this._router;
    } 
}

export default new MainRouter().router;