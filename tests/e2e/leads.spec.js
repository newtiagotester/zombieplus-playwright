const { test, expect } = require('../support');
const { faker } = require('@faker-js/faker');

test('should register a lead in the waitlist', async ({ page }) => {
  const leadName = faker.person.fullName();
  const leadEmail = faker.internet.email();

  await page.landing.visit();
  await page.landing.openLeadModal();
  await page.landing.submitLeadForm(leadName, leadEmail);

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!';
  await page.toast.containText(message);
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

  await page.landing.visit();
  await page.landing.openLeadModal();
  await page.landing.submitLeadForm(leadName, leadEmail);

  const message = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.';
  await page.toast.containText(message);
})


test('should not register with incorrect email', async ({ page }) => {


  await page.landing.visit();
  await page.landing.openLeadModal();
  await page.landing.submitLeadForm('Catherine Jones', 'catherine.jonesexample.com');
  await page.landing.alertHaveText('Email incorreto');
});

test('should not register when name is not filled', async ({ page }) => {
  await page.landing.visit();
  await page.landing.openLeadModal();
  await page.landing.submitLeadForm('', 'catherine.jones@example.com');
});


test('should not register when email is not filled', async ({ page }) => {

  await page.landing.visit();
  await page.landing.openLeadModal();
  await page.landing.submitLeadForm('Catherine Jones', '');




});


test('should not register when no fields are filled', async ({ page }) => {

  await page.landing.visit();
  await page.landing.openLeadModal();
  await page.landing.submitLeadForm('', '');

  await page.landing.alertHaveText(['Campo obrigatório', 'Campo obrigatório']);




});
