# DEEL BACKEND TASK DESCRIPTION

So, unfortunatelly it took a little bit more time because of some additional stuff I decided to add

## Additions/Improvements
1. Migrate project to TS. It took a while to rewrite sequalize models with relations and setup building stuff
2. Dockerize the service
3. Develop simple client app in Angular for testing purposes (I suppose Deel uses React, but I have worked mostly with Vanilla and Angular). Have not dockerized it, but was going to :)
https://github.com/Pryanishnik/deel-client

## Suggestions/Concerns
 1. For all APIs I decided that user can not request data which does not belong to him. So, basically, I implement profile_id validation for all sensitive APIs.
 2. I suppose 2 last ones (admin) APIs, should be invalidated with some admin role, so initially I wanted to introduce some ROLE entity in datamodel, but then decided not to do this, as it requires some additions to migration script as well. I still had 2-3 hours for the main part :) 
 3. I was thinking about validation for inputs on both back end and front end sides, but it could take more time in this case, so basically just general "transaction" approach - try-catch for the whole handler:)
 4. I was not sure if it is allowed to use some other libs, but I wanted to implement it with NestJS (Like this framework, reminds me Spring and Angular)

## Summary
Hope the task is done as it was expected.
For last year or so I worked mostly with Java, so had to remember/re-learn some stuff.

