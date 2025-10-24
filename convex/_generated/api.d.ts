/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai_wyjasnia_helpers from "../ai_wyjasnia/helpers.js";
import type * as ai_wyjasnia_mutate from "../ai_wyjasnia/mutate.js";
import type * as ai_wyjasnia_query from "../ai_wyjasnia/query.js";
import type * as auth from "../auth.js";
import type * as custom_helpers from "../custom_helpers.js";
import type * as feedback_feedback from "../feedback/feedback.js";
import type * as friends_helpers from "../friends/helpers.js";
import type * as friends_mutate from "../friends/mutate.js";
import type * as friends_query from "../friends/query.js";
import type * as http from "../http.js";
import type * as praktyka_helpers from "../praktyka/helpers.js";
import type * as praktyka_mutate from "../praktyka/mutate.js";
import type * as praktyka_query from "../praktyka/query.js";
import type * as statistics_mutations from "../statistics/mutations.js";
import type * as statistics_query from "../statistics/query.js";
import type * as teoria_actions from "../teoria/actions.js";
import type * as teoria_helpers from "../teoria/helpers.js";
import type * as teoria_mutate from "../teoria/mutate.js";
import type * as teoria_query from "../teoria/query.js";
import type * as users_mutate from "../users/mutate.js";
import type * as users_query from "../users/query.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "ai_wyjasnia/helpers": typeof ai_wyjasnia_helpers;
  "ai_wyjasnia/mutate": typeof ai_wyjasnia_mutate;
  "ai_wyjasnia/query": typeof ai_wyjasnia_query;
  auth: typeof auth;
  custom_helpers: typeof custom_helpers;
  "feedback/feedback": typeof feedback_feedback;
  "friends/helpers": typeof friends_helpers;
  "friends/mutate": typeof friends_mutate;
  "friends/query": typeof friends_query;
  http: typeof http;
  "praktyka/helpers": typeof praktyka_helpers;
  "praktyka/mutate": typeof praktyka_mutate;
  "praktyka/query": typeof praktyka_query;
  "statistics/mutations": typeof statistics_mutations;
  "statistics/query": typeof statistics_query;
  "teoria/actions": typeof teoria_actions;
  "teoria/helpers": typeof teoria_helpers;
  "teoria/mutate": typeof teoria_mutate;
  "teoria/query": typeof teoria_query;
  "users/mutate": typeof users_mutate;
  "users/query": typeof users_query;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
