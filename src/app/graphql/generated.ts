import { gql } from "apollo-angular";
import { Injectable } from "@angular/core";
import * as Apollo from "apollo-angular";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
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

export type Bot = {
  __typename?: "Bot";
  game: Game;
  id: Scalars["ID"];
  name: Scalars["String"];
  user: User;
};

export type BotInput = {
  gameId: Scalars["String"];
  name: Scalars["String"];
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

export type BotsResponse =
  | Bots
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError;

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

export type GameResponse =
  | Game
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError;

export type Games = {
  __typename?: "Games";
  games: Array<Game>;
};

export type GamesResponse =
  | Games
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError;

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

export type LoginResponse =
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError
  | LoginSuccess;

export type LoginSuccess = {
  __typename?: "LoginSuccess";
  token: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  createBot: AddBotResponse;
  createGame: GameResponse;
  register: RegistrationResponse;
};

export type MutationCreateBotArgs = {
  bot: BotInput;
};

export type MutationCreateGameArgs = {
  game: GameInput;
};

export type MutationRegisterArgs = {
  registrationData: RegistrationInput;
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
  getBots: BotsResponse;
  getGames: GamesResponse;
  login: LoginResponse;
  profile: UserResponse;
  users: UsersResponse;
};

export type QueryFindGameArgs = {
  id: Scalars["String"];
};

export type QueryGetBotsArgs = {
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

export type User = {
  __typename?: "User";
  email: Scalars["String"];
  id: Scalars["ID"];
  username: Scalars["String"];
};

export type UserResponse =
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError
  | User;

export type Users = {
  __typename?: "Users";
  users: Array<User>;
};

export type UsersResponse =
  | GraphqlAuthenticationError
  | GraphqlAuthorizationError
  | Users;

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
        bot: { __typename?: "Bot"; id: string; name: string };
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
        bots: Array<{ __typename?: "Bot"; id: string; name: string }>;
      }
    | { __typename: "GraphqlAuthenticationError"; message: string }
    | { __typename: "GraphqlAuthorizationError"; message: string };
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
export class RegisterGQL extends Apollo.Mutation<
  RegisterMutation,
  RegisterMutationVariables
> {
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
export class GetProfileGQL extends Apollo.Query<
  GetProfileQuery,
  GetProfileQueryVariables
> {
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
export class CreateBotGQL extends Apollo.Mutation<
  CreateBotMutation,
  CreateBotMutationVariables
> {
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
export class GetBotsGQL extends Apollo.Query<
  GetBotsQuery,
  GetBotsQueryVariables
> {
  override document = GetBotsDocument;

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
export class GetGamesGQL extends Apollo.Query<
  GetGamesQuery,
  GetGamesQueryVariables
> {
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
export class FindGameGQL extends Apollo.Query<
  FindGameQuery,
  FindGameQueryVariables
> {
  override document = FindGameDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
