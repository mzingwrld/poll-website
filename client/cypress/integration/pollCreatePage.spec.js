/* eslint-disable no-new-wrappers */
describe('Poll create page tests', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/api/auth', { fixture: 'auth.json' }).as('getAuth');
    });

    const STRING_101 = new String(1).repeat(101);
    const STRING_100 = new String(1).repeat(100);
    const STRING_99 = new String(1).repeat(99);
    const STRING_97 = new String(1).repeat(97);

    beforeEach(() => {
        cy.intercept('GET', '**/api/auth', { fixture: 'auth.json' }).as('getAuth');
        cy.visit('http://localhost:3000/');
    });

    it('Visiting root url redirecting to /create page', () => {
        cy.url().should('include', '/create');
        cy.get('#question');
        cy.get('#answer-0');
        cy.get('#answer-1');
        cy.get('#answer-2').should('not.exist');
    });

    it('Can add more answers to a poll', () => {
        cy.url().should('include', '/create');
        cy.get('#question');
        cy.get('#answer-0');
        cy.get('#answer-1');
        for (let i = 0; i <= 10; i++) {
            cy.get('[data-cy=add-answer-btn]').click();
            cy.get(`#answer-${i+2}`);
        }
    });

    it('Question field validation: valid values are from 3 to 100 characters', () => {
        cy.url().should('include', '/create');
        cy.get('[data-cy=create-poll-btn]').click();
        cy.get('.toast');

        cy.get('#question')
            .should('have.class', 'invalid')
            .type('1')
            .should('have.class', 'invalid')
            .type('1')
            .should('have.class', 'invalid')
            .type('1')
            .should('not.have.class', 'invalid')
            .type(STRING_97)
            .should('have.value', STRING_100)
            .should('not.have.class', 'invalid')
            .type('1')
            .should('have.class', 'invalid')
            .should('have.value', STRING_101);

        cy.get('[data-cy=create-poll-btn]').click();
        cy.get('.toast');
        cy.get('#question')
            .should('have.class', 'invalid')
    });

    it('Answer field validation: valid values are from 1 to 100 characters', () => {
        cy.url().should('include', '/create');
        cy.get('[data-cy=create-poll-btn]').click();
        cy.get('.toast');

        cy.get('#answer-0')
            .should('have.class', 'invalid')
            .type('1')
            .should('not.have.class', 'invalid')
            .type(STRING_99)
            .should('have.value', STRING_100)
            .should('not.have.class', 'invalid')
            .type('1')
            .should('have.class', 'invalid')
            .should('have.value', STRING_101);

        cy.get('[data-cy=create-poll-btn]').click();
        cy.get('.toast');
        cy.get('#answer-0')
                .should('have.class', 'invalid')
    });

    it('Can create poll. After creating should redirect to a page with a created poll.', () => {
        cy.intercept('POST', '**/api/poll/create', { fixture: 'poll.json' }).as('pollCreate');
        cy.intercept('GET', '**/api/poll/view/6103be91106c4930ccc949e4', { fixture: 'poll_view.json' }).as('getPoll');
        cy.url().should('include', '/create');
        cy.get('#question')
            .type('Pick a number you love');
        cy.get('#answer-0')
            .type('1');
        cy.get('#answer-1')
            .type('2');
        for (let i = 0; i < 8; i++) {
            cy.get('[data-cy=add-answer-btn]').click();
            cy.get(`#answer-${i+2}`)
                .type(`${i + 3}`);
        }
        cy.get('[data-cy=create-poll-btn]').click();
        cy.wait(['@pollCreate', '@getPoll']);

        cy.url().should('include', '/poll/view/6103be91106c4930ccc949e4');
    });
});
