import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import { inMemorySequelizeInstance } from "../../../database/sequelizeInstance";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items?.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const transaction = await inMemorySequelizeInstance.transaction();
    try {
      await OrderModel.update(
        {
          customer_id: entity.customerId,
          total: entity.total(),
        },
        {
          where: {
            id: entity.id
          },
        },
      );
  
      if(entity.items?.length) {
        await OrderItemModel.destroy({
          where: {
            order_id: entity.id
          }
        });
  
        const orderItemsToCreate = 
          entity.items.map((item) => 
            ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
                order_id: entity.id,
            }));
        
        await OrderItemModel.bulkCreate(orderItemsToCreate);
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  }

  async find(id: string): Promise<Order> {
    let orderModel;

    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        include: ["items"],
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Order not found");
    }
    
    const orderItems = orderModel.items?.map((orderItemModel) => new OrderItem(
      orderItemModel.id,
      orderItemModel.name,
      orderItemModel.price,
      orderItemModel.product_id,
      orderItemModel.quantity,
    ));

    return new Order(
      orderModel.id,
      orderModel.customer_id,
      orderItems
    );
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: ["items"],
    });
      
    return orderModels.map((orderModel) => {
      const orderItems = orderModel.items?.map((orderItemModel) => new OrderItem(
        orderItemModel.id,
        orderItemModel.name,
        orderItemModel.price,
        orderItemModel.product_id,
        orderItemModel.quantity,
      )); 
      
      return new Order(
        orderModel.id,
        orderModel.customer_id,
        orderItems
      );
    });
  }
}
