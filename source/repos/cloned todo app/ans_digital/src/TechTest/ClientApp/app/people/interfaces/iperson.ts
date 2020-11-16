import { IColour } from './icolour';

export interface IPerson {
    id: number;
    firstName: string;
    lastName: string;
    authorised: boolean;
    enabled: boolean;
    colours: IColour[];
}
