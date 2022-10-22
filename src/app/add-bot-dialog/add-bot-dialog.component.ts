import { Component, Inject, OnDestroy } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators } from "@angular/forms";
import { concatMap, EMPTY, filter, map, Subscription, tap } from "rxjs";
import { handleGraphqlAuthErrors, handleValidationErrors } from "../error";
import { FileInput, FileValidator } from "ngx-material-file-input";
import { HttpClient } from "@angular/common/http";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as t from "io-ts";
import { decode } from "../../utils";
import { BotWithUploadLink, CreateBotGQL } from "../graphql/generated";
import { NotificationService } from "../services/notification.service";
import { environment } from "../../environments/environment";
import { BotListComponent } from "../bot-list/bot-list.component";

@Component({
  selector: "app-add-bot-dialog",
  templateUrl: "./add-bot-dialog.component.html",
  styleUrls: ["./add-bot-dialog.component.scss"],
})
export class AddBotDialogComponent implements OnDestroy {
  static readonly SOURCE_FILE_MAX_SIZE = 1048576; // 1MB

  static readonly addBotDialogDataCodec = t.type({ gameId: t.string });

  constructor(
    protected dialogRef: MatDialogRef<AddBotDialogComponent>,
    protected formBuilder: FormBuilder,
    protected createBot: CreateBotGQL,
    protected notificationService: NotificationService,
    protected httpClient: HttpClient,
    @Inject(MAT_DIALOG_DATA) unknownData: unknown,
  ) {
    this.data = decode(
      AddBotDialogComponent.addBotDialogDataCodec,
      unknownData,
    );
  }

  protected data: t.TypeOf<typeof AddBotDialogComponent.addBotDialogDataCodec>;

  addBotForm = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control(""),
    sourceFile: this.formBuilder.control<FileInput | null>(null, [
      Validators.required,
      FileValidator.maxContentSize(AddBotDialogComponent.SOURCE_FILE_MAX_SIZE),
    ]),
  });

  addBotSubscription?: Subscription;

  onSubmit() {
    this.addBotSubscription = this.createBot
      .mutate(
        {
          botInput: {
            gameId: this.data.gameId,
            name: this.addBotForm.getRawValue().name,
          },
        },
        {
          // Update the cached bot list without re-fetching from the server.
          // See https://www.apollographql.com/docs/react/data/mutations#the-update-function
          update: (cache, { data }) => {
            cache.modify({
              fields: {
                getBots: (cacheValue: unknown, { toReference, DELETE }) => {
                  const getBots = decode(
                    BotListComponent.getBotsCacheCodec,
                    cacheValue,
                  );
                  const botWithUploadLink =
                    data?.createBot as BotWithUploadLink;
                  let id;
                  if (
                    botWithUploadLink?.__typename !== "BotWithUploadLink" ||
                    !(id = cache.identify(botWithUploadLink.bot))
                  )
                    return DELETE;
                  return {
                    ...getBots,
                    bots: [...getBots.bots, toReference(id)],
                  };
                },
              },
            });
          },
        },
      )
      .pipe(
        map((result) => result.data),
        filter((value): value is Exclude<typeof value, null | undefined> => {
          if (value != null) return true;
          this.notificationService.error("No data returned from bot creation");
          return false;
        }),
        map((data) => data.createBot),
        handleGraphqlAuthErrors(this.notificationService),
        handleValidationErrors(
          "AddBotError" as const,
          this.notificationService,
          this.addBotForm,
        ),
        concatMap((result) => {
          const sourceFile = this.addBotForm.value.sourceFile?.files?.[0];
          if (!sourceFile) {
            this.notificationService.error("No source file selected");
            return EMPTY;
          }
          const formData = new FormData();
          formData.append("sourceFile", sourceFile);
          return this.httpClient.post(
            environment.backendUrl + result.uploadLink,
            formData,
          );
        }),
        tap(() => {
          this.dialogRef.close();
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.addBotSubscription?.unsubscribe();
  }
}
