import { Component, OnDestroy } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { concatMap, filter, from, map, of, Subscription } from "rxjs";
import { RegisterGQL } from "../graphql/generated";
import { LoginStatusService } from "../services/login-status.service";
import { Router } from "@angular/router";
import { NotificationService } from "../services/notification.service";
import { handleGraphqlAuthErrors } from "../error";

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
      .mutate({ registrationData: this.registrationForm.getRawValue() })
      .pipe(
        map((result) => result.data),
        filter(<T>(value: T): value is Exclude<T, null | undefined> => {
          if (value != null) return true;
          this.notificationService.error("No data returned from registration");
          return false;
        }),
        map((data) => data.register),
        handleGraphqlAuthErrors(this.notificationService),
        concatMap((register) => {
          if (register.__typename === "RegistrationSuccess") {
            this.loginStatusService.login(register.token);
            return from(this.router.navigate([""]));
          } else {
            for (const field of ["username", "email"] as const) {
              const errors = register.fieldErrors?.[field];
              if (errors) {
                this.registrationForm
                  .get(field)
                  ?.setErrors({ serverError: errors.join(", ") });
              }
            }
            if (register.nonFieldErrors) {
              this.notificationService.error(
                register.nonFieldErrors.join("\n"),
              );
            }
            return of(null);
          }
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.registerSubscription?.unsubscribe();
  }
}
