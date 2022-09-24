import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Apollo, graphql } from "apollo-angular";
import { Subscription } from "rxjs";
import { LoginResponse } from "../../models/auth";
import { AuthService } from "../auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { decode } from "../../utils";
import { aiArenaExceptionCodec, ErrorType } from "../../errors";

type LoginQueryResponse = { login: LoginResponse };

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  static readonly OPERATION_NAME = "Login";
  static readonly LOGIN_QUERY = graphql`
    query ${LoginComponent.OPERATION_NAME}($credentials: Credentials!) {
      login(credentials: $credentials) {
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

  loginForm = this.formBuilder.group({
    email: "",
    password: "",
  });
  hidePassword = true;

  protected loginSubscription?: Subscription;

  onSubmit() {
    this.loginSubscription = this.apollo
      .query<LoginQueryResponse>({
        query: LoginComponent.LOGIN_QUERY,
        variables: { credentials: this.loginForm.value },
      })
      .subscribe({
        next: async ({ data }) => {
          AuthService.saveToken(data.login.token);
          await this.router.navigate([""]);
        },
        error: (error) => {
          const errorData = decode(
            aiArenaExceptionCodec,
            JSON.parse(error.message),
          );
          this.errorNotification.open(
            errorData.type === ErrorType.AUTHENTICATION_ERROR
              ? errorData.message
              : error.message,
            "x",
            {
              duration: 5000,
              verticalPosition: "bottom",
            },
          );
        },
      });
  }
}
