const { test, expect } = require('../support');
const { faker } = require('@faker-js/faker');
const { executeSQL } = require('../support/database');

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
  await executeSQL('DELETE FROM leads')
});


test('should register a lead in the waitlist', async ({ page }) => {
  const leadName = faker.person.fullName();
  const leadEmail = faker.internet.email();

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm(leadName, leadEmail);

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.';
  await page.popup.haveText(message);
});

test('should NOT register when e-mail already exists', async ({ page, request }) => {
  const leadName = faker.person.fullName();
  const leadEmail = faker.internet.email();

  const newLead = await request.post('http://localhost:3333/leads', {
    data: {
      name: leadName,
      email: leadEmail
    }
  });

  expect(newLead.ok()).toBeTruthy();

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm(leadName, leadEmail);

  const message = 'Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.';
  await page.popup.haveText(message);
})


test('should not register with incorrect email', async ({ page }) => {

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm('Catherine Jones', 'catherine.jonesexample.com');
  await page.leads.alertHaveText('Email incorreto');
});

test('should not register when name is not filled', async ({ page }) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm('', 'catherine.jones@example.com');
});


test('should not register when email is not filled', async ({ page }) => {

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm('Catherine Jones', '');



});


test('should not register when no fields are filled', async ({ page }) => {

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm('', '');

  await page.leads.alertHaveText(['Campo obrigatório', 'Campo obrigatório']);




});
