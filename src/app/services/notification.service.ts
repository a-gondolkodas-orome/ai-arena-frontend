import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Time } from "../../utils";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  static readonly SNACKBAR_MAX_LENGTH = 200;

  constructor(protected notification: MatSnackBar) {}

  success(message: string, duration = 5 * Time.second) {
    if (message.length > NotificationService.SNACKBAR_MAX_LENGTH) {
      console.log(message);
      message =
        message.substring(0, NotificationService.SNACKBAR_MAX_LENGTH) + "…";
    }
    this.showNotificationSnackbar(
      message,
      duration,
      "notification-service-success",
    );
  }

  error(message: string, duration = 5 * Time.second) {
    if (message.length > NotificationService.SNACKBAR_MAX_LENGTH) {
      console.error(message);
      message =
        message.substring(0, NotificationService.SNACKBAR_MAX_LENGTH) + "…";
    }
    this.showNotificationSnackbar(
      message,
      duration,
      "notification-service-error",
    );
  }

  info(message: string, duration = 5 * Time.second) {
    if (message.length > NotificationService.SNACKBAR_MAX_LENGTH) {
      console.info(message);
      message =
        message.substring(0, NotificationService.SNACKBAR_MAX_LENGTH) + "…";
    }
    this.showNotificationSnackbar(
      message,
      duration,
      "notification-service-info",
    );
  }

  protected showNotificationSnackbar(
    message: string,
    duration: number,
    panelClass: string,
  ) {
    this.notification.open(message, "x", {
      duration,
      verticalPosition: "top",
      horizontalPosition: "right",
      panelClass: ["notification-service", panelClass],
    });
  }
}
