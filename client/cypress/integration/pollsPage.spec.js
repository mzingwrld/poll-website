describe('Polls page tests', () => {
    it('If polls were created by a user, user can see this polls in a table', () => {
        cy.intercept('GET', '**/api/auth', { fixture: 'auth.json' }).as('getAuth');
        cy.intercept('GET', '**/api/poll/list', { fixture: 'polls_list.json' }).as('pollList');
        cy.visit('http://localhost:3000/polls');

        cy.wait('@getAuth');

        cy.wait('@pollList');
        cy.url().should('include', '/polls');
        cy.get('[data-cy=poll-0]')
        cy.get('[data-cy=poll-1]')
        cy.get('[data-cy=poll-2]')
        cy.get('[data-cy=poll-0-view-btn]')
        cy.get('[data-cy=poll-1-view-btn]')
        cy.get('[data-cy=poll-2-view-btn]')
    });

    it('No polls created', () => {
        cy.intercept('GET', '**/api/auth', { fixture: 'auth.json' }).as('getAuth');
        cy.intercept('GET', '**/api/poll/list', { fixture: 'polls_list_empty.json' }).as('pollList');
        cy.visit('http://localhost:3000/polls');

        cy.wait('@getAuth');

        cy.wait('@pollList');
        cy.url().should('include', '/polls');
        cy.get('h3').contains('You have no created polls yet')
        cy.get('h4').contains('Do you want to create one?')
        cy.get('[data-cy=poll-create-btn]').click()
        cy.url().should('include', '/create');
    });
});
