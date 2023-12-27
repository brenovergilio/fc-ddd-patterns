import EventInterface from "../../@shared/event/event.interface";
import Address from "../value-object/address";

export interface AddressChangedEventData {
  id: string,
  name: string,
  address: Address
}

export default class AddressChangedEvent implements EventInterface {
  dataTimeOccurred: Date;

  constructor(public eventData: AddressChangedEventData) {
    this.dataTimeOccurred = new Date();
  }
}