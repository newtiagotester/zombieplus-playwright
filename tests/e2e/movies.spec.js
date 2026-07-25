import { expect } from '@playwright/test';

import data from '../support/fixtures/movies.json';

const { test } = require('../support');

const { executeSQL } = require('../support/database');

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
    await executeSQL('DELETE FROM movies')
});


test('should register a new movie', async ({ page }) => {
    const movie = data.create;

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin');
    await page.movies.create(movie);
    await page.popup.haveText(`O filme '${movie.title}' foi adicionado ao catálogo.`);

})

test('should be able to remove a movie', async ({ page, request }) => {
    const movie = data.to_remove;
    await request.api.postMovie(movie);
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    await page.movies.remove(movie.title);
    await page.popup.haveText('Filme removido com sucesso.');
})


test('should not register when the title is duplicated', async ({ page, request }) => {
    const movie = data.duplicate;
    await request.api.postMovie(movie);

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.create(movie);
    await page.popup.haveText(`O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`);

})

test('should not register when mandatory fields are missing', async ({ page }) => {

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin');
    await page.movies.goForm();
    await page.movies.submit();
    await page.movies.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório'
    ]);

})


test('Should search for zumbi movies', async ({ page, request }) => {
    const movies = data.search;

    for (const m of movies.data) {
        await request.api.postMovie(m);
    }

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin');
    await page.movies.search(movies.input);
    await page.movies.tableHave(movies.outputs);

})