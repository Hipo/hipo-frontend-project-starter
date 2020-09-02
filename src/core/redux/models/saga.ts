import {CallEffect, CancelledEffect, PutEffect} from "redux-saga/effects";
import {ReduxAsyncAction} from "./action";

type AsyncSaga = IterableIterator<
  CallEffect | CancelledEffect | PutEffect<Omit<ReduxAsyncAction, "payload">>
>;

type AsyncSagaFactoryFunction = (payload: any) => AsyncSaga;

interface PollingSagaOptions {
  interval?: number;
}

export {AsyncSaga, AsyncSagaFactoryFunction, PollingSagaOptions};
