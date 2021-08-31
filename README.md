# Ordersbook Web App

In a nutshell I decided to create a web worker that is used to communicate with orders feed websocket. The react app queries (polls) then the webworker for data ready to be displayed.

## Webworker
Webworker is a script that is being executed parallel to the js main thread in browser. 

In the web app the webworker is used to maintain the websocket connection state, handle the messages, and prepare the orders data (resolve deltas, group, sort etc.) for the app to consume. That way it relieves the main thread from having to deal with all of this on top of rendering the app.
![Zrzut ekranu 2021-09-1 o 00 11 16](https://user-images.githubusercontent.com/2019970/131582663-0905f18e-e103-4094-8ad0-2bf7b01e5c3c.png)

## State Management
The web app is using react's context for its state management.

You may notice that there is three providers. 
![Zrzut ekranu 2021-09-1 o 00 19 02](https://user-images.githubusercontent.com/2019970/131583050-5de58cda-6c81-4a1c-a1ba-6f6a1638832b.png)

### OrdersFeedProvider
Acts as means of creating the webworker and passing its handle to the `OrdersFeedCallerProvider` and `OrdersFeedStateProvider`. Any webworker setup and clean-up should be done here.

### OrdersFeedCallerProvider
Provides an interface to communicate with the order feed webworker. For example to request the webworker to change the current subscription from XBT/USD to ETH/USD.

This interface should never change therefore it's important to seperate it out from data provided by the orders feed that changes very frequently. That way children of components which use the `OrdersFeedCallerContext` but not the `OrdersFeedStateContext` will not have to re-render.

### OrdersFeedStateProvider
Having explained the reasoning behind the two above providers. I think the role of this provider is self-explanatory. It is meant to provide the orders feed state (data) exposed by the webworker. When, how and why I am happy to discuss in the later stage. :)



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


