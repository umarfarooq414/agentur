import * as uuid from 'uuid';

export class Uuid {
  uuid: string;
  constructor(uuidString?: string) {
    if (!uuidString) {
      this.uuid = uuid.v4();
      return;
    } 
    if((uuidString as any).uuid) uuidString = (uuidString as any).uuid; 
    const isValidUuid = uuid.validate(uuidString);
    if (!isValidUuid) throw Error(`Uuid not valid`);
    this.uuid = uuidString;
  }
}
