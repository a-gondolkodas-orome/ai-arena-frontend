import { BotSubmitStage } from "./app/graphql/generated";

export const BOT_SUBMIT_STAGE__IN_PROGRESS = [
  BotSubmitStage.Registered,
  BotSubmitStage.SourceUploadSuccess,
];
export const BOT_SUBMIT_STAGE__ERROR = [
  BotSubmitStage.SourceUploadError,
  BotSubmitStage.CheckError,
];
