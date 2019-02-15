import { TextToSpeechV1 } from 'watson-developer-cloud';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { TextToSpeechPayload, TextToSpeechLogin } from '../interfaces/Interface';
dotenv.config();

class TextToSpeechController {
    private textToSpeech: TextToSpeechV1;
    private textToSpeechLogin: TextToSpeechLogin = {
        username: process.env.TEXT_TO_SPEECH_USER,
        password: process.env.TEXT_TO_SPEECH_PASS
    }

    constructor() {
        this.textToSpeech = new TextToSpeechV1(this.textToSpeechLogin);
    }

    /**
     * Handles HTTP request to change text into audio
     * 
     * @param {Request}  req incoming HTTP request
     * @param {Response} res outgoing HTTP response
     * @returns {Promise<any>}
     */
    public async convertToSpeech(req: Request, res: Response): Promise<any> {
        const text: string = req.body.text;

        if(!text) {
            res.send({success: false, error: 'No text was provided'})
            return;
        }

        try {
            const audio = await this.createAudioFromText(text);
            res.set({
                'Content-Type': 'audio/wav'
            })
            .send(audio);
        } catch (error) {
            res.send({success: false, error: error});
        }
    }

    /**
     * Converts text into an audio file
     * 
     * @param {String} text text to change to audio
     * @returns {Promise<Any>} promise with audio buffer
     */
    private createAudioFromText(text: string): Promise<any> {
        const payload: TextToSpeechPayload = {
            accept: 'audio/wav',
            voice: 'en-US_MichaelVoice',
            text
        };

        return new Promise((resolve, reject) => {
            this.textToSpeech.synthesize(payload, (error, audio) => {
                if(error) {
                    return reject(error);
                }

                this.textToSpeech.repairWavHeader(audio);
                resolve(audio);
            });
        });
    }
}

export default new TextToSpeechController();