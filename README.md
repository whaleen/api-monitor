# API Monitor

A Chrome extension for capturing and monitoring API calls, with a development web interface. We are monitoring all network requests and responses w/ the chrome extension and running a server and then connecting to that server to display the data in a web app. These are the three main working parts of this project. You need to run the browser extension, the server, and the web app all together.

Please check the `extension` code to see how we are capturing the network requests and responses. The `server` code is where we are storing the data and serving it to the web app. The `web` code is where we are displaying the data.

Todo: make the above descriptive information more concise.

## Setup

```bash
# Install dependencies
npm install
```

## Development

This project has three main components that need to be run separately in their own terminals:

### 1. Chrome Extension

```bash
# Build and watch extension (run in one terminal)
npm run dev:extension
```

Then:

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `dist` folder
4. The extension will now monitor API calls in every tab (hopefully)

After making changes to extension code:

- The build will automatically update
- Click the refresh icon on the extension in `chrome://extensions/` to load the changes

### 2. Web Application

```bash
# Run the web app development server (run in one terminal)
npm run dev
```

This will start the development server at http://localhost:5173

### 3. Server

````bash
# Run the server (run in one terminal)
npm run server


## Project Structure

```todo
````

## Scripts

- `npm run dev` - Run web app development server
- `npm run dev:extension` - Build and watch extension
- `npm run build` - Production build of both web app and extension
- `npm run build:extension` - Production build of extension only
- `npm run preview` - Preview production build
- `npm run lint` - Run linter
- `npm run cleen` - Remove `dist-extension` and `node_modules` folders

## Todo

- [ ] rename `lib/utils.js` to `lib/utils/tailwind.js and update imports.
- [ ] move websocket code from the App.js to the `hooks/use-websocket.jsx` file.
- [x] find out the best way to display favicons for each site we are displaying responses from in the web app. the google favicon api is not working which it should but our cors policy is not allowing it. at least i think that is why.
- [ ] normalizer - keep this as a base nomalizer and do not get too domain specefic. explore options for creating a `normalizer` lib so we can have a custom normalizer for each domain (claude.ai, bullx.io, gmgn.ai, etc...).
