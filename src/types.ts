import { GetBotsQuery, GetContestQuery, GetGameQuery } from "./app/graphql/generated";

export type GetGameQueryResult = Exclude<
  Extract<GetGameQuery["getGame"], { __typename: "Game" }>,
  null | undefined
>;

export type GetBotsQueryResult = Extract<GetBotsQuery["getBots"], { __typename: "Bots" }>["bots"];

export type GetContestQueryResult = Exclude<
  Extract<GetContestQuery["getContest"], { __typename: "Contest" }>,
  null | undefined
>;
