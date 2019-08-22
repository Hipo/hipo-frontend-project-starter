# Hipo Frontend TypeScript Project Template

[![dependencies][dependencies-image] ][dependencies-url]
[![devdependencies][devdependencies-image] ][devdependencies-url]

This template includes all the configurations for kick-starting a project with React and TypeScript.

## Table of Contents

- [Setup](#setup)
- [Development and Releases](#development-and-releases)
- [GIT Hooks](#git-hooks)
- [Changelog Generation](#changelog-generation)
- [More Information](#more-information)

## Setup

For now, you need to manually copy-paste all the files from the template into your directory. Eventually, there will be a command-line tool that does this for you. After you copied all the files in this template, you will need to take the following steps:

- This project requires Node >= 10.x and npm >= 6.x for proper development environment.

1. Update necessary fields inside `package.json` for your projects.

2. Go over all the files inside `config` folder and update them with your project's necessities. Here you will find the following configuration files:

- `apiConfig:` Configurations for the API requests in different environments.
- `assetConfig:` Paths for the assets in different environments
- `s3Config:` S3 configurations for different environments.

3. Update `changelog-context-variables.json` to include your project's `codebaseProjectName`.

4. Run `npm install` to install dependencies.

5. Check commented out code for Sentry integration. You will find them inside `index.tsx` and `NetworkManager.ts`. Make sure to check `sentryHandler.ts` for correcting integration.

## Development and Releases

### Starting the development server

```shell
npm start
```

This will build out the frontend for development environment. It is an alias for `npm run build:dev:live`. This will use the `webpack.dev.config.js` file and start out the webpack dev server with `local` being the target environment. If you want to build in another environment then do `npm run build:dev:live -- --env.target=TARGET_ENV` where TARGET_ENV may be one of the following: production, staging or local (or preproduction, if you add it). You can simply run `npm run build:dev` if you don't want to listen for changes.

It is recommended to split your terminal and run `npm start` in one and `npm run type-check:watch` in another. `npm run type-check` offers cleaner output when you have errors from the `tsc`.

### Releases

```shell
npm run build:release -- --env.target=RELEASE_TARGET --env.awsAccessKeyId=AWS_ACCESS_KEY_ID_FOR_YOUR_TARGET_ENV --env.awsSecretAccessKey=AWS_SECRET_ACCESS_KEY_FOR_YOUR_TARGET_ENV
```

This will generate `/build` folder with static files to serve. `RELEASE_TARGET` may be one of the following: production, staging or local (or preproduction, if you add it). During server deployment (executed by the CI jobs), RELEASE_TARGET is derived by the branch name (currently can be staging, or production).

## GIT Hooks

There is a `pre-commit` git hook which runs `npm run lint; npm run type-check;` script when you want to commit your changes. If any of them fails, it won't allow you to commit. You can still force commit by telling git to skip pre-commit, but you shouldn't.

Also, a `pre-push` git hook which runs `npm run test` script when you want to push your changes. If any of them fails, it won't allow you to push.

## Changelog Generation

```shell
npm run changelog
```

This will generate a changelog from your commits. Refer to its [repo](https://github.com/Hipo/hipo-web-conventional-changelog) for details.

## More Information

### Routing

The template already have `protected` and `public` route system. Dig into `src/core/route/` to see how it works. There you will find an example of one public route that passes a prop to its component and a lazy loaded protected route.

### Authentication

The template is generated with the token authentication in mind. `webStorage` and `authenticationManager` utilities are generated for this purposes. `authenticationManager` allows you to store or retrieve the token with the help of `webStorage`. `authenticationState` is added to the root Redux Store. This state has to have an `authenticateProfile` key which is used for the functionality behind `protectedRoutes`. When you authenticate your user in your application, you need to save the user data as the value of `authenticateProfile`.

### Network Manager

The template has a network manager and an api handler utility which needs to be used when making requests with `axios`. An example for a GET request:

```typescript
function listBuyerPO(
  {projectId, params}: {projectId: string; params?: TBuyerPOListRequestParams},
  cancelToken?: CancelToken
) {
  return apiHandler<IListResponse<IBuyerPO[]>>(
    manufacturitApiManager,
    "get",
    `/projects/${projectId}/buyer-purchase-orders/`,
    {
      settings: {
        params,
        cancelToken
      }
    }
  );
}
```

These functions would usually be inside a file named as, e.g., `buyerPOApiHandlers.ts`. As you can see `apiHandler` allows you to type the returned promise. These types would usually be defined inside a file named as, e.g., `buyerPOApiModels.ts`.

## Redux and Redux-saga

Redux and redux-saga integration is already available with the template. For the asynchronous actions, you can use `asyncReduxAutomator` tool to speed up the generation of necessary action creators, saga watchers, etc. For example, for the buyer PO list request above you can create a `redux` namespace object with:

```typescript
const initialBuyerPOListState = getMinimalAsyncListStoreState<IBuyerPO>([]);

const buyerPOListReduxNamespace = {
  initialState: initialBuyerPOListState,
  ...asyncReduxAutomator("listBuyerPO", listBuyerPO, initialBuyerPOListState, "list")
};
```

`buyerPOListReduxNamespace` will now have `initialState`, `actionTypes`, `actionCreators`, `saga`, `watcher`, `reducer` keys which you can use to integrate into your Redux store.

_Note:_ `promisifyAsyncActionsMiddleware` is added to Redux to promisify `REQUEST_TRIGGER` actions.

### Modals

This template utilizes [react-modal](https://reactcommunity.org/react-modal/) library for implementing modals. There is a component called `Modal` that uses `react-modal` in the background that lets you generate modals easily. An example modal named as `ReportModal` is generated.

### TypeScript Declarations Files

These files should be gathered inside `/src/core/declarations/`.

### Tests

```shell
npm run test
```

Tests can be run by executing the command above. Tests files should be placed right below the original implementation file, see `numberUtils` for example inside `/src/utils/number/`.

### Recommended folder structure

Group by main modules or routes for the project:

```
├── config
└── src
    └── components                              <- Where common components of the project are placed
        └── button
        └── dropdown
        └── form
    ├── core                                    <- Core functionality, routes and root app is here
    ├── dashboard                               <- Homepage related stuff
    └── home                                    <- Homepage related stuff
        ├── api
            └──homeApiHandlers.ts               <- Api handler functions are defined here
            └──homeApiModels.ts                 <- Api models are defined here
        ├── invester
            └── _invester-homepage.scss
            └── InvesterHomepage.tsx
            └── InvesterHomepage.test.ts
        ├── advisor
            └── _advisor-homepage.scss
            └── AdvisorHomepage.tsx
            └── AdvisorHomepage.test.ts
        ├── redux
            └── advisor
                └── advisorHomeReduxState.ts
                └── advisorStatsReduxState.ts
            └── investor
                └── investorHomeReduxState.ts
                └── investorStatsReduxState.ts
            └── homeReduxState.ts                 <- Main `homeState`, its reducer and saga factory are defined here
            └── utils
                └── homeReduxUtils.ts
                └── homeReduxUtils.test.ts
        └── utils
            └── homeUtils.ts
            └── homeUtils.test.ts
```

_NOTE:_ Avoid a deeply nested structure and don't overthink it.
