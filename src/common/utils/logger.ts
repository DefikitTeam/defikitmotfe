import { isDev, LOG_LEVEL } from '../web3/constants/env';
import { pino } from 'pino';

export const logger = pino({
    level: LOG_LEVEL,
    transport: {
        targets: [
            ...(isDev
                ? [
                      {
                          target: 'pino-pretty',
                          level: LOG_LEVEL,
                          options: {
                              ignore: 'pid,hostname',
                              colorize: true,
                              translateTime: true
                          }
                      }
                  ]
                : [
                      {
                          target: 'pino/file',
                          level: LOG_LEVEL,
                          options: {}
                      }
                  ])
        ]
    }
});
