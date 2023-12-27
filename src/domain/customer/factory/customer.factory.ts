import Customer from "../entity/customer";
import { v4 as uuid } from "uuid";
import Address from "../value-object/address";
import EventDispatcherInterface from "../../@shared/event/event-dispatcher.interface";
import EventDispatcher from "../../@shared/event/event-dispatcher";

export default class CustomerFactory {
  public static create(name: string, eventDispatcher: EventDispatcherInterface = new EventDispatcher()): Customer {
    return new Customer(uuid(), name, eventDispatcher);
  }

  public static createWithAddress(name: string, address: Address, eventDispatcher: EventDispatcherInterface = new EventDispatcher()): Customer {
    const customer = new Customer(uuid(), name, eventDispatcher);
    customer.changeAddress(address);
    return customer;
  }
}
