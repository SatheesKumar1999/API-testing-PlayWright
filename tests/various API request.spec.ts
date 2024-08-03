//we are gonna create article by post method
import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json'


//mock api--- PW intercepted API Request and we provided our own values / response.
test.beforeEach(async ({page})=>{
                   /*https://conduit-api.bondaracademy.com/api/tags*/ 
  await page.route('*/**/api/tags'/*API URL that where we want to chage the values like where PW wants to intercept*/, async route=>{
  
    await route.fulfill({// we used this to add tags in request
    body: JSON.stringify(tags)
    })
  })

  //now, from the response we are gonna change
 
   await page.goto('https://conduit.bondaracademy.com/');
  /* await page.getByText(' Sign in ').click()
   await page.getByRole('textbox', {name:"Email"}).fill('sathees0002@gmail.com')
   await page.getByRole('textbox', {name:"Password"}).fill('Sath@1234')
   await page.getByRole('button', {name:"Sign in"}).click()**/ //we just commant as we have authentication state
})

test ('Modify the response', async({page})=>{
    await page.route('*/**/api/articles*', async route=>{
        const response= await route.fetch()//to get/fetch the response
        const responseBody=await response.json()//to store  as a body
        responseBody.articles[0].title='this is pw test'//reinitialize/modified in responsebody
        responseBody.articles[0].description='this is a test'
    
        await route.fulfill({
          body: JSON.stringify(responseBody)//replacing/updating in response
        })
    
      })
      await expect(page.locator('app-article-list')).toContainText('this is pw test')
})

test('Request APi create article', async ({ page, request}) => {
const response=await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data:{
        "user":{"email":"sathees0002@gmail.com","password":"Sath@1234"}
    }
})
const responseBody=await response.json()
const accessToken=responseBody.user.token //to get authurization token

console.log(responseBody.user.token)

//create article thru api
const responeArticle= await request.post('https://conduit-api.bondaracademy.com/api/articles/',{
  data:{
    "article":{"title":"Title Test","description":"Test Title","body":"Test test","tagList":[]}
  },
  headers:{
    authorization:`Token ${accessToken}`
  }
})
expect(responeArticle.status()).toEqual(201)
//delete the article
await page.getByText('Global Feed').click()
await page.getByText('Title Test').click()
await page.getByRole('button', {name:" Delete Article "}).nth(0).click()
await page.getByText('Global Feed').click()
await expect(page.locator('app-article-list')).not.toContainText('Title Test')

})
//intercept API response---58
test('Delete the Article using API', async({page, request})=>{
  await page.getByText('New Article').click()
  await page.getByRole('textbox', {name:"Article Title"}).fill('Deleting the Article')
  await page.getByRole('textbox', {name:"What's this article about?"}).fill('Deleting the Article by API')
  await page.getByRole('textbox', {name:"Write your article (in markdown)"}).fill('Deleting the Article by API request')
  await page.getByRole('button').click()
   //intercept the response and taking the slug of the article, why we are taking this slug becuase slug is a uniq ID and we need to use yhis slug during delete req.
  const articleresponse=await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')//waiting for the API
  const articleresponseBody=await articleresponse.json()
  const articleID=articleresponseBody.article.slug

  await expect(page.locator(".article-page h1")).toContainText('Deleting the Article')
  await page.getByText('Home').click()
  //finding the accesstoken. we need this, since we are performing delete API req ....
  const response=await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data:{
        "user":{"email":"sathees0002@gmail.com","password":"Sath@1234"}
    }
})
const responseBody=await response.json()
const accessToken=responseBody.user.token
  //await page.getByText('Global Feed').click()...below is the API request for Click action on "Global feed" in web page 
  await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers:{
      authorization:`Token ${accessToken}`
    }
    })
  await expect(page.locator('app-article-list').first()).toContainText('Deleting the Article')


//Trigger the Delete API Req. we use JS interpolation just because we cant reuse slug inside'' so we use interpolation.
const deleteRequest= await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${articleID}`, {
  headers:{
    authorization:`Token ${accessToken}`
  }
})
 
 expect(deleteRequest.status()).toEqual(204)

 await page.reload()
 await expect(page.locator('app-article-list')).not.toContainText('Deleting the Article')

})

