import { Component, OnDestroy } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { map, Subscription, tap } from "rxjs";
import { LoginGQL } from "../graphql/generated";
import { LoginStatusService } from "../services/login-status.service";
import { ActivatedRoute } from "@angular/router";
import { NotificationService } from "../services/notification.service";
import { handleGraphqlAuthErrors } from "../error";
import { symbolHideUserInfo } from "../../types";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnDestroy {
  static readonly QUERY_PARAM__RETURN_URL = "returnUrl";

  constructor(
    protected formBuilder: FormBuilder,
    protected loginGQL: LoginGQL,
    protected notificationService: NotificationService,
    protected loginStatusService: LoginStatusService,
    protected route: ActivatedRoute,
  ) {}

  [symbolHideUserInfo] = true;

  loginForm = this.formBuilder.nonNullable.group({
    email: "",
    password: "",
  });
  hidePassword = true;

  protected loginSubscription?: Subscription;

  onSubmit() {
    this.loginSubscription = this.loginGQL
      .fetch({ credentials: this.loginForm.getRawValue() }, { fetchPolicy: "no-cache" })
      .pipe(
        map((result) => result.data.login),
        handleGraphqlAuthErrors(this.notificationService),
        tap((login) => {
          this.loginStatusService.login(
            login.token,
            this.route.snapshot.queryParamMap.get(LoginComponent.QUERY_PARAM__RETURN_URL) ??
              undefined,
          );
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.loginSubscription?.unsubscribe();
  }
}
