import { Component, OnDestroy } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { concatMap, filter, from, map, Subscription } from "rxjs";
import { RegisterGQL } from "../graphql/generated";
import { LoginStatusService } from "../services/login-status.service";
import { Router } from "@angular/router";
import { NotificationService } from "../services/notification.service";
import { handleGraphqlAuthErrors, handleValidationErrors } from "../error";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent implements OnDestroy {
  constructor(
    protected formBuilder: FormBuilder,
    protected register: RegisterGQL,
    protected notificationService: NotificationService,
    protected loginStatusService: LoginStatusService,
    protected router: Router,
  ) {}

  registrationForm = this.formBuilder.nonNullable.group({
    username: "",
    email: "",
    password: "",
  });
  hidePassword = true;

  protected registerSubscription?: Subscription;

  onSubmit() {
    this.registerSubscription = this.register
      .mutate({ registrationInput: this.registrationForm.getRawValue() })
      .pipe(
        map((result) => result.data),
        filter((value): value is Exclude<typeof value, null | undefined> => {
          if (value != null) return true;
          this.notificationService.error("No data returned from registration");
          return false;
        }),
        map((data) => data.register),
        handleGraphqlAuthErrors(this.notificationService),
        handleValidationErrors(
          "RegistrationError" as const,
          this.notificationService,
          this.registrationForm,
        ),
        concatMap((register) => {
          this.loginStatusService.login(register.token);
          return from(this.router.navigate([""]));
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.registerSubscription?.unsubscribe();
  }
}
