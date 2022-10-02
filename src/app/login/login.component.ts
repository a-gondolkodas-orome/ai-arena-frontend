import { Component, OnDestroy } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { concatMap, from, map, Subscription } from "rxjs";
import { LoginGQL } from "../graphql/generated";
import { LoginStatusService } from "../services/login-status.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationService } from "../services/notification.service";
import { handleGraphqlAuthErrors } from "../error";

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
    protected router: Router,
    protected route: ActivatedRoute,
  ) {}

  loginForm = this.formBuilder.nonNullable.group({
    email: "",
    password: "",
  });
  hidePassword = true;

  protected loginSubscription?: Subscription;

  onSubmit() {
    this.loginSubscription = this.loginGQL
      .fetch({ credentials: this.loginForm.getRawValue() })
      .pipe(
        map((result) => result.data.login),
        handleGraphqlAuthErrors(this.notificationService),
        concatMap((login) => {
          this.loginStatusService.login(login.token);
          return from(
            this.router.navigate([
              this.route.snapshot.queryParamMap.get(
                LoginComponent.QUERY_PARAM__RETURN_URL,
              ) ?? "",
            ]),
          );
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.loginSubscription?.unsubscribe();
  }
}
