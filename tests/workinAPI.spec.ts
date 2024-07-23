import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'

//mock api--- PW intercepted API Request and we provided our own values / response.
test.beforeEach(async ({page})=>{
                   /*https://conduit-api.bondaracademy.com/api/tags*/ 
  await page.route('*/**/api/tags'/*API URL that where we want to chage the values like where PW wants to intercept*/, async route=>{
   /* const tags={
     "tags": [
       "google",
       "chrome",
     ]
    }*/
    await route.fulfill({// we used this to add tags in request
    body: JSON.stringify(tags)
    })
  })

  //now, we are changing the values from the response
  await page.route('*/**/api/articles*', async route=>{
    const response= await route.fetch()//to get/fetch the response
    const responseBody=await response.json()//to store as a body
    responseBody.articles[0].title='this is pw test'//reinitialize/modified in responsebody
    responseBody.articles[0].description='this is a test'

    await route.fulfill({
      body: JSON.stringify(responseBody)//replacing/updating in response
    })

  })
   await page.goto('https://conduit.bondaracademy.com/');
})

test('has title', async ({ page }) => {
  

 // await page.getByText(' Your Feed ').click()
 // await page.locator('[formcontrolname="email"]').fill('sathees0002@gmail.com')
 // await page.locator('[formcontrolname="password"]').fill('Sath@1234')
 // await page.getByRole('button').click()
// await expect(page.locator('div.tag-list')).toContainText("google")//adding this becuase sometime mock API is not changes the Tag, so i added this assertion so that it will wait for tags to dispaly in another word we can say we are giving some time in a sense of assertion to application to show the updated tags
// await expect(page.locator('.navbar-brand')).toHaveText('conduit')
 //await expect(page.locator('app-article-list h1').first()).toContainText('this is pw test')//just we put assertion to give enough time for application to shown the desired result.
 await page.waitForTimeout(4000)//instead of assertion we can put time out
 // const tagList=page.locator('div', {hasText:"Popular Tags"})
  // tagList.locator('div.tag-list').getByText(' YouTube ').click()
  //await page.getByRole('link', {name:" New Article "}).click()
});
