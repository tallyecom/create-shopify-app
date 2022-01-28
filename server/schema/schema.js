const graphql = require("graphql");
const _ = require("lodash");
const Shop = require('../models/shop');


const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull } = graphql;

const ShopType = new GraphQLObjectType({
  name: "Shop",
  fields: () => ({
    id: { type: GraphQLID }
  })
})

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    name: { type: GraphQLString, args: { id: { type: GraphQLID } }, resolve(parent, args) { return Shop.findById(args.id) } }
  },
  Shops: {
    type: new GraphQLList(ShopType), resolve(parent, args) {
      return Shop.find({});
      // return books 
    }
  }
}
);

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addShop: {
      type: ShopType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let author = new Shop({
          name: args.name,
        });
        return Shop.save();
      }
    },
  }
})

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation })