import sqlite3 from "sqlite3";
import { join } from "path";

import { QRCodesDB } from "./qr-codes-db.js";

import { BillingInterval, LATEST_API_VERSION, DeliveryMethod } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-04";

const DB_PATH = `${process.cwd()}/database.sqlite`;

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const database = new sqlite3.Database(join(process.cwd(), "database.sqlite"));

// Initialize SQLite DB
QRCodesDB.db = database;
QRCodesDB.init();

const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources,
    billing: undefined, // or replace with billingConfig above to enable example billing
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "pubsub://shopify-app-deployment:shopify-app-deployment-topic",
    deliveryMethod: DeliveryMethod.PubSub
  },
  sessionStorage: new SQLiteSessionStorage(database),
});
export default shopify;