import { expect } from '@playwright/test';

import data from '../support/fixtures/movies.json';

const { test } = require('../support');

const { executeSQL } = require('../support/database');


test('should register a new movie', async ({ page }) => {

    const movie = data.create;

    await executeSQL(`DELETE FROM movies WHERE title = '${movie.title}'`);

    
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin');
    await page.movies.create(movie);
    await page.toast.containText('Cadastro realizado com sucesso!');

})

test('should not register when mandatory fields are missing', async ({ page }) => {

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin');
    await page.movies.goForm();
    await page.movies.submit();
    await page.movies.alertHaveText([
        'Por favor, informe o título.',
        'Por favor, informe a sinopse.',
        'Por favor, informe a empresa distribuidora.',
        'Por favor, informe o ano de lançamento.'
    ]);

})