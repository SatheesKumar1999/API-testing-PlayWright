import {test as setup} from '@playwright/test'
import user from '../.auth/user.json'//this is imported for api authentication
import fs from 'fs'//this is imported for api authentication
 const authFile='.auth/user.json'//this location will have all details authentication state of application
setup('authentication', async({page, request})=>{
    /*
    await page.goto('https://conduit.bondaracademy.com/');
   await page.getByText(' Sign in ').click()
   await page.getByRole('textbox', {name:"Email"}).fill('sathees0002@gmail.com')
   await page.getByRole('textbox', {name:"Password"}).fill('Sath@1234')
   await page.getByRole('button', {name:"Sign in"}).click()
   await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')
   await page.context().storageState({path:authFile})//just to store login authentication state in the given path. without this, all details abt authentication will not stored in a path.
   */
  //same authentication using api calls
   const response=await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
      data:{
          "user":{"email":"sathees0002@gmail.com","password":"Sath@1234"}
      }
  })
  const responseBody=await response.json()
  const accessToken=responseBody.user.token

  user.origins[0].localStorage[0].value=accessToken// just we assign access token value to value under user object in user.json location.
  fs.writeFileSync(authFile, JSON.stringify(user))//this is the responsibe to write in the path 




})