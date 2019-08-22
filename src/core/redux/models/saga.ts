import {CallEffect, CancelledEffect, PutEffect} from "redux-saga/effects";
import {TReduxAsyncAction} from "./action";

type TAsyncSaga = IterableIterator<
  CallEffect | CancelledEffect | PutEffect<Omit<TReduxAsyncAction, "payload">>
>;

type TAsyncSagaFactoryFunc = (payload: any) => TAsyncSaga;

export {TAsyncSaga, TAsyncSagaFactoryFunc};
