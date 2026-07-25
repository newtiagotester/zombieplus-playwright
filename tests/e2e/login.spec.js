const { test, expect } = require('../support');

test('should log in as administrator', async ({ page }) => {
    await page.login.visit();
    await page.login.submit('admin@zombieplus.com', 'pwd123');
    await page.login.isLoggedIn('Admin');
})

test('should not log in with incorrect password', async ({ page }) => {
    await page.login.visit();
    await page.login.submit('admin@zombieplus.com', 'senhaincorreta');

    const message = 'Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.';

    await page.popup.haveText(message);
})

test('should not log in when email is invalid', async ({ page }) => {
    await page.login.visit();
    await page.login.submit('www.zombieplus.com', 'senhaincorreta');
    await page.login.alertHaveText('Email incorreto');
})

test('should not log in when email is not filled', async ({ page }) => {
    await page.login.visit();
    await page.login.submit('', 'pwd123');
    await page.login.alertHaveText('Campo obrigatório');
})

test('should not log in when password is not filled', async ({ page }) => {
    await page.login.visit();
    await page.login.submit('admin@zombieplus.com', '');
    await page.login.alertHaveText('Campo obrigatório');
})

    test('should not log in when no fields are filled', async ({ page }) => {
    await page.login.visit();
    await page.login.submit('', '');
    await page.login.alertHaveText(['Campo obrigatório', 'Campo obrigatório']);
})