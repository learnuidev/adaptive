# Directory Structure

All the source code is defined in `/src` directory. Lets break it down into subdirectories:

- `/src/components`: All React components.
- `/src/hooks`: Custom React hooks.
- `/src/utils`: General-purpose utility functions.
- `/src/modules`: Contains business logic modules. Each module should have a clear responsibility. Each module consists of three things: types, react-query hooks, and utility functions. This is where we define our apis and server side state logic.
- `/src/lib`: Contains third-party libraries and utilities.
- `/src/pages`: Contains top-level pages. Each page should have a clear responsibility. Each page consists of three things: types, react-query hooks, and utility functions. This is where we define our apis and server side state logic.
