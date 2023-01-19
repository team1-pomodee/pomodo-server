# pomodo-server. 
create .env file in the source, and copy then paste the following information:    

PORT=5000.
MONGO_URL=mongodb+srv://singhsimer09:yyXuWPEIaQx9HVLp@cluster0.n1eczbu.mongodb.net/pomodee?retryWrites=true&w=majority
JWT_LIFETIME=30d. NODE_ENV=development

## Note
please use import or it will not work. Ex: const express = require('express') -> import express from 'express'

## Authentication. 
  localhost:5000/api/v1/auth/register - POST.   
  
   {
      "username": "user1",  
      "email": "user1@email.com",  
      "password": "123456"
  }. 

  localhost:5000/api/v1/auth/login - POST.  
  
  {
      "email": "user1@email.com",  
      "password": "123456" 
  }. 
# Pomodee

Pomodee is a <strong>fun-driven pomodoro timer.</strong>

## When you make a new branch,

- Name the branches as follows: <strong>`{yourInitial} / {ticketName}`</strong>\
  e.g. `bg / Authentication` : "Authentication" ticket being worked on by Bill Gates

## When you make commits,

- <strong>Keep these things in your mind!</strong>

<img src="img-readme/commit_message_1.jpg" style="width: 650px">

<img src="img-readme/commit_message_2.jpg" style="width: 650px">

- <strong>Additional resource</strong>

  - <em>Creating the Perfect Commit in Git</em>
    https://css-tricks.com/creating-the-perfect-commit-in-git/

  - <em>How to Write Better Git Commit Messages</em>
    https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/

## When you merge a branch,

- <strong>Test thoroughly</strong> and make sure <strong>there are no conflicts</strong>.
- ...Then go ahead and merge by yourself!
- If you find any problems after merging a branch, share it to the team, so that we can work on it together! :smile:

<hr>

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
