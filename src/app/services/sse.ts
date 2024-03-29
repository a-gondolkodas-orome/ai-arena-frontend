import { Subject } from "rxjs";
import { decode } from "../../utils";
import {
  BotUpdateEvent,
  botUpdateEventCodec,
  EVENT_TYPE__BOT,
  EVENT_TYPE__MATCH,
  MatchUpdateEvent,
  matchUpdateEventCodec,
} from "../../common";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export class Sse {
  static botEvents = new Subject<BotUpdateEvent>();
  static matchEvents = new Subject<MatchUpdateEvent>();

  static open(token: string) {
    this.close();
    this.abortController = new AbortController();
    fetchEventSource("/api/sse", {
      headers: { Authorization: `Bearer ${token}` },
      onmessage: (message) => {
        if (!message.data) return;
        switch (message.event) {
          case EVENT_TYPE__BOT:
            this.botEvents.next(decode(botUpdateEventCodec, JSON.parse(message.data)));
            break;
          case EVENT_TYPE__MATCH:
            this.matchEvents.next(decode(matchUpdateEventCodec, JSON.parse(message.data)));
            break;
          default:
            throw new Error(
              "Sse.onmessage: unknown event type " + message.event + ", data: " + message.data,
            );
        }
      },
      // eslint-disable-next-line no-console
      onerror: (error: unknown) => console.error("SSE error", error),
      signal: this.abortController.signal,
      // eslint-disable-next-line no-console
    }).catch((error) => console.error("SSE error", error));
  }

  static close() {
    if (!this.abortController) return;
    this.abortController.abort();
    this.abortController = undefined;
  }

  protected static abortController?: AbortController;
}
