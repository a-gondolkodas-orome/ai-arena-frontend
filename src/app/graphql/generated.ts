import { gql } from "apollo-angular";
import { Injectable } from "@angular/core";
import * as Apollo from "apollo-angular";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: { input: Date; output: Date };
};

export type Bot = {
  __typename: "Bot";
  game: Game;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  source?: Maybe<File>;
  submitStatus: BotSubmitStatus;
  user: User;
};

export type BotInput = {
  gameId: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
};

export type BotOrDeleted = Bot | DeletedBot;

export type BotResponse = Bot | GraphqlAuthenticationError | GraphqlAuthorizationError;

export enum BotSubmitStage {
  CheckError = "CHECK_ERROR",
  CheckSuccess = "CHECK_SUCCESS",
  Registered = "REGISTERED",
  SourceUploadDone = "SOURCE_UPLOAD_DONE",
  SourceUploadError = "SOURCE_UPLOAD_ERROR",
}

export type BotSubmitStatus = {
  __typename: "BotSubmitStatus";
  log?: Maybe<Scalars["String"]["output"]>;
  stage: BotSubmitStage;
};

export type BotWithUploadLink = {
  __typename: "BotWithUploadLink";
  bot: Bot;
  uploadLink: Scalars["String"]["output"];
};

export type Bots = {
  __typename: "Bots";
  bots: Array<Bot>;
};

export type BotsResponse = Bots | GraphqlAuthenticationError | GraphqlAuthorizationError;

export type Contest = {
  __typename: "Contest";
  bots: Array<BotOrDeleted>;
  date: Scalars["DateTime"]["output"];
  game: Game;
  id: Scalars["ID"]["output"];
  isArchived?: Maybe<Scalars["Boolean"]["output"]>;
  mapNames: Array<Scalars["String"]["output"]>;
  matchSizeTotal?: Maybe<Scalars["Float"]["output"]>;
  matches?: Maybe<Array<Match>>;
  name: Scalars["String"]["output"];
  owner: User;
  progress?: Maybe<ContestProgress>;
  scoreJson?: Maybe<Scalars["String"]["output"]>;
  status: ContestStatus;
};

export type ContestInput = {
  date: Scalars["DateTime"]["input"];
  gameId: Scalars["String"]["input"];
  mapNames: Array<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
};

export type ContestProgress = {
  __typename: "ContestProgress";
  completedMatchCount: Scalars["Float"]["output"];
  timeRemaining?: Maybe<Scalars["Float"]["output"]>;
  totalMatchCount: Scalars["Float"]["output"];
};

export type ContestRegistration = {
  botId: Scalars["String"]["input"];
  contestId: Scalars["String"]["input"];
};

export type ContestResponse =
  | Contest
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError
  | GraphqlValidationError;

export enum ContestStatus {
  Closed = "CLOSED",
  Finished = "FINISHED",
  Open = "OPEN",
  Running = "RUNNING",
  RunError = "RUN_ERROR",
}

export type Contests = {
  __typename: "Contests";
  contests: Array<Contest>;
};

export type ContestsResponse = Contests | GraphqlAuthenticationError | GraphqlAuthorizationError;

export type CreateBotError = GraphqlError & {
  __typename: "CreateBotError";
  fieldErrors: CreateBotFieldErrors;
  message: Scalars["String"]["output"];
};

export type CreateBotFieldErrors = {
  __typename: "CreateBotFieldErrors";
  gameId?: Maybe<Array<Scalars["String"]["output"]>>;
  name?: Maybe<Array<Scalars["String"]["output"]>>;
};

export type CreateBotResponse =
  | BotWithUploadLink
  | CreateBotError
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError;

export type CreateContestError = GraphqlError & {
  __typename: "CreateContestError";
  fieldErrors: CreateContestFieldErrors;
  message: Scalars["String"]["output"];
};

export type CreateContestFieldErrors = {
  __typename: "CreateContestFieldErrors";
  date?: Maybe<Array<Scalars["String"]["output"]>>;
  gameId?: Maybe<Array<Scalars["String"]["output"]>>;
  name?: Maybe<Array<Scalars["String"]["output"]>>;
};

export type CreateContestResponse =
  | Contest
  | CreateContestError
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError;

export type CreateMatchError = GraphqlError & {
  __typename: "CreateMatchError";
  fieldErrors: CreateMatchFieldErrors;
  message: Scalars["String"]["output"];
};

export type CreateMatchFieldErrors = {
  __typename: "CreateMatchFieldErrors";
  botIds?: Maybe<Array<Scalars["String"]["output"]>>;
  gameId?: Maybe<Array<Scalars["String"]["output"]>>;
  mapName?: Maybe<Array<Scalars["String"]["output"]>>;
};

export type CreateMatchResponse =
  | CreateMatchError
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError
  | Match;

export type Credentials = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type DeletedBot = {
  __typename: "DeletedBot";
  id: Scalars["ID"]["output"];
};

export type File = {
  __typename: "File";
  contentBase64: Scalars["String"]["output"];
  fileName: Scalars["String"]["output"];
};

export type Game = {
  __typename: "Game";
  fullDescription: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  maps: Array<GameMap>;
  name: Scalars["String"]["output"];
  picture: Scalars["String"]["output"];
  playerCount: PlayerCount;
  shortDescription: Scalars["String"]["output"];
};

export type GameMap = {
  __typename: "GameMap";
  name: Scalars["String"]["output"];
  playerCount: PlayerCount;
};

export type GameResponse = Game | GraphqlAuthenticationError | GraphqlAuthorizationError;

export type Games = {
  __typename: "Games";
  games: Array<Game>;
};

export type GamesResponse = Games | GraphqlAuthenticationError | GraphqlAuthorizationError;

export type GraphqlAuthenticationError = GraphqlError & {
  __typename: "GraphqlAuthenticationError";
  message: Scalars["String"]["output"];
};

export type GraphqlAuthorizationError = GraphqlError & {
  __typename: "GraphqlAuthorizationError";
  message: Scalars["String"]["output"];
};

export type GraphqlError = {
  message: Scalars["String"]["output"];
};

export type GraphqlValidationError = GraphqlError & {
  __typename: "GraphqlValidationError";
  message: Scalars["String"]["output"];
};

export type LoginResponse = GraphqlAuthenticationError | GraphqlAuthorizationError | LoginSuccess;

export type LoginSuccess = {
  __typename: "LoginSuccess";
  token: Scalars["String"]["output"];
};

export type Match = {
  __typename: "Match";
  bots: Array<BotOrDeleted>;
  game: Game;
  id: Scalars["ID"]["output"];
  logString?: Maybe<Scalars["String"]["output"]>;
  mapName: Scalars["String"]["output"];
  runStatus: MatchRunStatus;
  scoreJson?: Maybe<Scalars["String"]["output"]>;
  user: User;
};

export type MatchInput = {
  botIds: Array<Scalars["String"]["input"]>;
  gameId: Scalars["String"]["input"];
  mapName: Scalars["String"]["input"];
};

export type MatchResponse = GraphqlAuthenticationError | GraphqlAuthorizationError | Match;

export enum MatchRunStage {
  PrepareBotsDone = "PREPARE_BOTS_DONE",
  PrepareBotsError = "PREPARE_BOTS_ERROR",
  PrepareGameServerDone = "PREPARE_GAME_SERVER_DONE",
  PrepareGameServerError = "PREPARE_GAME_SERVER_ERROR",
  Registered = "REGISTERED",
  RunError = "RUN_ERROR",
  RunSuccess = "RUN_SUCCESS",
}

export type MatchRunStatus = {
  __typename: "MatchRunStatus";
  log?: Maybe<Scalars["String"]["output"]>;
  stage: MatchRunStage;
};

export type Matches = {
  __typename: "Matches";
  matches: Array<Match>;
};

export type MatchesResponse = GraphqlAuthenticationError | GraphqlAuthorizationError | Matches;

export type Mutation = {
  __typename: "Mutation";
  createBot: CreateBotResponse;
  createContest: CreateContestResponse;
  createMatch: CreateMatchResponse;
  deleteBot?: Maybe<ValidatedNoContentResponse>;
  deleteContest?: Maybe<ValidatedNoContentResponse>;
  deleteMatch?: Maybe<ValidatedNoContentResponse>;
  flipContestArchivedStatus?: Maybe<ContestResponse>;
  register: RegistrationResponse;
  registerToContest: RegisterToContestResponse;
  startContest: StartContestResponse;
  unregisterFromContest: UnregisterFromContestResponse;
  updateStatus: UpdateContestStatusResponse;
};

export type MutationCreateBotArgs = {
  bot: BotInput;
};

export type MutationCreateContestArgs = {
  contestInput: ContestInput;
};

export type MutationCreateMatchArgs = {
  matchInput: MatchInput;
};

export type MutationDeleteBotArgs = {
  id: Scalars["String"]["input"];
};

export type MutationDeleteContestArgs = {
  id: Scalars["String"]["input"];
};

export type MutationDeleteMatchArgs = {
  id: Scalars["String"]["input"];
};

export type MutationFlipContestArchivedStatusArgs = {
  id: Scalars["String"]["input"];
};

export type MutationRegisterArgs = {
  registrationData: RegistrationInput;
};

export type MutationRegisterToContestArgs = {
  registration: ContestRegistration;
};

export type MutationStartContestArgs = {
  contestId: Scalars["String"]["input"];
};

export type MutationUnregisterFromContestArgs = {
  contestId: Scalars["String"]["input"];
};

export type MutationUpdateStatusArgs = {
  contestId: Scalars["String"]["input"];
  status: ContestStatus;
};

export type PlayerCount = {
  __typename: "PlayerCount";
  max: Scalars["Float"]["output"];
  min: Scalars["Float"]["output"];
};

export type Query = {
  __typename: "Query";
  getBot?: Maybe<BotResponse>;
  getBots: BotsResponse;
  getContest?: Maybe<ContestResponse>;
  getContests: ContestsResponse;
  getGame?: Maybe<GameResponse>;
  getGames: GamesResponse;
  getMatch: MatchResponse;
  getMatches: MatchesResponse;
  getUsers: UsersResponse;
  login: LoginResponse;
  profile: UserResponse;
};

export type QueryGetBotArgs = {
  id: Scalars["String"]["input"];
};

export type QueryGetBotsArgs = {
  gameId: Scalars["String"]["input"];
  includeTestBots: Scalars["Boolean"]["input"];
};

export type QueryGetContestArgs = {
  id: Scalars["String"]["input"];
};

export type QueryGetGameArgs = {
  id: Scalars["String"]["input"];
};

export type QueryGetMatchArgs = {
  id: Scalars["String"]["input"];
};

export type QueryGetMatchesArgs = {
  gameId: Scalars["String"]["input"];
};

export type QueryLoginArgs = {
  credentials: Credentials;
};

export type RegisterToContestError = GraphqlError & {
  __typename: "RegisterToContestError";
  fieldErrors: RegisterToContestFieldErrors;
  message: Scalars["String"]["output"];
};

export type RegisterToContestFieldErrors = {
  __typename: "RegisterToContestFieldErrors";
  botId?: Maybe<Array<Scalars["String"]["output"]>>;
  contestId?: Maybe<Array<Scalars["String"]["output"]>>;
};

export type RegisterToContestResponse =
  | Contest
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError
  | RegisterToContestError;

export type RegistrationError = GraphqlError & {
  __typename: "RegistrationError";
  fieldErrors?: Maybe<RegistrationFieldErrors>;
  message: Scalars["String"]["output"];
  nonFieldErrors?: Maybe<Array<Scalars["String"]["output"]>>;
};

export type RegistrationFieldErrors = {
  __typename: "RegistrationFieldErrors";
  email?: Maybe<Array<Scalars["String"]["output"]>>;
  username?: Maybe<Array<Scalars["String"]["output"]>>;
};

export type RegistrationInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type RegistrationResponse =
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError
  | RegistrationError
  | RegistrationSuccess;

export type RegistrationSuccess = {
  __typename: "RegistrationSuccess";
  token: Scalars["String"]["output"];
  userId: Scalars["String"]["output"];
};

export enum Role {
  Admin = "ADMIN",
  User = "USER",
}

export type StartContestError = GraphqlError & {
  __typename: "StartContestError";
  message: Scalars["String"]["output"];
  status: ContestStatus;
};

export type StartContestResponse =
  | Contest
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError
  | GraphqlValidationError
  | StartContestError;

export type UnregisterFromContestResponse =
  | Contest
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError
  | GraphqlValidationError;

export type UpdateContestStatusError = GraphqlError & {
  __typename: "UpdateContestStatusError";
  from: ContestStatus;
  message: Scalars["String"]["output"];
  to: ContestStatus;
};

export type UpdateContestStatusResponse =
  | Contest
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError
  | GraphqlValidationError
  | UpdateContestStatusError;

export type User = {
  __typename: "User";
  email: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  roles: Array<Role>;
  username: Scalars["String"]["output"];
};

export type UserResponse = GraphqlAuthenticationError | GraphqlAuthorizationError | User;

export type Users = {
  __typename: "Users";
  users: Array<User>;
};

export type UsersResponse = GraphqlAuthenticationError | GraphqlAuthorizationError | Users;

export type ValidatedNoContentResponse =
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError
  | GraphqlValidationError;

export type LoginQueryVariables = Exact<{
  credentials: Credentials;
}>;

export type LoginQuery = {
  __typename: "Query";
  login:
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | { __typename: "LoginSuccess"; token: string };
};

export type RegisterMutationVariables = Exact<{
  registrationInput: RegistrationInput;
}>;

export type RegisterMutation = {
  __typename: "Mutation";
  register:
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | {
        __typename: "RegistrationError";
        nonFieldErrors?: Array<string> | null;
        message: string;
        fieldErrors?: {
          __typename: "RegistrationFieldErrors";
          username?: Array<string> | null;
          email?: Array<string> | null;
        } | null;
      }
    | { __typename: "RegistrationSuccess"; token: string; userId: string };
};

export type GetProfileQueryVariables = Exact<{ [key: string]: never }>;

export type GetProfileQuery = {
  __typename: "Query";
  profile:
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | { __typename: "User"; id: string; username: string; email: string; roles: Array<Role> };
};

export type CreateBotMutationVariables = Exact<{
  botInput: BotInput;
}>;

export type CreateBotMutation = {
  __typename: "Mutation";
  createBot:
    | {
        __typename: "BotWithUploadLink";
        uploadLink: string;
        bot: {
          __typename: "Bot";
          id: string;
          name: string;
          submitStatus: {
            __typename: "BotSubmitStatus";
            stage: BotSubmitStage;
            log?: string | null;
          };
        };
      }
    | {
        __typename: "CreateBotError";
        message: string;
        fieldErrors: {
          __typename: "CreateBotFieldErrors";
          name?: Array<string> | null;
          gameId?: Array<string> | null;
        };
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string };
};

export type GetBotsQueryVariables = Exact<{
  gameId: Scalars["String"]["input"];
  includeTestBots: Scalars["Boolean"]["input"];
}>;

export type GetBotsQuery = {
  __typename: "Query";
  getBots:
    | {
        __typename: "Bots";
        bots: Array<{
          __typename: "Bot";
          id: string;
          name: string;
          submitStatus: {
            __typename: "BotSubmitStatus";
            stage: BotSubmitStage;
            log?: string | null;
          };
        }>;
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string };
};

export type GetBotQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type GetBotQuery = {
  __typename: "Query";
  getBot?:
    | {
        __typename: "Bot";
        id: string;
        name: string;
        submitStatus: { __typename: "BotSubmitStatus"; stage: BotSubmitStage; log?: string | null };
        source?: { __typename: "File"; fileName: string; contentBase64: string } | null;
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | null;
};

export type DeleteBotMutationVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type DeleteBotMutation = {
  __typename: "Mutation";
  deleteBot?:
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | { __typename: "GraphqlValidationError"; message: string }
    | null;
};

export type CreateContestMutationVariables = Exact<{
  contestInput: ContestInput;
}>;

export type CreateContestMutation = {
  __typename: "Mutation";
  createContest:
    | {
        __typename: "Contest";
        id: string;
        mapNames: Array<string>;
        name: string;
        date: Date;
        status: ContestStatus;
        scoreJson?: string | null;
        isArchived?: boolean | null;
        matchSizeTotal?: number | null;
        game: { __typename: "Game"; id: string; name: string };
        owner: { __typename: "User"; id: string; username: string };
        bots: Array<
          | {
              __typename: "Bot";
              id: string;
              name: string;
              user: { __typename: "User"; id: string; username: string };
            }
          | { __typename: "DeletedBot"; id: string }
        >;
        matches?: Array<{
          __typename: "Match";
          id: string;
          mapName: string;
          scoreJson?: string | null;
          game: { __typename: "Game"; name: string };
          bots: Array<
            | {
                __typename: "Bot";
                id: string;
                name: string;
                user: { __typename: "User"; id: string; username: string };
              }
            | { __typename: "DeletedBot"; id: string }
          >;
          runStatus: { __typename: "MatchRunStatus"; stage: MatchRunStage };
        }> | null;
        progress?: {
          __typename: "ContestProgress";
          totalMatchCount: number;
          completedMatchCount: number;
          timeRemaining?: number | null;
        } | null;
      }
    | {
        __typename: "CreateContestError";
        message: string;
        fieldErrors: {
          __typename: "CreateContestFieldErrors";
          gameId?: Array<string> | null;
          name?: Array<string> | null;
          date?: Array<string> | null;
        };
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string };
};

export type GetContestsQueryVariables = Exact<{
  includeMatchSizeTotal: Scalars["Boolean"]["input"];
}>;

export type GetContestsQuery = {
  __typename: "Query";
  getContests:
    | {
        __typename: "Contests";
        contests: Array<{
          __typename: "Contest";
          matchSizeTotal?: number | null;
          id: string;
          name: string;
          date: Date;
          isArchived?: boolean | null;
          game: { __typename: "Game"; name: string };
          bots: Array<{ __typename: "Bot"; id: string } | { __typename: "DeletedBot"; id: string }>;
          matches?: Array<{ __typename: "Match"; id: string }> | null;
        }>;
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string };
};

export type GetContestQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type GetContestQuery = {
  __typename: "Query";
  getContest?:
    | {
        __typename: "Contest";
        id: string;
        mapNames: Array<string>;
        name: string;
        date: Date;
        status: ContestStatus;
        scoreJson?: string | null;
        isArchived?: boolean | null;
        matchSizeTotal?: number | null;
        game: { __typename: "Game"; id: string; name: string };
        owner: { __typename: "User"; id: string; username: string };
        bots: Array<
          | {
              __typename: "Bot";
              id: string;
              name: string;
              user: { __typename: "User"; id: string; username: string };
            }
          | { __typename: "DeletedBot"; id: string }
        >;
        matches?: Array<{
          __typename: "Match";
          id: string;
          mapName: string;
          scoreJson?: string | null;
          game: { __typename: "Game"; name: string };
          bots: Array<
            | {
                __typename: "Bot";
                id: string;
                name: string;
                user: { __typename: "User"; id: string; username: string };
              }
            | { __typename: "DeletedBot"; id: string }
          >;
          runStatus: { __typename: "MatchRunStatus"; stage: MatchRunStage };
        }> | null;
        progress?: {
          __typename: "ContestProgress";
          totalMatchCount: number;
          completedMatchCount: number;
          timeRemaining?: number | null;
        } | null;
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | { __typename: "GraphqlValidationError"; message: string }
    | null;
};

export type GetContestMatchesQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type GetContestMatchesQuery = {
  __typename: "Query";
  getContest?:
    | {
        __typename: "Contest";
        matches?: Array<{
          __typename: "Match";
          id: string;
          mapName: string;
          scoreJson?: string | null;
          game: { __typename: "Game"; name: string };
          bots: Array<
            | {
                __typename: "Bot";
                id: string;
                name: string;
                user: { __typename: "User"; id: string; username: string };
              }
            | { __typename: "DeletedBot"; id: string }
          >;
          runStatus: { __typename: "MatchRunStatus"; stage: MatchRunStage };
        }> | null;
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | { __typename: "GraphqlValidationError"; message: string }
    | null;
};

export type DeleteContestMutationVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type DeleteContestMutation = {
  __typename: "Mutation";
  deleteContest?:
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | { __typename: "GraphqlValidationError"; message: string }
    | null;
};

export type FlipContestArchivedStatusMutationVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type FlipContestArchivedStatusMutation = {
  __typename: "Mutation";
  flipContestArchivedStatus?:
    | {
        __typename: "Contest";
        id: string;
        name: string;
        date: Date;
        isArchived?: boolean | null;
        game: { __typename: "Game"; name: string };
        bots: Array<{ __typename: "Bot"; id: string } | { __typename: "DeletedBot"; id: string }>;
        matches?: Array<{ __typename: "Match"; id: string }> | null;
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | { __typename: "GraphqlValidationError"; message: string }
    | null;
};

export type RegisterToContestMutationVariables = Exact<{
  registration: ContestRegistration;
}>;

export type RegisterToContestMutation = {
  __typename: "Mutation";
  registerToContest:
    | {
        __typename: "Contest";
        id: string;
        mapNames: Array<string>;
        name: string;
        date: Date;
        status: ContestStatus;
        scoreJson?: string | null;
        isArchived?: boolean | null;
        matchSizeTotal?: number | null;
        game: { __typename: "Game"; id: string; name: string };
        owner: { __typename: "User"; id: string; username: string };
        bots: Array<
          | {
              __typename: "Bot";
              id: string;
              name: string;
              user: { __typename: "User"; id: string; username: string };
            }
          | { __typename: "DeletedBot"; id: string }
        >;
        matches?: Array<{
          __typename: "Match";
          id: string;
          mapName: string;
          scoreJson?: string | null;
          game: { __typename: "Game"; name: string };
          bots: Array<
            | {
                __typename: "Bot";
                id: string;
                name: string;
                user: { __typename: "User"; id: string; username: string };
              }
            | { __typename: "DeletedBot"; id: string }
          >;
          runStatus: { __typename: "MatchRunStatus"; stage: MatchRunStage };
        }> | null;
        progress?: {
          __typename: "ContestProgress";
          totalMatchCount: number;
          completedMatchCount: number;
          timeRemaining?: number | null;
        } | null;
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | {
        __typename: "RegisterToContestError";
        message: string;
        fieldErrors: {
          __typename: "RegisterToContestFieldErrors";
          contestId?: Array<string> | null;
          botId?: Array<string> | null;
        };
      };
};

export type UnregisterFromContestMutationVariables = Exact<{
  contestId: Scalars["String"]["input"];
}>;

export type UnregisterFromContestMutation = {
  __typename: "Mutation";
  unregisterFromContest:
    | {
        __typename: "Contest";
        id: string;
        mapNames: Array<string>;
        name: string;
        date: Date;
        status: ContestStatus;
        scoreJson?: string | null;
        isArchived?: boolean | null;
        matchSizeTotal?: number | null;
        game: { __typename: "Game"; id: string; name: string };
        owner: { __typename: "User"; id: string; username: string };
        bots: Array<
          | {
              __typename: "Bot";
              id: string;
              name: string;
              user: { __typename: "User"; id: string; username: string };
            }
          | { __typename: "DeletedBot"; id: string }
        >;
        matches?: Array<{
          __typename: "Match";
          id: string;
          mapName: string;
          scoreJson?: string | null;
          game: { __typename: "Game"; name: string };
          bots: Array<
            | {
                __typename: "Bot";
                id: string;
                name: string;
                user: { __typename: "User"; id: string; username: string };
              }
            | { __typename: "DeletedBot"; id: string }
          >;
          runStatus: { __typename: "MatchRunStatus"; stage: MatchRunStage };
        }> | null;
        progress?: {
          __typename: "ContestProgress";
          totalMatchCount: number;
          completedMatchCount: number;
          timeRemaining?: number | null;
        } | null;
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | { __typename: "GraphqlValidationError"; message: string };
};

export type UpdateContestStatusMutationVariables = Exact<{
  contestId: Scalars["String"]["input"];
  status: ContestStatus;
}>;

export type UpdateContestStatusMutation = {
  __typename: "Mutation";
  updateStatus:
    | {
        __typename: "Contest";
        id: string;
        mapNames: Array<string>;
        name: string;
        date: Date;
        status: ContestStatus;
        scoreJson?: string | null;
        isArchived?: boolean | null;
        matchSizeTotal?: number | null;
        game: { __typename: "Game"; id: string; name: string };
        owner: { __typename: "User"; id: string; username: string };
        bots: Array<
          | {
              __typename: "Bot";
              id: string;
              name: string;
              user: { __typename: "User"; id: string; username: string };
            }
          | { __typename: "DeletedBot"; id: string }
        >;
        matches?: Array<{
          __typename: "Match";
          id: string;
          mapName: string;
          scoreJson?: string | null;
          game: { __typename: "Game"; name: string };
          bots: Array<
            | {
                __typename: "Bot";
                id: string;
                name: string;
                user: { __typename: "User"; id: string; username: string };
              }
            | { __typename: "DeletedBot"; id: string }
          >;
          runStatus: { __typename: "MatchRunStatus"; stage: MatchRunStage };
        }> | null;
        progress?: {
          __typename: "ContestProgress";
          totalMatchCount: number;
          completedMatchCount: number;
          timeRemaining?: number | null;
        } | null;
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | { __typename: "GraphqlValidationError"; message: string }
    | {
        __typename: "UpdateContestStatusError";
        from: ContestStatus;
        to: ContestStatus;
        message: string;
      };
};

export type StartContestMutationVariables = Exact<{
  contestId: Scalars["String"]["input"];
}>;

export type StartContestMutation = {
  __typename: "Mutation";
  startContest:
    | {
        __typename: "Contest";
        id: string;
        mapNames: Array<string>;
        name: string;
        date: Date;
        status: ContestStatus;
        scoreJson?: string | null;
        isArchived?: boolean | null;
        matchSizeTotal?: number | null;
        game: { __typename: "Game"; id: string; name: string };
        owner: { __typename: "User"; id: string; username: string };
        bots: Array<
          | {
              __typename: "Bot";
              id: string;
              name: string;
              user: { __typename: "User"; id: string; username: string };
            }
          | { __typename: "DeletedBot"; id: string }
        >;
        matches?: Array<{
          __typename: "Match";
          id: string;
          mapName: string;
          scoreJson?: string | null;
          game: { __typename: "Game"; name: string };
          bots: Array<
            | {
                __typename: "Bot";
                id: string;
                name: string;
                user: { __typename: "User"; id: string; username: string };
              }
            | { __typename: "DeletedBot"; id: string }
          >;
          runStatus: { __typename: "MatchRunStatus"; stage: MatchRunStage };
        }> | null;
        progress?: {
          __typename: "ContestProgress";
          totalMatchCount: number;
          completedMatchCount: number;
          timeRemaining?: number | null;
        } | null;
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | { __typename: "GraphqlValidationError"; message: string }
    | { __typename: "StartContestError"; status: ContestStatus; message: string };
};

export type ContestHeadFragment = {
  __typename: "Contest";
  id: string;
  name: string;
  date: Date;
  isArchived?: boolean | null;
  game: { __typename: "Game"; name: string };
  bots: Array<{ __typename: "Bot"; id: string } | { __typename: "DeletedBot"; id: string }>;
  matches?: Array<{ __typename: "Match"; id: string }> | null;
};

export type ContestDetailsFragment = {
  __typename: "Contest";
  id: string;
  mapNames: Array<string>;
  name: string;
  date: Date;
  status: ContestStatus;
  scoreJson?: string | null;
  isArchived?: boolean | null;
  matchSizeTotal?: number | null;
  game: { __typename: "Game"; id: string; name: string };
  owner: { __typename: "User"; id: string; username: string };
  bots: Array<
    | {
        __typename: "Bot";
        id: string;
        name: string;
        user: { __typename: "User"; id: string; username: string };
      }
    | { __typename: "DeletedBot"; id: string }
  >;
  matches?: Array<{
    __typename: "Match";
    id: string;
    mapName: string;
    scoreJson?: string | null;
    game: { __typename: "Game"; name: string };
    bots: Array<
      | {
          __typename: "Bot";
          id: string;
          name: string;
          user: { __typename: "User"; id: string; username: string };
        }
      | { __typename: "DeletedBot"; id: string }
    >;
    runStatus: { __typename: "MatchRunStatus"; stage: MatchRunStage };
  }> | null;
  progress?: {
    __typename: "ContestProgress";
    totalMatchCount: number;
    completedMatchCount: number;
    timeRemaining?: number | null;
  } | null;
};

export type GetGamesQueryVariables = Exact<{ [key: string]: never }>;

export type GetGamesQuery = {
  __typename: "Query";
  getGames:
    | {
        __typename: "Games";
        games: Array<{
          __typename: "Game";
          id: string;
          name: string;
          picture: string;
          shortDescription: string;
          maps: Array<{ __typename: "GameMap"; name: string }>;
        }>;
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string };
};

export type GetGameQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type GetGameQuery = {
  __typename: "Query";
  getGame?:
    | {
        __typename: "Game";
        fullDescription: string;
        id: string;
        name: string;
        picture: string;
        shortDescription: string;
        playerCount: { __typename: "PlayerCount"; min: number; max: number };
        maps: Array<{
          __typename: "GameMap";
          name: string;
          playerCount: { __typename: "PlayerCount"; min: number; max: number };
        }>;
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | null;
};

export type GameHeadFragment = {
  __typename: "Game";
  id: string;
  name: string;
  picture: string;
  shortDescription: string;
  maps: Array<{ __typename: "GameMap"; name: string }>;
};

export type CreateMatchMutationVariables = Exact<{
  matchInput: MatchInput;
}>;

export type CreateMatchMutation = {
  __typename: "Mutation";
  createMatch:
    | {
        __typename: "CreateMatchError";
        message: string;
        fieldErrors: {
          __typename: "CreateMatchFieldErrors";
          gameId?: Array<string> | null;
          botIds?: Array<string> | null;
        };
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | { __typename: "Match"; id: string };
};

export type GetMatchesQueryVariables = Exact<{
  gameId: Scalars["String"]["input"];
}>;

export type GetMatchesQuery = {
  __typename: "Query";
  getMatches:
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | {
        __typename: "Matches";
        matches: Array<{
          __typename: "Match";
          id: string;
          mapName: string;
          scoreJson?: string | null;
          game: { __typename: "Game"; name: string };
          bots: Array<
            | {
                __typename: "Bot";
                id: string;
                name: string;
                user: { __typename: "User"; id: string; username: string };
              }
            | { __typename: "DeletedBot"; id: string }
          >;
          runStatus: { __typename: "MatchRunStatus"; stage: MatchRunStage };
        }>;
      };
};

export type GetMatchQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type GetMatchQuery = {
  __typename: "Query";
  getMatch:
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | {
        __typename: "Match";
        logString?: string | null;
        scoreJson?: string | null;
        id: string;
        mapName: string;
        runStatus: { __typename: "MatchRunStatus"; stage: MatchRunStage; log?: string | null };
        game: { __typename: "Game"; name: string };
        bots: Array<
          | {
              __typename: "Bot";
              id: string;
              name: string;
              user: { __typename: "User"; id: string; username: string };
            }
          | { __typename: "DeletedBot"; id: string }
        >;
      };
};

export type DeleteMatchMutationVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type DeleteMatchMutation = {
  __typename: "Mutation";
  deleteMatch?:
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | { __typename: "GraphqlValidationError"; message: string }
    | null;
};

export type MatchHeadFragment = {
  __typename: "Match";
  id: string;
  mapName: string;
  scoreJson?: string | null;
  game: { __typename: "Game"; name: string };
  bots: Array<
    | {
        __typename: "Bot";
        id: string;
        name: string;
        user: { __typename: "User"; id: string; username: string };
      }
    | { __typename: "DeletedBot"; id: string }
  >;
  runStatus: { __typename: "MatchRunStatus"; stage: MatchRunStage };
};

export type MatchDetailsFragment = {
  __typename: "Match";
  logString?: string | null;
  scoreJson?: string | null;
  id: string;
  mapName: string;
  runStatus: { __typename: "MatchRunStatus"; stage: MatchRunStage; log?: string | null };
  game: { __typename: "Game"; name: string };
  bots: Array<
    | {
        __typename: "Bot";
        id: string;
        name: string;
        user: { __typename: "User"; id: string; username: string };
      }
    | { __typename: "DeletedBot"; id: string }
  >;
};

export const ContestHeadFragmentDoc = gql`
  fragment ContestHead on Contest {
    id
    name
    game {
      name
    }
    date
    bots {
      ... on Bot {
        id
      }
      ... on DeletedBot {
        id
      }
    }
    matches {
      id
    }
    isArchived
  }
`;
export const MatchHeadFragmentDoc = gql`
  fragment MatchHead on Match {
    id
    mapName
    game {
      name
    }
    bots {
      ... on Bot {
        id
        user {
          id
          username
        }
        name
      }
      ... on DeletedBot {
        id
      }
    }
    runStatus {
      stage
    }
    scoreJson
  }
`;
export const ContestDetailsFragmentDoc = gql`
  fragment ContestDetails on Contest {
    id
    game {
      id
      name
    }
    mapNames
    owner {
      id
      username
    }
    name
    date
    bots {
      ... on Bot {
        id
        user {
          id
          username
        }
        name
      }
      ... on DeletedBot {
        id
      }
    }
    matches {
      ...MatchHead
    }
    status
    progress {
      totalMatchCount
      completedMatchCount
      timeRemaining
    }
    scoreJson
    isArchived
    matchSizeTotal
  }
  ${MatchHeadFragmentDoc}
`;
export const GameHeadFragmentDoc = gql`
  fragment GameHead on Game {
    id
    name
    picture
    shortDescription
    maps {
      name
    }
  }
`;
export const MatchDetailsFragmentDoc = gql`
  fragment MatchDetails on Match {
    ...MatchHead
    runStatus {
      stage
      log
    }
    logString
    scoreJson
  }
  ${MatchHeadFragmentDoc}
`;
export const LoginDocument = gql`
  query Login($credentials: Credentials!) {
    login(credentials: $credentials) {
      __typename
      ... on LoginSuccess {
        token
      }
      ... on GraphqlError {
        message
      }
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class LoginGQL extends Apollo.Query<LoginQuery, LoginQueryVariables> {
  override document = LoginDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RegisterDocument = gql`
  mutation Register($registrationInput: RegistrationInput!) {
    register(registrationData: $registrationInput) {
      __typename
      ... on RegistrationSuccess {
        token
        userId
      }
      ... on RegistrationError {
        fieldErrors {
          username
          email
        }
        nonFieldErrors
      }
      ... on GraphqlError {
        message
      }
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class RegisterGQL extends Apollo.Mutation<RegisterMutation, RegisterMutationVariables> {
  override document = RegisterDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetProfileDocument = gql`
  query GetProfile {
    profile {
      __typename
      ... on User {
        id
        username
        email
        roles
      }
      ... on GraphqlError {
        message
      }
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class GetProfileGQL extends Apollo.Query<GetProfileQuery, GetProfileQueryVariables> {
  override document = GetProfileDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateBotDocument = gql`
  mutation CreateBot($botInput: BotInput!) {
    createBot(bot: $botInput) {
      __typename
      ... on BotWithUploadLink {
        bot {
          id
          name
          submitStatus {
            stage
            log
          }
        }
        uploadLink
      }
      ... on CreateBotError {
        fieldErrors {
          name
          gameId
        }
      }
      ... on GraphqlError {
        message
      }
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class CreateBotGQL extends Apollo.Mutation<CreateBotMutation, CreateBotMutationVariables> {
  override document = CreateBotDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetBotsDocument = gql`
  query GetBots($gameId: String!, $includeTestBots: Boolean!) {
    getBots(gameId: $gameId, includeTestBots: $includeTestBots) {
      __typename
      ... on Bots {
        bots {
          id
          name
          submitStatus {
            stage
            log
          }
        }
      }
      ... on GraphqlError {
        message
      }
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class GetBotsGQL extends Apollo.Query<GetBotsQuery, GetBotsQueryVariables> {
  override document = GetBotsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetBotDocument = gql`
  query GetBot($id: String!) {
    getBot(id: $id) {
      __typename
      ... on Bot {
        id
        name
        submitStatus {
          stage
          log
        }
        source {
          fileName
          contentBase64
        }
      }
      ... on GraphqlError {
        message
      }
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class GetBotGQL extends Apollo.Query<GetBotQuery, GetBotQueryVariables> {
  override document = GetBotDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteBotDocument = gql`
  mutation DeleteBot($id: String!) {
    deleteBot(id: $id) {
      __typename
      ... on GraphqlValidationError {
        message
      }
      ... on GraphqlError {
        message
      }
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class DeleteBotGQL extends Apollo.Mutation<DeleteBotMutation, DeleteBotMutationVariables> {
  override document = DeleteBotDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateContestDocument = gql`
  mutation CreateContest($contestInput: ContestInput!) {
    createContest(contestInput: $contestInput) {
      __typename
      ... on Contest {
        ...ContestDetails
      }
      ... on CreateContestError {
        fieldErrors {
          gameId
          name
          date
        }
      }
      ... on GraphqlError {
        message
      }
    }
  }
  ${ContestDetailsFragmentDoc}
`;

@Injectable({
  providedIn: "root",
})
export class CreateContestGQL extends Apollo.Mutation<
  CreateContestMutation,
  CreateContestMutationVariables
> {
  override document = CreateContestDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetContestsDocument = gql`
  query GetContests($includeMatchSizeTotal: Boolean!) {
    getContests {
      __typename
      ... on Contests {
        contests {
          ...ContestHead
          matchSizeTotal @include(if: $includeMatchSizeTotal)
        }
      }
      ... on GraphqlError {
        message
      }
    }
  }
  ${ContestHeadFragmentDoc}
`;

@Injectable({
  providedIn: "root",
})
export class GetContestsGQL extends Apollo.Query<GetContestsQuery, GetContestsQueryVariables> {
  override document = GetContestsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetContestDocument = gql`
  query GetContest($id: String!) {
    getContest(id: $id) {
      __typename
      ... on Contest {
        ...ContestDetails
      }
      ... on GraphqlError {
        message
      }
    }
  }
  ${ContestDetailsFragmentDoc}
`;

@Injectable({
  providedIn: "root",
})
export class GetContestGQL extends Apollo.Query<GetContestQuery, GetContestQueryVariables> {
  override document = GetContestDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetContestMatchesDocument = gql`
  query GetContestMatches($id: String!) {
    getContest(id: $id) {
      __typename
      ... on Contest {
        matches {
          ...MatchHead
        }
      }
      ... on GraphqlError {
        message
      }
    }
  }
  ${MatchHeadFragmentDoc}
`;

@Injectable({
  providedIn: "root",
})
export class GetContestMatchesGQL extends Apollo.Query<
  GetContestMatchesQuery,
  GetContestMatchesQueryVariables
> {
  override document = GetContestMatchesDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteContestDocument = gql`
  mutation DeleteContest($id: String!) {
    deleteContest(id: $id) {
      __typename
      ... on GraphqlError {
        message
      }
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class DeleteContestGQL extends Apollo.Mutation<
  DeleteContestMutation,
  DeleteContestMutationVariables
> {
  override document = DeleteContestDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FlipContestArchivedStatusDocument = gql`
  mutation FlipContestArchivedStatus($id: String!) {
    flipContestArchivedStatus(id: $id) {
      __typename
      ... on Contest {
        ...ContestHead
      }
      ... on GraphqlError {
        message
      }
    }
  }
  ${ContestHeadFragmentDoc}
`;

@Injectable({
  providedIn: "root",
})
export class FlipContestArchivedStatusGQL extends Apollo.Mutation<
  FlipContestArchivedStatusMutation,
  FlipContestArchivedStatusMutationVariables
> {
  override document = FlipContestArchivedStatusDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RegisterToContestDocument = gql`
  mutation RegisterToContest($registration: ContestRegistration!) {
    registerToContest(registration: $registration) {
      __typename
      ... on Contest {
        ...ContestDetails
      }
      ... on RegisterToContestError {
        fieldErrors {
          contestId
          botId
        }
      }
      ... on GraphqlError {
        message
      }
    }
  }
  ${ContestDetailsFragmentDoc}
`;

@Injectable({
  providedIn: "root",
})
export class RegisterToContestGQL extends Apollo.Mutation<
  RegisterToContestMutation,
  RegisterToContestMutationVariables
> {
  override document = RegisterToContestDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UnregisterFromContestDocument = gql`
  mutation UnregisterFromContest($contestId: String!) {
    unregisterFromContest(contestId: $contestId) {
      __typename
      ... on Contest {
        ...ContestDetails
      }
      ... on GraphqlError {
        message
      }
    }
  }
  ${ContestDetailsFragmentDoc}
`;

@Injectable({
  providedIn: "root",
})
export class UnregisterFromContestGQL extends Apollo.Mutation<
  UnregisterFromContestMutation,
  UnregisterFromContestMutationVariables
> {
  override document = UnregisterFromContestDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateContestStatusDocument = gql`
  mutation UpdateContestStatus($contestId: String!, $status: ContestStatus!) {
    updateStatus(contestId: $contestId, status: $status) {
      __typename
      ... on Contest {
        ...ContestDetails
      }
      ... on UpdateContestStatusError {
        from
        to
      }
      ... on GraphqlError {
        message
      }
    }
  }
  ${ContestDetailsFragmentDoc}
`;

@Injectable({
  providedIn: "root",
})
export class UpdateContestStatusGQL extends Apollo.Mutation<
  UpdateContestStatusMutation,
  UpdateContestStatusMutationVariables
> {
  override document = UpdateContestStatusDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const StartContestDocument = gql`
  mutation StartContest($contestId: String!) {
    startContest(contestId: $contestId) {
      __typename
      ... on Contest {
        ...ContestDetails
      }
      ... on StartContestError {
        status
      }
      ... on GraphqlError {
        message
      }
    }
  }
  ${ContestDetailsFragmentDoc}
`;

@Injectable({
  providedIn: "root",
})
export class StartContestGQL extends Apollo.Mutation<
  StartContestMutation,
  StartContestMutationVariables
> {
  override document = StartContestDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetGamesDocument = gql`
  query GetGames {
    getGames {
      __typename
      ... on Games {
        games {
          ...GameHead
        }
      }
      ... on GraphqlError {
        message
      }
    }
  }
  ${GameHeadFragmentDoc}
`;

@Injectable({
  providedIn: "root",
})
export class GetGamesGQL extends Apollo.Query<GetGamesQuery, GetGamesQueryVariables> {
  override document = GetGamesDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetGameDocument = gql`
  query getGame($id: String!) {
    getGame(id: $id) {
      __typename
      ... on Game {
        ...GameHead
        fullDescription
        playerCount {
          min
          max
        }
        maps {
          name
          playerCount {
            min
            max
          }
        }
      }
      ... on GraphqlError {
        message
      }
    }
  }
  ${GameHeadFragmentDoc}
`;

@Injectable({
  providedIn: "root",
})
export class GetGameGQL extends Apollo.Query<GetGameQuery, GetGameQueryVariables> {
  override document = GetGameDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateMatchDocument = gql`
  mutation CreateMatch($matchInput: MatchInput!) {
    createMatch(matchInput: $matchInput) {
      __typename
      ... on Match {
        id
      }
      ... on CreateMatchError {
        fieldErrors {
          gameId
          botIds
        }
      }
      ... on GraphqlError {
        message
      }
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class CreateMatchGQL extends Apollo.Mutation<
  CreateMatchMutation,
  CreateMatchMutationVariables
> {
  override document = CreateMatchDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetMatchesDocument = gql`
  query GetMatches($gameId: String!) {
    getMatches(gameId: $gameId) {
      __typename
      ... on Matches {
        matches {
          ...MatchHead
        }
      }
      ... on GraphqlError {
        message
      }
    }
  }
  ${MatchHeadFragmentDoc}
`;

@Injectable({
  providedIn: "root",
})
export class GetMatchesGQL extends Apollo.Query<GetMatchesQuery, GetMatchesQueryVariables> {
  override document = GetMatchesDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetMatchDocument = gql`
  query GetMatch($id: String!) {
    getMatch(id: $id) {
      __typename
      ... on Match {
        ...MatchDetails
      }
      ... on GraphqlError {
        message
      }
    }
  }
  ${MatchDetailsFragmentDoc}
`;

@Injectable({
  providedIn: "root",
})
export class GetMatchGQL extends Apollo.Query<GetMatchQuery, GetMatchQueryVariables> {
  override document = GetMatchDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteMatchDocument = gql`
  mutation DeleteMatch($id: String!) {
    deleteMatch(id: $id) {
      __typename
      ... on GraphqlError {
        message
      }
    }
  }
`;

@Injectable({
  providedIn: "root",
})
export class DeleteMatchGQL extends Apollo.Mutation<
  DeleteMatchMutation,
  DeleteMatchMutationVariables
> {
  override document = DeleteMatchDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
