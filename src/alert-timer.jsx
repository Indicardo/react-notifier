import React, { useRef, useState, useEffect } from "react";
import { oneOf, string, func, bool, number } from "prop-types";

import Alert from "./alert";

import { ENTER_TIMEOUT, EXIT_TIMEOUT } from "./container";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const AlertTimer = (props) => {
  const [timer, setTimer] = useState();
  const [timerTimeout, setTimerTimeout] = useState();

  const setupTimer = (timeout, onDismiss) => {
    if (!timeout || !onDismiss) {
      // clear any timer we currently have
      clearTimeout(timer);
      setTimer(null);
      setTimerTimeout(null);
    } else {
      if (timer && timerTimeout != timeout) {
        // the timeout value has changed, setup a new timer
        clearTimeout(timer);
        setTimer(null);
      } // add new timer if we don't already have one

      if (!timer) {
        let temp = setTimeout(
          dismissAlert.bind(this, onDismiss),
          timeout + ENTER_TIMEOUT + EXIT_TIMEOUT
        );

        setTimer(temp);
        setTimerTimeout(timeout);
      }
    }
  };

  const dismissAlert = (onDismiss) => {
    // clear the timer if it hasn't fired yet
    clearTimeout(timer); // we don't need to keep track of any timers for this alert anymore

    setTimer(null);
    setTimerTimeout(null);

    onDismiss();
  };

  const prevProps = usePrevious({
    timeout: props.timeout,
    onDismiss: props.onDismiss,
  });

  useEffect(() => {
    if (
      !prevProps ||
      props.timeout != prevProps.timeout ||
      props.onDismiss != prevProps.onDismiss
    ) {
      setupTimer(props.timeout, props.onDismiss);
    }

    return () => setupTimer();
  }, [props.timeout, props.onDismiss]);

  const onDismiss = props.onDismiss
    ? dismissAlert.bind(this, props.onDismiss)
    : null;
  return <Alert {...props} onDismiss={onDismiss} />;
};

export default AlertTimer;

export const PropTypes = {
  type: oneOf(["info", "success", "warning", "danger"]),
  headline: string,
  onDismiss: func,
  dismissTitle: string,
  showIcon: bool,
  timeout: number,
};

AlertTimer.propTypes = PropTypes;
