import EventHandlerInterface from "../../@shared/event/event-handler.interface";
import AddressChangedEvent from "./address-changed-event";

export default class EnviaConsoleLogHandler implements EventHandlerInterface<AddressChangedEvent> {
  handle(event: AddressChangedEvent): void {
    const id = event.eventData.id;
    const name = event.eventData.name;
    const address = event.eventData.address.toString();
    
    console.log(`Endereço do cliente: ${id}, ${name} alterado para: ${address}`);
  }
}