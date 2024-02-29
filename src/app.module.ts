import { HttpStatus, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { appConstants } from './lib/constants';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      formatError: (err) => {
        const originalError = (err.extensions as any)?.originalError;
        if (originalError && originalError.statusCode) {
          return {
            message: originalError.message,
            statusCode: originalError.statusCode,
            error: originalError.error,
          };
        } else {
          return {
            message: err.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          };
        }
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ProductModule,
    AuthModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
