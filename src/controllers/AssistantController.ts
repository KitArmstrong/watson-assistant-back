import { AssistantV1 } from 'watson-developer-cloud';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { AssistantMessagePayload } from '../interfaces/Interface';
dotenv.config();

class AssistantController {
    private assistant: AssistantV1;
    private assistantLogin: AssistantV1.Options = {
        username: process.env.ASSISTANT_ENG_USER as string,
        password: process.env.ASSISTANT_ENG_PASS as string,
        version:  process.env.ASSISTANT_VERSION as string
    }
    private workspace = process.env.ASSISTANT_ENG_WORKSPACE as string;
    
    constructor() {
        this.assistant = new AssistantV1(this.assistantLogin);
    }

    /**
     * Handles HTTP request for assistant conversation
     * 
     * @param {Request} req incoming HTTP request 
     * @param {Response} res outgoing HTTP response
     * @returns {Promise<any>}
     */
    public async converse(req: Request, res: Response): Promise<any> {
        const { message, context } = req.body;

        try {
            const response = await this.sendMessage(message, context, this.workspace);
            res.send({success: true, output: response.output, context: response.context});
        } catch (error) {
            res.send({success: false, error});
        }
    }

    /**
     * Sends a message to Watson Assistant
     * 
     * @param {String} message 
     * @param {Object} context 
     * @param {String} workspace
     * @returns {Promise<AssistantV1.MessageResponse>} promise containing response message
     */
    private sendMessage(message: string, context: Object | undefined = undefined, workspace: string): Promise<AssistantV1.MessageResponse> {
        return new Promise((resolve, reject) => {
            const payload: AssistantMessagePayload = {
                workspace_id: workspace,
                input: {
                     text: message
                },
                context: context
            }

            this.assistant.message(payload, (error, response) => {
                if(error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    }
}

export default new AssistantController();