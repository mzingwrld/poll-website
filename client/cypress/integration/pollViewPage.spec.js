/* eslint-disable no-new-wrappers */
describe('Poll view page tests', () => {
    const STRING_101 = new String(1).repeat(101);
    const STRING_100 = new String(1).repeat(100);
    const STRING_99 = new String(1).repeat(99);

    beforeEach(() => {
        cy.intercept('GET', '**/api/auth', { fixture: 'auth.json' }).as('getAuth');
    });

    it('Receive not found poll.', () => {
        cy.intercept('GET', '**/api/poll/view/6103be91106c4930ccc949e4', { fixture: 'poll_view_empty.json' }).as('getPoll');
        cy.visit('http://localhost:3000/poll/view/6103be91106c4930ccc949e4');
        cy.url().should('include', '/poll/view/6103be91106c4930ccc949e4');
        cy.get('h3').contains('This poll does not exist');
        cy.get('h4').contains('Do you want to create poll?');
        cy.get('[data-cy=create-btn]');
    });

    it('Receive poll. Check user name field validation: it should be in range from 1 to 100 characters', () => {
        cy.intercept('GET', '**/api/poll/view/6103be91106c4930ccc949e4', { fixture: 'poll_view.json' }).as('getPoll');
        cy.visit('http://localhost:3000/poll/view/6103be91106c4930ccc949e4');
        cy.url().should('include', '/poll/view/6103be91106c4930ccc949e4')
        cy.get('[data-cy=vote-btn]').should('be.disabled');

        // selecting option
        cy.get('[data-cy=option-0]').click()

        cy.get('#name')
            .type('1')
            .should('not.have.class', 'invalid')
            .type(STRING_99)
            .should('have.value', STRING_100)
            .should('not.have.class', 'invalid')
            .type('1')
            .should('have.class', 'invalid')
            .should('have.value', STRING_101);
        cy.get('[data-cy=vote-btn]').should('be.disabled');
        cy.get('#name')
            .type('{selectall}{backspace}Ivan');
        cy.get('[data-cy=vote-btn]').should('not.be.disabled');
    });

    it('Receive poll. Check if name field is filled and no option is selected, then button should be disabled. Can choose different options before sending.', () => {
        cy.intercept('GET', '**/api/poll/view/6103be91106c4930ccc949e4', { fixture: 'poll_view.json' }).as('getPoll');
        cy.visit('http://localhost:3000/poll/view/6103be91106c4930ccc949e4');
        cy.url().should('include', '/poll/view/6103be91106c4930ccc949e4')
        cy.get('[data-cy=vote-btn]').should('be.disabled');
        cy.get('#name')
            .type('123');

        cy.get('[data-cy=vote-btn]').should('be.disabled');
        // selecting option
        cy.get('[data-cy=option-0]').click()
        cy.get('[data-cy=option-0-checked]');
        cy.get('[data-cy=vote-btn]').should('not.be.disabled');

        // check that we can change our decision before sending response
        for (let i = 0; i < 9; i++) {
            cy.get(`[data-cy=option-${i + 1}]`).click()
            cy.get(`[data-cy=option-${i + 1}-checked]`);
            cy.get('[data-cy=vote-btn]').should('not.be.disabled');
    
        }
    });

    it('Receive poll. Can vote. After sending vote sees notification that cannot vote anymore', () => {
        cy.intercept('GET', '**/api/poll/view/6103be91106c4930ccc949e4', { fixture: 'poll_view.json' }).as('getPoll');
        cy.intercept('POST', '**/api/poll/vote', { fixture: 'vote.json' }).as('postVote');
        cy.visit('http://localhost:3000/poll/view/6103be91106c4930ccc949e4');
        cy.url().should('include', '/poll/view/6103be91106c4930ccc949e4')
        cy.get('[data-cy=vote-btn]').should('be.disabled');
        cy.get('#name')
            .type('123');

        cy.get('[data-cy=vote-btn]').should('be.disabled');
        // selecting option
        cy.get('[data-cy=option-0]').click()
        cy.get('[data-cy=option-0-checked]');
        cy.get('[data-cy=vote-btn]')
            .should('not.be.disabled')
            .click();
        cy.wait('@postVote');

        cy.get('[data-cy=already-answered-notification]')
    });

    it('Receive poll. Cannot vote.', () => {
        cy.intercept('GET', '**/api/poll/view/6103be91106c4930ccc949e4', { fixture: 'poll_view_answered.json' }).as('getPoll');
        cy.intercept('POST', '**/api/poll/vote', { fixture: 'vote.json' }).as('postVote');
        cy.visit('http://localhost:3000/poll/view/6103be91106c4930ccc949e4');
        cy.url().should('include', '/poll/view/6103be91106c4930ccc949e4')

        cy.get('[data-cy=already-answered-notification]')

        // share button available
        cy.get('[data-cy=share-btn]')
    });

    it('Receive poll. Can see table with results if results not empty.', () => {
        cy.intercept('GET', '**/api/poll/view/6103be91106c4930ccc949e4', { fixture: 'poll_view_answered.json' }).as('getPoll');
        cy.intercept('POST', '**/api/poll/vote', { fixture: 'vote.json' }).as('postVote');
        cy.visit('http://localhost:3000/poll/view/6103be91106c4930ccc949e4');
        cy.url().should('include', '/poll/view/6103be91106c4930ccc949e4')

        cy.get('[data-cy=results-table]')
    });

    it('Receive poll. Cannot see table with results, because results are empty', () => {
        cy.intercept('GET', '**/api/poll/view/6103be91106c4930ccc949e4', { fixture: 'poll_view.json' }).as('getPoll');
        cy.intercept('POST', '**/api/poll/vote', { fixture: 'vote.json' }).as('postVote');
        cy.visit('http://localhost:3000/poll/view/6103be91106c4930ccc949e4');
        cy.url().should('include', '/poll/view/6103be91106c4930ccc949e4')

        cy.get('[data-cy=no-results-table]')
    });
});
