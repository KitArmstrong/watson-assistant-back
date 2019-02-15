import { SpeechToTextV1 } from 'watson-developer-cloud';
import { Response, Request } from 'express';
import * as dotenv from 'dotenv';
import * as stream from 'stream';
import { SpeechToTextLogin } from '../interfaces/Interface';
dotenv.config();

class SpeechToTextController {
    private speechToText: SpeechToTextV1;
    private speechToTextLogin: SpeechToTextLogin = {
        username: process.env.SPEECH_TO_TEXT_USER,
        password: process.env.SPEECH_TO_TEXT_PASS,
        url: process.env.SPEECH_TO_TEXT_URL
      }

    constructor() {
        this.speechToText = new SpeechToTextV1(this.speechToTextLogin);
    }

    /**
     * Handles HTTP request to convert speech into text
     * 
     * @param {Requst} req incoming HTTP request 
     * @param {Response} res outgoing HTTP response
     * @returns {Promise<any>}
     */
    public async convertAudio(req: Request, res: Response): Promise<any> {
        const file: Express.Multer.File = req.file;

        if(!file) {
            res.send({success: false, error: 'No audio was provided'});
            return;
        }

        try {
            const text = await this.processAudio(file.buffer);
            res.send({sucess: true, text});
        } catch (error) {
            res.send({success: false, error});
        }
    }

    /**
     * Processes the audio and returns the converted text
     * 
     * @param {Buffer} audio buffer containing audio to transcribe
     * @returns {Promise<any>} promise containing transcribed text
     */
    private processAudio(audioBuffer: Buffer): Promise<any> {
        const bufferStream: stream.PassThrough = new stream.PassThrough();
        const params = {
            content_types: 'audio/wav'
        }
        const reconizeStream = this.speechToText.recognizeUsingWebSocket(params);

        bufferStream.end(audioBuffer);
        bufferStream.pipe(reconizeStream);

        // Get strings instead of buffers from 'data' events
        reconizeStream.setEncoding('utf8');

        return new Promise((resolve, reject) => {
            reconizeStream.on('data', text => {
                return resolve(text);
            });

            reconizeStream.on('error', error => {
                return reject(error);
            });

            reconizeStream.on('close', () => {
                return resolve('');
            });
        });
    }
}

export default new SpeechToTextController();