import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Apollo, graphql } from "apollo-angular";
import { RegistrationResponse } from "../../models/auth";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";
import { aiArenaExceptionCodec, ErrorType } from "../../errors";
import { decode } from "../../utils";
type RegisterMutationResponse = { register: RegistrationResponse };

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent {
  static readonly REGISTER_MUTATION = graphql`
    mutation Register($userData: UserData!) {
      register(userData: $userData) {
        token
      }
    }
  `;

  constructor(
    protected formBuilder: FormBuilder,
    protected apollo: Apollo,
    protected errorNotification: MatSnackBar,
    protected router: Router,
  ) {}

  registrationForm = this.formBuilder.group({
    username: "",
    email: "",
    password: "",
  });
  hidePassword = true;

  protected registerSubscription?: Subscription;

  onSubmit() {
    this.registerSubscription = this.apollo
      .mutate<RegisterMutationResponse>({
        mutation: RegistrationComponent.REGISTER_MUTATION,
        variables: { userData: this.registrationForm.value },
      })
      .subscribe({
        next: async ({ data }) => {
          if (!data)
            throw new Error(
              "RegistrationComponent: no data returned from registration",
            );
          AuthService.saveToken(data.register.token);
          await this.router.navigate([""]);
        },
        error: (error) => {
          const errorData = decode(
            aiArenaExceptionCodec,
            JSON.parse(error.message),
          );
          if (errorData.type === ErrorType.VALIDATION_ERROR) {
            for (const [field, errors] of Object.entries(
              errorData.fieldErrors ?? {},
            )) {
              this.registrationForm
                .get(field)
                ?.setErrors({ serverError: errors.join(", ") });
            }
            if (errorData.nonFieldErrors) {
              this.errorNotification.open(
                errorData.nonFieldErrors.join(", "),
                "x",
                {
                  duration: 5000,
                  verticalPosition: "bottom",
                },
              );
            }
          } else {
            this.errorNotification.open(error.message, "x", {
              duration: 5000,
              verticalPosition: "bottom",
            });
          }
        },
      });
  }
}
