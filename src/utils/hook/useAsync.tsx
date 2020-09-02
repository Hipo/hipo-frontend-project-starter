import React, {useState, useRef} from "react";
import Axios, {CancelTokenSource} from "axios";

import {MANUALLY_CANCELLED_ERROR_TYPE} from "../error/errorConstants";
import {generateFinalError} from "../../core/network-manager/networkUtils";
import {ApiHandlerCreator} from "../../core/network-manager/apiHandler";
import {MinimalAsyncStoreState} from "../../core/redux/models/store";

interface UseAsyncHookRequestProps<
  ResponseType extends any,
  ApiHandlerArgument extends any
> {
  handlerCreator: ApiHandlerCreator<ApiHandlerArgument, ResponseType>;
  argumentGenerator: () => ApiHandlerArgument;
}

interface UseAsyncHookOptions<ResponseType extends any, ApiHandlerArgument extends any> {
  onSuccess?: (data: ResponseType) => void;
  onFailure?: (error?: any, apiHandlerFirstArgument?: ApiHandlerArgument) => void;
  shouldMakeRequest?: () => boolean;
  keepPreviousData?: boolean;
}

function useAsync<ResponseType extends any, ApiHandlerArgument extends any>(
  asyncProps: UseAsyncHookRequestProps<ResponseType, ApiHandlerArgument>,
  effectDependencies: any[] = [],
  hookOptions: UseAsyncHookOptions<ResponseType, ApiHandlerArgument> = {}
) {
  const {
    onSuccess = () => undefined,
    onFailure = () => undefined,
    shouldMakeRequest = () => true,
    keepPreviousData = false
  } = hookOptions;
  const [asyncState, setAsyncState] = useState<MinimalAsyncStoreState<ResponseType>>({
    isRequestPending: false,
    isRequestFetched: false,
    data: null,
    errorInfo: null
  });
  const isCancelledRef = useRef(false);
  const cancelSource = useRef<null | CancelTokenSource>(null);

  React.useEffect(() => {
    if (shouldMakeRequest()) {
      (async function useAsyncEffectBody() {
        const {handlerCreator, argumentGenerator} = asyncProps;
        const apiHandlerFirstArgument = argumentGenerator();

        cancelSource.current = Axios.CancelToken.source();
        isCancelledRef.current = false;

        setAsyncState({
          isRequestPending: true,
          isRequestFetched: false,
          data: keepPreviousData ? asyncState.data : null,
          errorInfo: null
        });

        try {
          const {data} = await handlerCreator(
            apiHandlerFirstArgument,
            cancelSource.current.token
          );

          cancelSource.current = null;

          if (!isCancelledRef.current) {
            setAsyncState({
              isRequestPending: false,
              isRequestFetched: true,
              data,
              errorInfo: null
            });
          }

          onSuccess(data);
        } catch (error) {
          const {data: errorInfo} = error as ReturnType<typeof generateFinalError>;
          const isManuallyCancelledError =
            errorInfo?.type === MANUALLY_CANCELLED_ERROR_TYPE;

          cancelSource.current = null;

          if (!isManuallyCancelledError) {
            onFailure(errorInfo || error, apiHandlerFirstArgument);
          }

          if (!isCancelledRef.current) {
            setAsyncState({
              isRequestPending: false,
              isRequestFetched: true,
              data: null,
              errorInfo: isManuallyCancelledError ? null : errorInfo,
              requestPayload: apiHandlerFirstArgument
            });
          }
        }
      })();
    }

    return () => {
      if (cancelSource && cancelSource.current) {
        isCancelledRef.current = true;
        cancelSource.current.cancel(MANUALLY_CANCELLED_ERROR_TYPE);
      }
    };

    // eslint-disable-next-line
  }, effectDependencies);

  return asyncState;
}

/* USAGE

  const getDetailRequestState = useAsync({
    handlerCreator: usersApi.getStudent,
    payload: studentId
  });

  const updateRequestState = useAsync(
    {
      handlerCreator: usersApi.updateStudent,
      payload: {studentId, payload: {email: emailFromState}}
    },
    [shouldUpdateStudent, studentId, emailFromState],
    {
      shouldMakeRequest() {
        return shouldUpdateStudent;
      },
      onSuccess(newStudent) {
        console.log(newStudent);
        history.push(secondLastBreadcrumbTrailItem.location);
      },
      onFailure(error, passedInApiHandlerArgument) {
        console.log(error.errorDetail, passedInApiHandlerArgument);
        setShouldUpdateStudentState(false);
      }
    }
  );

*/

export default useAsync;
