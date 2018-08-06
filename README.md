# collaboration-online-judgement


## Overview:
This web App is serves as a combination of “google docs” and “online judgement”. It supports collaboration coding for a specific question. 
After logging in to same session/question, users can see theircollaboration coders in this session, and they can see each other’s actions immediately, 
just like google docs. Users can also search their problems by keywords and a problem list that include these keywords will show up.

After clicking submit button, a python server is served as an executor to execute the code that users submitted on Docker. The executor now 
supports Java and Python, which is easy to add more language usingsame methods. After that, users can see their results that shown at the bottom of the page.

I use MongoDB as my database to store all the coding problems. I also use Redis as in-memory store in order to save the session info and user info as cache. 
It will expire in one hour after the user disconnect from the server or close the webpage.

Nginx service is used as a reverse proxy for load balancing. It can protect the server when a huge amount of request is 
coming in. Right now, I’m using round-robin as the methods for load balancing.

## Frameworks and tools used:
Angular5(ES2015), Node.js, Express, Flask, Redis, Socket.io, MongoDB
Docker, RESTful API, Nginx.

####  --to see the demo of the App, check the demo pdf--


## to start the app:

first terminal: run python executor server
```
 $cd executor 
 $pip install -r requirements.txt
 $python3 executor_server.py
```
second terminal: cliend side
```
 $cd oj-client
 $npm install
 $ng -build --watch
```
third terminal:  node server
```
$cd oj-server
$npm install
$npm start
```

now go to localhost:3000, everything will be render on screen. loggin in to localhost:3000 can simulate multiple users

