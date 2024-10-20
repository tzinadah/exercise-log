This is an api designed to keep track of users and their exercise log

API endpoints are:
GET /register -> return registery page
GET / -> return main api page
GET /users -> return json file of all usernames
GET /$username/log -> return page for adding exercise
GET /$username -> return exercies of a user
POST /register/submit -> adds username to users
POST /$username/log/submit -> add exercies 