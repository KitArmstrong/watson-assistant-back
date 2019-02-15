export interface TextToSpeechPayload {
    accept: string,
    voice: string,
    text: string
}

export interface TextToSpeechLogin {
    username: string | undefined,
    password: string | undefined
}

export interface SpeechToTextLogin {
    username: string | undefined,
    password: string | undefined,
    url: string | undefined
}

export interface AssistantMessagePayload {
    workspace_id: string,
    input: {
            text: string
    },
    context: Object | undefined
}