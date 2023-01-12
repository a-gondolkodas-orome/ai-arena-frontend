import { Subject } from "rxjs";
import { decode } from "../../utils";
import { BotUpdateEvent, botUpdateEventCodec, EVENT_TYPE__BOT } from "../../common";
import { environment } from "../../environments/environment";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export class Sse {
  static botEvents = new Subject<BotUpdateEvent>();

  static open(token: string) {
    if (this.isOpen) {
      throw new Error("Sse.open: already open");
    }
    fetchEventSource(environment.backendUrl + "/sse", {
      headers: { Authorization: `Bearer ${token}` },
      onmessage: (message) => {
        if (!message.data) return;
        let eventSubject;
        switch (message.event) {
          case EVENT_TYPE__BOT:
            eventSubject = this.botEvents;
            break;
          default:
            throw new Error(
              "Sse.onmessage: unknown event type " + message.event + ", data: " + message.data,
            );
        }
        eventSubject.next(decode(botUpdateEventCodec, JSON.parse(message.data)));
      },
      onerror: (error: unknown) => console.error("SSE error", error),
    }).catch((error) => console.error("SSE error", error));
  }

  static close() {
    if (!this.isOpen) {
      console.warn("Sse.close: already closed");
      return;
    }
    this.abortController.abort();
    this.isOpen = false;
  }

  protected static isOpen = false;
  protected static abortController = new AbortController();
}
