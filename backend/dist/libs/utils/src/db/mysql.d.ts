import { FindOperator } from 'typeorm';
import { Uuid } from '@lib/utils';
export declare const UuidTransformer: {
    to: (value: Uuid | FindOperator<Uuid[]>) => string | FindOperator<any>;
    from: (value: string) => Uuid;
};
