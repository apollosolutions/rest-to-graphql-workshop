import { gql, ApolloServer } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import { OrdersAPI } from "./OrdersAPI.js";

const typeDefs = gql`
    type Order {
    # If you wanted to use Apollo Federation@key(fields:"id") @key(fields:"number") {
        id: ID!
        number: String
        customerComment: String
        internalComment: String
    }
    type Query {
        order(id:ID!): Order
    }
    type Mutation {
        updateOrder(id: ID! order: OrderUpdateInput): Order
        order(id: ID!): OrderMutation
    }
    type OrderMutation {
        id: ID!
        updateCustomerComment(comment: String): Order
    }
    input OrderUpdateInput {
        paymentStatus: Status
        orderStatus: Status
        trackingCode: String
        comment: String
        transactionId: String
        clearedDate: String
    }
    enum Status {
        OPEN
        COMPLETE
    }
`;

const resolvers = {
    Query: {
        order: async (parent, args, context) => {
            return await context.dataSources.ordersAPI.getOrderById(args.id);
        }
    },
    Mutation: {
        updateOrder: async (parent, args, context) => {
            return await context.dataSources.ordersAPI.updateOrder(args.id, args)
        },
        order: (parent, args, context) => {
            return { ...args };
        }
    },
    OrderMutation: {
        updateCustomerComment: async (parent, args, context) => {
            const orderId = parent.id;
            const customerComment = args.comment;
            return await context.dataSources.ordersAPI.updateOrder(orderId, { customerComment });
        }
    },
    Order: {
        __resolveReference: async (parent, context) => {
            if (parent.id)
                return await context.dataSources.ordersAPI.getOrderById(parent.id);
            else
                return await context.dataSources.ordersAPI.getOrderById(parent.id);
        }
    }
}

const server = new ApolloServer({
    //If you wanted to use Apollo Federation instead
    // schema: buildFederatedSchema({ typeDefs, resolvers }),
    typeDefs,
    resolvers,
    dataSources: () => {
        return {
            ordersAPI: new OrdersAPI(),
        };
    },
    context: ({ req }) => ({
        shopwareToken: req.headers.authorization
    })
});

server.listen().then(({ url }) => { console.log(`Server ready at ${url}`) });