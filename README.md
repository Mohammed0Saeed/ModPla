### Setups
to make sure that this project works well you have to do the following:
1. Grant the access to a user with a password for mariadb database with the following commands: <br>
    ``CREATE USER 'user_name'@'localhost' IDENTIFIED BY 'your_password';`` <br>
    ``GRANT ALL PRIVILEGES ON modpla.* TO 'user_name'@'localhost';`` <br>
    ``FLUSH PRIVILEGES;``
2. Add your username and password to the config file in ``Backend/src/main/resources/application.properties``.
3. Get an API_key for GenAi from https://ai.google.dev/gemini-api/docs/api-key and add it to the config file.

### How do I run the program?
For the frontend use the command ``npm run dev`` <br>
For the backend use the command ``mvn spring-boot:run``