let f; // fixture data

before(() => {
  cy.fixture('data').then((data) => {
    f = data;
  });
});

beforeEach(() => {
  cy.exec('npm --prefix ../api run seed');
});

describe('api error handling tests', () => {
  it('should handle login errors', () => {
    cy.intercept(
      { method: 'POST', url: '**/login', times: 1 },
      { statusCode: 500 }
    ).as('login');
    cy.visit('/');
    cy.login(f.username, f.password);
    cy.get('#Login__err-status').should('be.visible');

    // login ok when server responding
    cy.login(f.username, f.password);
    cy.get('#Nav__menu-btn');
  });

  it('should handle registration errors', () => {
    cy.intercept(
      { method: 'POST', url: '**/user', times: 1 },
      { statusCode: 500 }
    ).as('register');
    cy.visit('/');
    cy.register(f.new_username, f.new_password);
    cy.get('#Login__err-status').should('be.visible');

    // register ok when server responding
    cy.register(f.new_username, f.new_password);
    cy.get('#Nav__menu-btn');
  });

  it('should handle message fetching errors', () => {
    cy.intercept(
      { method: 'GET', url: '**/messages/**', times: 1 },
      { statusCode: 500 }
    ).as('getMessages');
    cy.visit('/');
    cy.login(f.username, f.password);
    cy.clickContact(1);

    // click the 'retry' button after server error
    cy.get('#Chat--error > button').click();

    // check message is onscreen when server up
    cy.get('.MsgBubble');
  });
});
