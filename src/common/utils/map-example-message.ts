import { IMessageExample } from '@/src/stores/pool/type';

export function mapMessageExamples(
    rawExamples: string[],
    nameAgent: string
): IMessageExample[] {
    const mappedExamples: IMessageExample[] = [];

    for (let i = 0; i < rawExamples.length; i += 2) {
        const userMessage = rawExamples[i];
        const agentMessage = rawExamples[i + 1];

        const userText = userMessage.replace(/User: "/, '').replace(/"$/, '');
        const agentText = agentMessage.replace(/Me: "/, '').replace(/"$/, '');

        mappedExamples.push({
            user: {
                user: `user${i + 1}`,
                content: {
                    text: userText
                }
            },
            agent: {
                user: nameAgent,
                content: {
                    text: agentText
                }
            }
        });
    }

    return mappedExamples;
}
