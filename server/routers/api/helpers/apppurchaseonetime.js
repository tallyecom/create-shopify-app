require('dotenv').config();
const { GraphQLClient, gql } = require('graphql-request');

async function ONETIME_CREATE(url, req, shop) {
  console.log("url :: ", url)
  const endpoint = "https://" + shop + ".myshopify.com/admin/api/" + process.env.APIVER + "/graphql.json"
  // console.log("endpoint :: ", endpoint)
  // console.log("headers :: ", req.headers)
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: req.headers
  })
  const query = gql`
  {
    products(first:10){
      edges{
        node{
          id
          variants(first:1){
            id
          }
        }
      }
    }
  }
    # mutation {
    #   appPurchaseOneTimeCreate(
    #     name: "Installation Charge"
    #     price: { amount: 50, currencyCode: USD }
    #     returnUrl: '${url}'
    #     test: true
    #   ) {
    #     userErrors {
    #       field
    #       message
    #     }
    #     confirmationUrl
    #     appPurchaseOneTime {
    #       id
    #     }
    #   }
    # }
  `;

  const queryData = await graphQLClient.request(query).catch((e) => console.log(e))
  console.log(JSON.stringify(queryData, undefined, 2))
}
module.exports = ONETIME_CREATE;