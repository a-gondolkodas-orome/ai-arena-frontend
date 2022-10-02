/* Define polymorphic relationships between the schema's types.
   Needed by apollo to look up cached data by interface or by union.
   See https://www.apollographql.com/docs/react/caching/cache-configuration/#possibletypes
 */
export const possibleTypes = {
  GraphqlError: ["GraphqlAuthenticationError", "GraphqlAuthorizationError"],
};
