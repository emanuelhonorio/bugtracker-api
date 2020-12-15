# BugTracker API

**BugTracker** é uma aplicação que serve para gerenciar bugs em projetos. No BugTracker você pode criar projetos e enviar convites para usuários (o usuário tem o poder de aceitar ou recusar o convite). Se aceito o convite, o usuário torna-se um membro, assim você poderá criar Bugs e contar com sua equipe para solucioná-lo.

Esse **BugTracker** foi um projeto **planejado e desenvolvido por mim** e não é um projeto baseado em nenhum curso.

## Live Demo

Link : https://bugtracker-ui.herokuapp.com/

## Front-end Repository

Link: https://github.com/emanuelhonorio/bugtracker-web

## Project Structure

```
📦src
 ┣ 📂config
 ┃ ┣ 📜jwtConfig.js
 ┃ ┗ 📜sequelizeConfig.js
 ┣ 📂controllers
 ┃ ┣ 📜auth-controller.js
 ┃ ┣ 📜bug-controller.js
 ┃ ┣ 📜invite-controller.js
 ┃ ┣ 📜member-controller.js
 ┃ ┣ 📜notification-controller.js
 ┃ ┣ 📜project-controller.js
 ┃ ┗ 📜user-controller.js
 ┣ 📂middlewares
 ┃ ┗ 📜auth-middleware.js
 ┣ 📂models
 ┃ ┣ 📜bug.js
 ┃ ┣ 📜invite.js
 ┃ ┣ 📜project.js
 ┃ ┣ 📜user.js
 ┃ ┗ 📜usersProjects.js
 ┣ 📂schemas
 ┃ ┗ 📜notification.js
 ┣ 📂services
 ┃ ┣ 📜invite-service.js
 ┃ ┗ 📜project-service.js
 ┣ 📜app.js
 ┣ 📜routes.js
 ┗ 📜server.js
 📦database
 ┣ 📂migrations
 ┃ ┣ 📜20200916000115-create-user.js
 ┃ ┣ 📜20200916000940-create-project.js
 ┃ ┣ 📜20200916002120-create-users-projects.js
 ┃ ┣ 📜20200916003657-create-bug.js
 ┃ ┣ 📜20200916005201-create-invite.js
 ┃ ┗ 📜20200918235442-add-imageUrl-to-user.js
 ┣ 📂seeds
 ┗ 📜index.js
 📜.sequelizerc
 📜.env
```
