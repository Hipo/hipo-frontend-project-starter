import "./_counter.scss";

import React, {useState} from "react";
import classNames from "classnames";
import {RouteComponentProps} from "@reach/router";

type TCounterProps = {
  customClassName?: string;
} & RouteComponentProps;

function Counter({customClassName}: TCounterProps) {
  const [value, setValue] = useState(0);
  const containerClassName = classNames("counter-container", customClassName);

  return (
    <div className={containerClassName}>
      <p id={"Counter.value"} className={"counter-value"}>
        {value}
      </p>

      <button id={"Counter.increment"} onClick={handleIncrement}>
        {"+"}
      </button>

      <button id={"Counter.decrement"} onClick={handleDecrement}>
        {"-"}
      </button>
    </div>
  );

  function handleIncrement() {
    setValue(value + 1);
  }

  function handleDecrement() {
    setValue(value - 1);
  }
}

export default Counter;
