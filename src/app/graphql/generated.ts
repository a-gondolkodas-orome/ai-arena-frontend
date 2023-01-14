import { gql } from "apollo-angular";
import { Injectable } from "@angular/core";
import * as Apollo from "apollo-angular";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AddBotError = GraphqlError & {
  __typename?: "AddBotError";
  fieldErrors: AddBotFieldErrors;
  message: Scalars["String"];
};

export type AddBotFieldErrors = {
  __typename?: "AddBotFieldErrors";
  gameId?: Maybe<Array<Scalars["String"]>>;
  name?: Maybe<Array<Scalars["String"]>>;
};

export type AddBotResponse =
  | AddBotError
  | BotWithUploadLink
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError;

export type AuthError = GraphqlAuthenticationError | GraphqlAuthorizationError;

export type Bot = {
  __typename?: "Bot";
  game: Game;
  id: Scalars["ID"];
  name: Scalars["String"];
  submitStatus: BotSubmitStatus;
  user: User;
};

export type BotInput = {
  gameId: Scalars["String"];
  name: Scalars["String"];
};

export type BotResponse = Bot | GraphqlAuthenticationError | GraphqlAuthorizationError;

export enum BotSubmitStage {
  CheckError = "CHECK_ERROR",
  CheckSuccess = "CHECK_SUCCESS",
  Registered = "REGISTERED",
  SourceUploadDone = "SOURCE_UPLOAD_DONE",
  SourceUploadError = "SOURCE_UPLOAD_ERROR",
}

export type BotSubmitStatus = {
  __typename?: "BotSubmitStatus";
  log?: Maybe<Scalars["String"]>;
  stage: BotSubmitStage;
};

export type BotWithUploadLink = {
  __typename?: "BotWithUploadLink";
  bot: Bot;
  uploadLink: Scalars["String"];
};

export type Bots = {
  __typename?: "Bots";
  bots: Array<Bot>;
};

export type BotsResponse = Bots | GraphqlAuthenticationError | GraphqlAuthorizationError;

export type Credentials = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type Game = {
  __typename?: "Game";
  fullDescription: Scalars["String"];
  id: Scalars["ID"];
  name: Scalars["String"];
  picture: Scalars["String"];
  playerCount: PlayerCount;
  shortDescription: Scalars["String"];
};

export type GameInput = {
  fullDescription: Scalars["String"];
  name: Scalars["String"];
  picture: Scalars["String"];
  playerCount: PlayerCountInput;
  shortDescription: Scalars["String"];
};

export type GameResponse = Game | GraphqlAuthenticationError | GraphqlAuthorizationError;

export type Games = {
  __typename?: "Games";
  games: Array<Game>;
};

export type GamesResponse = Games | GraphqlAuthenticationError | GraphqlAuthorizationError;

export type GraphqlAuthenticationError = GraphqlError & {
  __typename?: "GraphqlAuthenticationError";
  message: Scalars["String"];
};

export type GraphqlAuthorizationError = GraphqlError & {
  __typename?: "GraphqlAuthorizationError";
  message: Scalars["String"];
};

export type GraphqlError = {
  message: Scalars["String"];
};

export type LoginResponse = GraphqlAuthenticationError | GraphqlAuthorizationError | LoginSuccess;

export type LoginSuccess = {
  __typename?: "LoginSuccess";
  token: Scalars["String"];
};

export type Match = {
  __typename?: "Match";
  bots: Array<Bot>;
  game: Game;
  id: Scalars["ID"];
  result?: Maybe<MatchResult>;
  runStatus: MatchRunStatus;
  user: User;
};

export type MatchInput = {
  botIds: Array<Scalars["String"]>;
  gameId: Scalars["String"];
};

export type MatchResponse = GraphqlAuthenticationError | GraphqlAuthorizationError | Match;

export type MatchResult = {
  __typename?: "MatchResult";
  log: Scalars["String"];
};

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
  __typename?: "MatchRunStatus";
  log?: Maybe<Scalars["String"]>;
  stage: MatchRunStage;
};

export type Matches = {
  __typename?: "Matches";
  matches: Array<Match>;
};

export type MatchesResponse = GraphqlAuthenticationError | GraphqlAuthorizationError | Matches;

export type Mutation = {
  __typename?: "Mutation";
  createBot: AddBotResponse;
  createGame: GameResponse;
  deleteBot?: Maybe<AuthError>;
  deleteMatch?: Maybe<AuthError>;
  register: RegistrationResponse;
  startMatch: StartMatchResponse;
};

export type MutationCreateBotArgs = {
  bot: BotInput;
};

export type MutationCreateGameArgs = {
  game: GameInput;
};

export type MutationDeleteBotArgs = {
  botId: Scalars["String"];
};

export type MutationDeleteMatchArgs = {
  matchId: Scalars["String"];
};

export type MutationRegisterArgs = {
  registrationData: RegistrationInput;
};

export type MutationStartMatchArgs = {
  matchInput: MatchInput;
};

export type PlayerCount = {
  __typename?: "PlayerCount";
  max: Scalars["Float"];
  min: Scalars["Float"];
};

export type PlayerCountInput = {
  max: Scalars["Float"];
  min: Scalars["Float"];
};

export type Query = {
  __typename?: "Query";
  findGame?: Maybe<GameResponse>;
  getBot?: Maybe<BotResponse>;
  getBots: BotsResponse;
  getGames: GamesResponse;
  getMatch: MatchResponse;
  getMatches: MatchesResponse;
  login: LoginResponse;
  profile: UserResponse;
  users: UsersResponse;
};

export type QueryFindGameArgs = {
  id: Scalars["String"];
};

export type QueryGetBotArgs = {
  id: Scalars["String"];
};

export type QueryGetBotsArgs = {
  gameId: Scalars["String"];
};

export type QueryGetMatchArgs = {
  id: Scalars["String"];
};

export type QueryGetMatchesArgs = {
  gameId: Scalars["String"];
};

export type QueryLoginArgs = {
  credentials: Credentials;
};

export type RegistrationError = GraphqlError & {
  __typename?: "RegistrationError";
  fieldErrors?: Maybe<RegistrationFieldErrors>;
  message: Scalars["String"];
  nonFieldErrors?: Maybe<Array<Scalars["String"]>>;
};

export type RegistrationFieldErrors = {
  __typename?: "RegistrationFieldErrors";
  email?: Maybe<Array<Scalars["String"]>>;
  username?: Maybe<Array<Scalars["String"]>>;
};

export type RegistrationInput = {
  email: Scalars["String"];
  password: Scalars["String"];
  username: Scalars["String"];
};

export type RegistrationResponse =
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError
  | RegistrationError
  | RegistrationSuccess;

export type RegistrationSuccess = {
  __typename?: "RegistrationSuccess";
  token: Scalars["String"];
  user: User;
};

export type StartMatchError = GraphqlError & {
  __typename?: "StartMatchError";
  fieldErrors: StartMatchFieldErrors;
  message: Scalars["String"];
};

export type StartMatchFieldErrors = {
  __typename?: "StartMatchFieldErrors";
  botIds?: Maybe<Array<Scalars["String"]>>;
  gameId?: Maybe<Array<Scalars["String"]>>;
};

export type StartMatchResponse =
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError
  | Match
  | StartMatchError;

export type User = {
  __typename?: "User";
  email: Scalars["String"];
  id: Scalars["ID"];
  username: Scalars["String"];
};

export type UserResponse = GraphqlAuthenticationError | GraphqlAuthorizationError | User;

export type Users = {
  __typename?: "Users";
  users: Array<User>;
};

export type UsersResponse = GraphqlAuthenticationError | GraphqlAuthorizationError | Users;

export type LoginQueryVariables = Exact<{
  credentials: Credentials;
}>;

export type LoginQuery = {
  __typename?: "Query";
  login:
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | { __typename: "LoginSuccess"; token: string };
};

export type RegisterMutationVariables = Exact<{
  registrationInput: RegistrationInput;
}>;

export type RegisterMutation = {
  __typename?: "Mutation";
  register:
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | {
        __typename: "RegistrationError";
        nonFieldErrors?: Array<string> | null;
        message: string;
        fieldErrors?: {
          __typename?: "RegistrationFieldErrors";
          username?: Array<string> | null;
          email?: Array<string> | null;
        } | null;
      }
    | {
        __typename: "RegistrationSuccess";
        token: string;
        user: { __typename?: "User"; id: string };
      };
};

export type GetProfileQueryVariables = Exact<{ [key: string]: never }>;

export type GetProfileQuery = {
  __typename?: "Query";
  profile:
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | { __typename: "User"; id: string; username: string; email: string };
};

export type CreateBotMutationVariables = Exact<{
  botInput: BotInput;
}>;

export type CreateBotMutation = {
  __typename?: "Mutation";
  createBot:
    | {
        __typename: "AddBotError";
        message: string;
        fieldErrors: {
          __typename?: "AddBotFieldErrors";
          name?: Array<string> | null;
          gameId?: Array<string> | null;
        };
      }
    | {
        __typename: "BotWithUploadLink";
        uploadLink: string;
        bot: {
          __typename?: "Bot";
          id: string;
          name: string;
          submitStatus: {
            __typename?: "BotSubmitStatus";
            stage: BotSubmitStage;
            log?: string | null;
          };
        };
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string };
};

export type GetBotsQueryVariables = Exact<{
  gameId: Scalars["String"];
}>;

export type GetBotsQuery = {
  __typename?: "Query";
  getBots:
    | {
        __typename: "Bots";
        bots: Array<{
          __typename?: "Bot";
          id: string;
          name: string;
          submitStatus: {
            __typename?: "BotSubmitStatus";
            stage: BotSubmitStage;
            log?: string | null;
          };
        }>;
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string };
};

export type GetBotQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type GetBotQuery = {
  __typename?: "Query";
  getBot?:
    | {
        __typename: "Bot";
        id: string;
        name: string;
        submitStatus: {
          __typename?: "BotSubmitStatus";
          stage: BotSubmitStage;
          log?: string | null;
        };
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | null;
};

export type DeleteBotMutationVariables = Exact<{
  botId: Scalars["String"];
}>;

export type DeleteBotMutation = {
  __typename?: "Mutation";
  deleteBot?:
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | null;
};

export type GetGamesQueryVariables = Exact<{ [key: string]: never }>;

export type GetGamesQuery = {
  __typename?: "Query";
  getGames:
    | {
        __typename: "Games";
        games: Array<{
          __typename?: "Game";
          id: string;
          name: string;
          picture: string;
          shortDescription: string;
        }>;
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string };
};

export type FindGameQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type FindGameQuery = {
  __typename?: "Query";
  findGame?:
    | {
        __typename: "Game";
        id: string;
        name: string;
        shortDescription: string;
        picture: string;
        fullDescription: string;
        playerCount: { __typename?: "PlayerCount"; min: number; max: number };
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | null;
};

export type StartMatchMutationVariables = Exact<{
  matchInput: MatchInput;
}>;

export type StartMatchMutation = {
  __typename?: "Mutation";
  startMatch:
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | { __typename: "Match"; id: string }
    | {
        __typename: "StartMatchError";
        message: string;
        fieldErrors: {
          __typename?: "StartMatchFieldErrors";
          gameId?: Array<string> | null;
          botIds?: Array<string> | null;
        };
      };
};

export type GetMatchesQueryVariables = Exact<{
  gameId: Scalars["String"];
}>;

export type GetMatchesQuery = {
  __typename?: "Query";
  getMatches:
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | {
        __typename: "Matches";
        matches: Array<{
          __typename?: "Match";
          id: string;
          runStatus: { __typename?: "MatchRunStatus"; stage: MatchRunStage };
        }>;
      };
};

export type GetMatchQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type GetMatchQuery = {
  __typename?: "Query";
  getMatch:
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | {
        __typename: "Match";
        id: string;
        result?: { __typename?: "MatchResult"; log: string } | null;
        runStatus: { __typename?: "MatchRunStatus"; stage: MatchRunStage; log?: string | null };
      };
};

export type DeleteMatchMutationVariables = Exact<{
  matchId: Scalars["String"];
}>;

export type DeleteMatchMutation = {
  __typename?: "Mutation";
  deleteMatch?:
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string }
    | null;
};

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
        user {
          id
        }
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
      ... on AddBotError {
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
  query GetBots($gameId: String!) {
    getBots(gameId: $gameId) {
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
  mutation DeleteBot($botId: String!) {
    deleteBot(botId: $botId) {
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
export class DeleteBotGQL extends Apollo.Mutation<DeleteBotMutation, DeleteBotMutationVariables> {
  override document = DeleteBotDocument;

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
          id
          name
          picture
          shortDescription
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
export class GetGamesGQL extends Apollo.Query<GetGamesQuery, GetGamesQueryVariables> {
  override document = GetGamesDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FindGameDocument = gql`
  query FindGame($id: String!) {
    findGame(id: $id) {
      __typename
      ... on Game {
        id
        name
        shortDescription
        picture
        fullDescription
        playerCount {
          min
          max
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
export class FindGameGQL extends Apollo.Query<FindGameQuery, FindGameQueryVariables> {
  override document = FindGameDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const StartMatchDocument = gql`
  mutation StartMatch($matchInput: MatchInput!) {
    startMatch(matchInput: $matchInput) {
      __typename
      ... on Match {
        id
      }
      ... on StartMatchError {
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
export class StartMatchGQL extends Apollo.Mutation<
  StartMatchMutation,
  StartMatchMutationVariables
> {
  override document = StartMatchDocument;

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
          id
          runStatus {
            stage
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
        id
        result {
          log
        }
        runStatus {
          stage
          log
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
export class GetMatchGQL extends Apollo.Query<GetMatchQuery, GetMatchQueryVariables> {
  override document = GetMatchDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteMatchDocument = gql`
  mutation DeleteMatch($matchId: String!) {
    deleteMatch(matchId: $matchId) {
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
