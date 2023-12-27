import EventDispatcherInterface from "../../@shared/event/event-dispatcher.interface";
import AddressChangedEvent, { AddressChangedEventData } from "../event/address-changed-event";
import CustomerCreatedEvent from "../event/customer-created-event";
import EnviaConsoleLog1Handler from "../event/envia-console-log-1-handler";
import EnviaConsoleLog2Handler from "../event/envia-console-log-2-handler";
import EnviaConsoleLogHandler from "../event/envia-console-log-handler";
import Address from "../value-object/address";

export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string, public eventDispatcher: EventDispatcherInterface) {
    this._id = id;
    this._name = name;
    this.validate();

    this.dispatchCustomerCreatedEvent();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }
  
  changeAddress(address: Address) {
    this._address = address;

    this.dispatchAddressChangedEvent();
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }

  private dispatchCustomerCreatedEvent() {
    const customerCreatedHandler1 = new EnviaConsoleLog1Handler();
    const customerCreatedHandler2 = new EnviaConsoleLog2Handler();

    this.eventDispatcher.register('CustomerCreatedEvent', customerCreatedHandler1);
    this.eventDispatcher.register('CustomerCreatedEvent', customerCreatedHandler2);

    this.eventDispatcher.notify(new CustomerCreatedEvent());

    this.eventDispatcher.unregister('CustomerCreatedEvent', customerCreatedHandler1);
    this.eventDispatcher.unregister('CustomerCreatedEvent', customerCreatedHandler2);
  }

  private dispatchAddressChangedEvent() {
    const eventData: AddressChangedEventData = {
      id: this._id,
      name: this._name,
      address: this._address
    };

    const addressChangedHandler = new EnviaConsoleLogHandler();

    this.eventDispatcher.register('AddressChangedEvent', addressChangedHandler);
    this.eventDispatcher.notify(new AddressChangedEvent(eventData));
    this.eventDispatcher.unregister('AddressChangedEvent', addressChangedHandler);
  }
}
