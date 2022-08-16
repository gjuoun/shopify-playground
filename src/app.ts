// import express from 'express'
import dotenv from "dotenv";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import { DelegateAccessTokenPayload } from "./type";

dotenv.config();

// const app = express()

// app.get('/', (req, res) => {
//   res.send('hello')
// })

// app.listen(3000, ()=> {
//   console.log('listen on port 3000')
// })

const {
  API_KEY = "",
  API_SECRET_KEY = "",
  ADMIN_ACCESS_TOKEN = "",
  STOREFRONT_ACCESS_TOKEN = "",
  SCOPES = "",
  SHOP,
  HOST = "",
  HOST_SCHEME,
} = process.env;

Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES: [SCOPES],
  HOST_NAME: HOST.replace(/https?:\/\//, ""),
  HOST_SCHEME,
  IS_EMBEDDED_APP: false,
  API_VERSION: ApiVersion.July22, // all supported versions are available, as well as "unstable" and "unversioned"
  PRIVATE_APP_STOREFRONT_ACCESS_TOKEN: STOREFRONT_ACCESS_TOKEN,
});

async function main() {
  const adminApi = new Shopify.Clients.Graphql(HOST, ADMIN_ACCESS_TOKEN);

  const delegatePayload = await adminApi.query({
    data: `
    mutation {
      delegateAccessTokenCreate(input: { delegateAccessScope: [
          "${SCOPES}" ] }){
        delegateAccessToken {
          accessToken
        }
        shop {
          id
          name
        }
        userErrors {
          field
          message
        }
      }
    }
    `,
  });

  const { delegateAccessToken } = (
    delegatePayload.body as DelegateAccessTokenPayload
  ).data.delegateAccessTokenCreate;

  const storefrontApi = new Shopify.Clients.Storefront(
    HOST,
    STOREFRONT_ACCESS_TOKEN
  );

  const res = await storefrontApi.query({
    extraHeaders: {
      "Shopify-Storefront-Private-Token": delegateAccessToken.accessToken,
      "Shopify-Storefront-Buyer-IP": "47.54.141.245",
    },
    data: `{
      products (first: 10) {
        edges {
          node {
            id
            title
            descriptionHtml
          }
        }
      }
    }
    `,
  });

  console.log(res);

  // const data = await shopify.query({
  //   data: `
  //   {
  //     products (first: 10) {
  //       edges {
  //         node {
  //           id
  //           title
  //           descriptionHtml
  //         }
  //       }
  //     }
  //   }
  //   `,
  // });

  // console.log(data)
}

main();
