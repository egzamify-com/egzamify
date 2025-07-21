/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ai_wyjasnia_mutate from "../ai_wyjasnia/mutate.js";
import type * as ai_wyjasnia_query from "../ai_wyjasnia/query.js";
import type * as auth from "../auth.js";
import type * as friends_query from "../friends/query.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "ai_wyjasnia/mutate": typeof ai_wyjasnia_mutate;
  "ai_wyjasnia/query": typeof ai_wyjasnia_query;
  auth: typeof auth;
  "friends/query": typeof friends_query;
  helpers: typeof helpers;
  http: typeof http;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
