import { TypePolicies } from "@apollo/client/cache/inmemory/policies";

/** Define polymorphic relationships between the schema's types.
   Needed by apollo to look up cached data by interface or by union.
   See https://www.apollographql.com/docs/react/caching/cache-configuration/#possibletypes
 */
export const possibleTypes = {
  GraphqlError: ["GraphqlAuthenticationError", "GraphqlAuthorizationError"],
};

export const typePolicies: TypePolicies = {
  Match: {
    fields: {
      result: {
        merge(existing, incoming, { mergeObjects }) {
          return mergeObjects(existing, incoming);
        },
      },
      runStatus: {
        merge(existing, incoming, { mergeObjects }) {
          return mergeObjects(existing, incoming);
        },
      },
    },
  },
};
