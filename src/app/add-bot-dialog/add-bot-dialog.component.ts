import { Component, Inject, OnDestroy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, Validators } from "@angular/forms";
import { concatMap, EMPTY, filter, map, Subscription, tap } from "rxjs";
import { handleGraphqlAuthErrors, handleValidationErrors } from "../error";
import { MaxSizeValidator } from "@angular-material-components/file-input";
import { HttpClient } from "@angular/common/http";
import * as t from "io-ts";
import { decode } from "../../utils";
import { BotWithUploadLink, CreateBotGQL } from "../graphql/generated";
import { NotificationService } from "../services/notification.service";
import { BotListComponent } from "../bot-list/bot-list.component";
import { ToReferenceFunction } from "@apollo/client/cache/core/types/common";

@Component({
  selector: "app-add-bot-dialog",
  templateUrl: "./add-bot-dialog.component.html",
  styleUrls: ["./add-bot-dialog.component.scss"],
})
export class AddBotDialogComponent implements OnDestroy {
  static readonly SOURCE_FILE_MAX_SIZE = 1000000;
  public sourceFileMaxSize = AddBotDialogComponent.SOURCE_FILE_MAX_SIZE; // To be used by the html template

  static readonly addBotDialogDataCodec = t.type({ gameId: t.string });

  constructor(
    protected dialogRef: MatDialogRef<AddBotDialogComponent>,
    protected formBuilder: FormBuilder,
    protected createBot: CreateBotGQL,
    protected notificationService: NotificationService,
    protected httpClient: HttpClient,
    @Inject(MAT_DIALOG_DATA) unknownData: unknown,
  ) {
    this.data = decode(AddBotDialogComponent.addBotDialogDataCodec, unknownData);
  }

  protected data: t.TypeOf<typeof AddBotDialogComponent.addBotDialogDataCodec>;

  addBotForm = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control(""),
    sourceFile: this.formBuilder.control<File | null>(null, [
      Validators.required,
      MaxSizeValidator(AddBotDialogComponent.SOURCE_FILE_MAX_SIZE),
    ]),
  });

  addBotSubscription?: Subscription;

  onSubmit() {
    const closeDialog = () => this.dialogRef.close();
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
                getBots: (
                  cacheValue: unknown,
                  {
                    toReference,
                    DELETE,
                  }: {
                    toReference: ToReferenceFunction;
                    DELETE: unknown;
                  },
                ) => {
                  const getBots = decode(BotListComponent.getBotsCacheCodec, cacheValue);
                  const botWithUploadLink = data?.createBot as BotWithUploadLink;
                  let id;
                  if (
                    botWithUploadLink?.__typename !== "BotWithUploadLink" ||
                    !(id = cache.identify(botWithUploadLink.bot))
                  )
                    return DELETE;
                  // Not ideal, because we can't sort the system bots to the end, like the backend does
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
          "CreateBotError" as const,
          this.notificationService,
          this.addBotForm,
        ),
        concatMap((result) => {
          const sourceFile = this.addBotForm.value.sourceFile;
          if (!sourceFile) {
            this.notificationService.error("No source file selected");
            return EMPTY;
          }
          const formData = new FormData();
          formData.append("sourceFile", sourceFile);
          return this.httpClient.post("/api" + result.uploadLink, formData);
        }),
        tap({ next: closeDialog, error: closeDialog }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.addBotSubscription?.unsubscribe();
  }
}
