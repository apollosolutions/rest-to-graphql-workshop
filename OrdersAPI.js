import { RESTDataSource } from "apollo-datasource-rest";

//https://developers.shopware.com/developers-guide/rest-api/examples/order

export class OrdersAPI extends RESTDataSource {
    baseURL = "http://localhost:3000/api/orders"

    async getOrderById(orderId) {
        return await this.get(orderId, {}, { cacheOptions: { ttl } });
    }

    async getOrderByNumber(orderNumber) {
        return await this.get(orderNumber, ["useNumberAsId=true"]);
    }

    async updateOrder(paymentId, orderToUpdate) {
        return await this.put(paymentId, orderToUpdate);
    }

    async createOrder(order) {
        return await this.post('', order);
    }
}