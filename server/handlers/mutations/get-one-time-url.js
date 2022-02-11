export function ONETIME_CREATE(url) {
    return gql`
    mutation {
      appPurchaseOneTimeCreate(
        name: "Installation Charge"
        price: { amount: 50, currencyCode: USD }
        returnUrl: '${url}'
        test: true
      ) {
        userErrors {
          field
          message
        }
        confirmationUrl
        appPurchaseOneTime {
          id
        }
      }
    }
  `;
}