import { GetBotQuery, GetBotsQuery, GetContestQuery, GetGameQuery } from "./app/graphql/generated";

export type GetGameQueryResult = Exclude<
  Extract<GetGameQuery["getGame"], { __typename: "Game" }>,
  null | undefined
>;

export type GetBotsQueryResult = Extract<GetBotsQuery["getBots"], { __typename: "Bots" }>["bots"];

export type GetBotQueryResult = Extract<GetBotQuery["getBot"], { __typename: "Bot" }>;

export type GetContestQueryResult = Exclude<
  Extract<GetContestQuery["getContest"], { __typename: "Contest" }>,
  null | undefined
>;

// Used when manually navigating back to /login or /register without logout
export const symbolHideUserInfo = Symbol("hideUserInfo");
