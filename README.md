# pomodo-server. 
create .env file in the source, and copy then paste the following information:    

PORT=5000.  
MONGO_URL=mongodb+srv://wing:123ABC@pomodee.70xv2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority. 
JWT_SECRET=team-1.   
JWT_LIFETIME=30d. 
NODE_ENV=development

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
