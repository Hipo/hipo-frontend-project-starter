import React, {useState} from "react";
import classNames from "classnames";

import {ApiErrorShape} from "../../core/network-manager/networkModels";
import {generateErrorMessage} from "../../utils/error/errorUtils";
import {ArrayToUnion} from "../../utils/typeUtils";
import {ERROR_TYPES} from "../../utils/error/errorConstants";

export interface FormProps {
  testid: string;
  onSubmit: () => void;
  children: React.ReactNode;
  errorInfo: ApiErrorShape | null;
  knownErrorKeys: string[] | null;
  onChange?: (event: React.SyntheticEvent) => void;
  customClassName?: string;
  isSubmitAllowed?: boolean;
  skipErrorTypes?: Array<ArrayToUnion<typeof ERROR_TYPES>>;
}

function Form(props: FormProps) {
  const {
    children,
    testid,
    onSubmit,
    customClassName,
    errorInfo,
    knownErrorKeys,
    isSubmitAllowed = true,
    skipErrorTypes
  } = props;
  const [isPristine, setPristine] = useState(true);
  const containerClassName = classNames("form", customClassName);
  const formError = generateErrorMessage(errorInfo, {
    knownErrorKeys,
    skipTypes: skipErrorTypes
  });

  return (
    <form
      className={containerClassName}
      data-testid={testid}
      onChange={handleFormChange}
      onSubmit={handleSubmit}>
      {Boolean(formError) && (
        <p data-testid={`${testid}.form-error-message`} className={"form-error-message"}>
          {formError}
        </p>
      )}

      {children}
    </form>
  );

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.stopPropagation();
    event.preventDefault();

    if (isSubmitAllowed) {
      onSubmit();
    }
  }

  function handleFormChange(event: React.SyntheticEvent) {
    const {onChange} = props;

    if (isPristine) {
      setPristine(false);
    }

    if (onChange) {
      onChange(event);
    }
  }
}

export default Form;
