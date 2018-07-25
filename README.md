# collaboration-online-judgement
This is the Online judgement system web app.

to start the app, do the following:

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
