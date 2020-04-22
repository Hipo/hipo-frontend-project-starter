import * as Sentry from "@sentry/browser";

import packageJson from "../../package.json";
import sentryConfig from "../../config/sentryConfig.json";
import {isDevelopmentEnv, isStaging} from "../utils/globalVariables";

interface SentryExceptionExtraData {
  title: string;
  data: any;
}

type TSentryUserInfo = {
  id: string;
  email: string;
};

const isDevEnv = isDevelopmentEnv();

function initSentry() {
  if (!isDevEnv) {
    const config: Sentry.BrowserOptions = {
      dsn: sentryConfig.dsn,
      release: `${sentryConfig.projectSlug}@${packageJson.version}`,
      environment: TARGET_ENV_TYPE,
      attachStacktrace: true,
      integrations: (integrations) => {
        // integrations will be all default integrations
        return [
          ...integrations.filter((integration) => integration.name !== "GlobalHandlers"),
          new Sentry.Integrations.GlobalHandlers({
            onerror: true,
            onunhandledrejection: false
          })
        ];
      }
    };

    if (isStaging()) {
      config.debug = true;
    }

    Sentry.init(config);
  }
}

function sendSentryAnException(
  error: any,
  extra?: SentryExceptionExtraData,
  onCapture?: (eventId: string) => void
) {
  if (!isDevEnv) {
    Sentry.withScope((scope) => {
      if (extra) {
        scope.setExtras(extra);
      }

      const eventId = Sentry.captureException(error);

      if (onCapture) {
        onCapture(eventId);
      }
    });
  }
}

function showReportDialog(eventId: string) {
  if (!isDevEnv) {
    Sentry.showReportDialog({eventId});
  }
}

function setUserContextForSentry(userInfo: TSentryUserInfo | null) {
  if (!isDevEnv) {
    Sentry.configureScope((scope) => {
      scope.setUser(userInfo);
    });
  }
}

export {initSentry, sendSentryAnException, showReportDialog, setUserContextForSentry};
