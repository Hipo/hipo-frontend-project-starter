import * as Sentry from "@sentry/browser";

import packageJson from "../../package.json";
import {UserProfileModel} from "../authentication/model/authenticationEndpointModels";
import {isDevelopmentEnv, isStaging} from "../utils/globalVariables";

interface SentryExceptionExtraData {
  title: string;
  data: any;
}

type TSentryUserInfo =
  | UserProfileModel
  | {
      username: string;
    };

const SENTRY_DNS = "WHATEVER_IT_IS";
const SENTRY_PROJECT_SLUG = "HIPO_PROJECT_TEMPLATE";
const isDevEnv = isDevelopmentEnv();

function initSentry() {
  if (!isDevEnv) {
    const config: Sentry.BrowserOptions = {
      dsn: SENTRY_DNS,
      release: `${SENTRY_PROJECT_SLUG}@${packageJson.version}`,
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

function sendSentryAnException(error: any, extra?: SentryExceptionExtraData) {
  if (!isDevEnv) {
    Sentry.withScope((scope) => {
      if (extra) {
        scope.setExtra(extra.title, extra.data);
      }
      Sentry.captureException(error);
    });
  }
}

function showReportDialog() {
  if (!isDevEnv) {
    Sentry.showReportDialog();
  }
}

function setUserContextForSentry(userInfo: TSentryUserInfo) {
  Sentry.configureScope((scope) => {
    scope.setUser(userInfo);
  });
}

export {initSentry, sendSentryAnException, showReportDialog, setUserContextForSentry};
