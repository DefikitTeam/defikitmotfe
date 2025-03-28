import { MessagePair } from "@/src/stores/pool/type";

export function mapMessageExamples(
    rawExamples: string[],
    nameAgent: string
): MessagePair[] {
    const mappedExamples: MessagePair[] = [];

    for (let i = 0; i < rawExamples.length; i += 2) {
        const userMessage = rawExamples[i];
        const agentMessage = rawExamples[i + 1];

        const userText = userMessage.replace(/User: "/, '').replace(/"$/, '');
        const agentText = agentMessage.replace(/Me: "/, '').replace(/"$/, '');

        const messagePair: MessagePair = [
            {
                user: `user${i + 1}`,
                content: {
                    text: userText
                }
            },  
            {
                user: nameAgent,
                content: {
                    text: agentText
                }
            }
        ];

        mappedExamples.push(messagePair);


        
    }

    return mappedExamples;
}
