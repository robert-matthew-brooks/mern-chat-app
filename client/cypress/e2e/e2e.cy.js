let f; // fixture data

before(() => {
  cy.fixture('data').then((data) => {
    f = data;
  });
});

beforeEach(() => {
  cy.exec('npm --prefix ../api run seed');
  cy.visit('/');
});

describe('e2e tests', () => {
  it('sending and checking messages across sessions', () => {
    // login
    cy.login(f.username, f.password);

    // send a message to 1st friend and read it
    cy.clickContact(1);
    cy.sendMsg(f.msg1);
    cy.checkLatestMsg(f.msg1);

    // send a message to 2nd friend and read it
    cy.clickContact(2);
    cy.sendMsg(f.msg2);
    cy.checkLatestMsg(f.msg2);

    // check first message still showing
    cy.clickContact(1);
    cy.checkLatestMsg(f.msg1);

    // check second message still showing
    cy.clickContact(2);
    cy.checkLatestMsg(f.msg2);

    // log out and back in
    cy.logout();
    cy.login(f.username, f.password);

    // check first message still showing
    cy.clickContact(1);
    cy.checkLatestMsg(f.msg1);

    // check second message still showing
    cy.clickContact(2);
    cy.checkLatestMsg(f.msg2);

    // log out and back in
    cy.logout();
  });

  it('registering and deleting an account', () => {
    // fail login
    cy.login(f.new_username, f.new_password);
    cy.get('#Login__err-status').should('be.visible');

    // register new account
    cy.register(f.new_username, f.new_password);

    // log out and back in
    cy.logout();
    cy.login(f.new_username, f.new_password);

    // delete account
    cy.deleteAccount();

    // fail login
    cy.login(f.new_username, f.new_password);
    cy.get('#Login__err-status').should('be.visible');
  });

  it.only('adding a friend and receiving a message from them', () => {
    // create new account
    cy.register(f.new_username, f.new_password);

    // add main test account as contact
    cy.addContact(f.username);

    // send message to main test account
    cy.sendMsg(f.msg1);

    // log in as main test account
    cy.logout();
    cy.login(f.username, f.password);

    // add new account as contact
    cy.addContact(f.new_username);

    // read message
    cy.checkLatestMsg(f.msg1);

    // logout
    cy.logout();
  });
});
