Cypress.Commands.add('login', (username, password) => {
  cy.get('#Login__username').clear().type(username);
  cy.get('#Login__password').clear().type(password);
  cy.contains('button', 'Login').click();
});

Cypress.Commands.add('register', (username, password) => {
  cy.get('#Login__username').clear().type(username);
  cy.get('#Login__password').clear().type(password);
  cy.contains('button', 'Register').click();
});

Cypress.Commands.add('logout', () => {
  cy.get('#Nav__menu-btn').click();
  cy.contains('button', 'Logout').click();
});

Cypress.Commands.add('deleteAccount', () => {
  cy.get('#Nav__menu-btn').click();
  cy.contains('button', 'Delete').click();
});

Cypress.Commands.add('clickContact', (which) => {
  cy.get('.Contact').then(($contacts) => {
    cy.get('.Contact')
      .eq($contacts.length - which)
      .click();
  });
});

Cypress.Commands.add('addContact', (username) => {
  cy.get('#Search__input').type(username);
  cy.get('.Search__results__user').click();
});

Cypress.Commands.add('sendMsg', (msg) => {
  cy.get('#Chat__form__input').type(`${msg}{enter}`);
});

Cypress.Commands.add('checkLatestMsg', (msg) => {
  cy.get('.MsgBubble').first().should('contain.text', msg);
});
