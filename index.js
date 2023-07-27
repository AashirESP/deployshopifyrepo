require('dotenv').config();
const Koa = require('koa');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES, HOST } = process.env;

const app = new Koa();
app.use(session(app));
app.keys = [SHOPIFY_API_SECRET];

app.use(
  createShopifyAuth({
    apiKey: SHOPIFY_API_KEY,
    secret: SHOPIFY_API_SECRET,
    scopes: SCOPES.split(','),
    afterAuth(ctx) {
      const { shop, accessToken } = ctx.session;
      ctx.redirect('/');
    },
  }),
);

app.listen(3000, () => {
  console.log('App is running on port 3000');
});


