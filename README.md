# easy-erp-test-task

1. Run npm install for installing dependencies. 
2. Change environment variables and node_env according to requirement.
3. Set database credentials in config/config.json according to requirement.
   for example : if NODE_ENV is production in .env file then you need to set database credential in production block of config/config.json file.
4. Run sequelize db:migrate
5. start the server by running : npm start(this will run the project in pm2 ecosystem)


6. admin user have all access like get all users , get a user , delete and update a user.
7. a user can not get all users , delete other user , update other user and get other user.
8. login based authentication is performed , if you logged in using admin then you have all access.

9. admin login details : {
    "email":"admin@gmail.com",
    "password":"admin@123",
    "role":"admin"
}

10. basiAuth : 1234;