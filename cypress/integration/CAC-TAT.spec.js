/// <reference types="Cypress" />

describe("Central de Atendimento ao Cliente TAT", () => {
  beforeEach(() => {
    cy.visit("./src/index.html");
  });

  const longText = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam repellat similique incidunt quo voluptatem consequatur mollitia cum fuga temporibus quam velit, voluptate architecto amet sint possimus ipsum, sequi, minima maxime.`;
  const THREE_SECONDS_IN_MS = 3000;
  const longTextReapt = Cypress._.repeat('0123456789', 20);
  it("verifica o título da aplicação", () => {
    cy.title().should("eq", "Central de Atendimento ao Cliente TAT");
  });

  it("verificar teste", () => {
    cy.get('input[type="text"]')
    .each((input) => {
      cy.wrap(input)
      .should("be.visible")
      .type("Olá mundo!")
      .should("have.value", "Olá mundo!");
    })
  });

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.clock()

    cy.get('#firstName').type('Renan');
    cy.get('#lastName').type('Jastro');
    cy.get('#email').type('jastro.gmail.com');
    cy.get('#open-text-area').type(longText);
    cy.contains("button", "Enviar").click();

    cy.get('.error').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.error').should('not.be.visible')

  })

  it("preenche os campos obrigatórios e envia o formulário", () => {
  cy.clock()

    cy.get("#firstName").type("Renan", { delay: 0 });
    cy.get("#lastName").type("Jastro Pereira", { delay: 0 });
    cy.get("#email").type("jastro@gmail.com", { delay: 0 });
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();
    cy.get(".success").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get(".success").should("not.be.visible");
  });
  
  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product').select('YouTube').should('have.value', 'youtube')
  })
  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product').select('mentoria').should('have.value', 'mentoria')
  })
  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product').select(1).should('have.value', 'blog')
  })
  it('seleciona um produto aleatorio', () => {
    cy.get('select option')
    .not('[disabled]')
    .its('length', {log: false})
    .then((numeroItens) => {
      cy.get('#product').select(Cypress._.random(1, numeroItens))
    })
  })
  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type=radio][value="feedback"]').check()
    .should('have.value', 'feedback')
  })
  
Cypress._.times(10, () => {
  it('marca cada tipo de atendimento', () => {
    cy.get('input[type=radio]')
    .should('have.length', 3)
    .each(($radio) => {
      cy.wrap($radio).check()
      cy.wrap($radio).should('be.checked')
    })
  })  
})
  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
  })
  it('marca o checkbox email', () => {
    cy.get('#email-checkbox')
    .check()
    .should('be.checked')
  })
  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.clock()

    cy.get('#firstName').type('renan')
    cy.get('#lastName').type('jastro')
    cy.get('#email').type('jastro@gmail.com')
    cy.get('#phone-checkbox').check().should('be.checked')
    cy.get('#open-text-area').type(longText)
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.error').should('not.be.visible')
  })
  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json')
       .should(($input) => {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })
  it('seleciona um arquivo simulando um drag-and-drop', () =>{
    cy.get('#file-upload')
    .should('not.have.value')
    .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})
     .should(($input) => {
      expect($input[0].files[0].name).to.equal('example.json')
    })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('arquivoExemplo');
    cy.get('input[type="file"]')
      .selectFile('@arquivoExemplo')
      .should(($input) => {
        expect($input[0].files[0].name).to.eq('example.json');
      });
  });
it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique',() => {
  cy.get('#privacy a').should('have.attr', 'target', '_blank')
})

it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
  cy.get('#privacy a')
    .invoke('removeAttr', 'target')
    .click()

    cy.contains('Talking About Testing').should('be.visible')
})
it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
  cy.get('.success')
    .should('not.be.visible')
    .invoke('show')
    .should('be.visible')
    .and('contain', 'Mensagem enviada com sucesso.')
    .invoke('hide')
    .should('not.be.visible')
  cy.get('.error')
    .should('not.be.visible')
    .invoke('show')
    .should('be.visible')
    .and('contain', 'Valide os campos obrigatórios!')
    .invoke('hide')
    .should('not.be.visible')
})

  it('preenche a area de texto usando o comando invoke', () => {
      cy.get('#open-text-area')
      .invoke('val', longTextReapt)
      .should('have.value', longTextReapt)
  })  
  it('faz uma requisição HTTP', () => {
    cy.request({
      url: 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html',
      method: 'GET',
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.statusText).to.eq('OK');
      expect(response.body).contain('CAC TAT');
    });
  });
  it('Desafio (encontre o gato)', () => {
    cy.get('#cat')
    .should('not.be.visible')
    .invoke('show')
    .should('be.visible')
  })

});
