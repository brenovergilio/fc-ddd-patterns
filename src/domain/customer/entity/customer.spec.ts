import EventDispatcher from "../../@shared/event/event-dispatcher";
import AddressChangedEvent from "../event/address-changed-event";
import CustomerCreatedEvent from "../event/customer-created-event";
import EnviaConsoleLog1Handler from "../event/envia-console-log-1-handler";
import EnviaConsoleLog2Handler from "../event/envia-console-log-2-handler";
import EnviaConsoleLogHandler from "../event/envia-console-log-handler";
import Address from "../value-object/address";
import Customer from "./customer";

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "John", new EventDispatcher());
    }).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("123", "", new EventDispatcher());
    }).toThrowError("Name is required");
  });

  it("should change name", () => {
    // Arrange
    const customer = new Customer("123", "John", new EventDispatcher());

    // Act
    customer.changeName("Jane");

    // Assert
    expect(customer.name).toBe("Jane");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "Customer 1", new EventDispatcher());
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.Address = address;

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should throw error when address is undefined when you activate a customer", () => {
    expect(() => {
      const customer = new Customer("1", "Customer 1", new EventDispatcher());
      customer.activate();
    }).toThrowError("Address is mandatory to activate a customer");
  });

  it("should deactivate customer", () => {
    const customer = new Customer("1", "Customer 1", new EventDispatcher());

    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "Customer 1", new EventDispatcher());
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });

  it("should register and unregister CustomerCreatedEvent handlers when creating an customer", () => {
    const eventDispatcher = new EventDispatcher();
    const spyEventDispatcherRegister = jest.spyOn(eventDispatcher, "register");
    const spyEventDispatcherUnregister = jest.spyOn(eventDispatcher, "unregister");

    new Customer("1", "Customer 1", eventDispatcher);
    expect(spyEventDispatcherRegister).toHaveBeenCalledWith('CustomerCreatedEvent', expect.any(EnviaConsoleLog1Handler));
    expect(spyEventDispatcherRegister).toHaveBeenCalledWith('CustomerCreatedEvent', expect.any(EnviaConsoleLog2Handler));

    expect(spyEventDispatcherUnregister).toHaveBeenCalledWith('CustomerCreatedEvent', expect.any(EnviaConsoleLog1Handler));
    expect(spyEventDispatcherUnregister).toHaveBeenCalledWith('CustomerCreatedEvent', expect.any(EnviaConsoleLog2Handler));
  });

  it("should notify CustomerCreatedEvent handlers when creating an customer", () => {
    const eventDispatcher = new EventDispatcher();
    const spyEventDispatcherNotify = jest.spyOn(eventDispatcher, "notify");

    new Customer("1", "Customer 1", eventDispatcher);
    expect(spyEventDispatcherNotify).toHaveBeenCalledWith(expect.any(CustomerCreatedEvent));
  });

  it("should register and unregister AddressChangedEvent handlers when changing an address", () => {
    const eventDispatcher = new EventDispatcher();
    const spyEventDispatcherRegister = jest.spyOn(eventDispatcher, "register");
    const spyEventDispatcherUnregister = jest.spyOn(eventDispatcher, "unregister");

    const customer = new Customer("1", "Customer 1", eventDispatcher);
    customer.changeAddress(new Address('new street', 100, 'newzip', 'newcity'));

    expect(spyEventDispatcherRegister).toHaveBeenCalledWith('AddressChangedEvent', expect.any(EnviaConsoleLogHandler));
    expect(spyEventDispatcherRegister).toHaveBeenCalledWith('AddressChangedEvent', expect.any(EnviaConsoleLogHandler));

    expect(spyEventDispatcherUnregister).toHaveBeenCalledWith('AddressChangedEvent', expect.any(EnviaConsoleLogHandler));
    expect(spyEventDispatcherUnregister).toHaveBeenCalledWith('AddressChangedEvent', expect.any(EnviaConsoleLogHandler));
  });

  it("should notify CustomerCreatedEvent handler when changing an address", () => {
    const eventDispatcher = new EventDispatcher();
    const spyEventDispatcherNotify = jest.spyOn(eventDispatcher, "notify");

    const customer = new Customer("1", "Customer 1", eventDispatcher);
    customer.changeAddress(new Address('new street', 100, 'newzip', 'newcity'));
    
    expect(spyEventDispatcherNotify).toHaveBeenCalledWith(expect.any(AddressChangedEvent));
  });
});
