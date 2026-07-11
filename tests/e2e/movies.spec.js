import { expect } from '@playwright/test';

import data from '../support/fixtures/movies.json';

const { test } = require('../support');

const { executeSQL } = require('../support/database');


test('should register a new movie', async ({ page }) => {

    const movie = data.create;

    await executeSQL(`DELETE FROM movies WHERE title = '${movie.title}'`);

    await page.login.visit();
    await page.login.submit('admin@zombieplus.com', 'pwd123');
    await page.movies.isLoggedIn();

    await page.movies.create(movie);
    await page.toast.containText('Cadastro realizado com sucesso!');

})