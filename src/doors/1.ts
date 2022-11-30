import { AbstractDoor } from '../lib/AbstractDoor';

export default class DoorOne extends AbstractDoor {
  public async run() {
    console.log('Running!');
  }
}
