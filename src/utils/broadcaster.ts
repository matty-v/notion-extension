import { filter, map, Observable, Subject } from 'rxjs';

export enum Events {
  'Notify',
  'Loading',
}

type BroadcastEvent = {
  key: Events;
  payload: any;
};

const eventBus = new Subject<BroadcastEvent>();

export const broadcast = <T>(key: Events, payload?: T) => {
  eventBus.next({ key, payload });
};

export const on = <T>(key: Events): Observable<T> => {
  return eventBus.asObservable().pipe(
    filter((event: BroadcastEvent) => event.key === key),
    map((event: BroadcastEvent) => event.payload as T),
  );
};
