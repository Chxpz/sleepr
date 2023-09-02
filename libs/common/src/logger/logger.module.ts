import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import PinoPretty from 'pino-pretty';

@Module({
    imports:[
        PinoLoggerModule.forRoot({
            pinoHttp: {
              transport:{
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                }
              }
            }
          })
    ]
    
})
export class LoggerModule {}
