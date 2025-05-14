const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
  const { Books, Customers, Category, Interest } = this.entities;
  const db = await cds.connect.to('db');

  // ===== BOOKS =====
  this.before(['CREATE', 'UPDATE'], 'Books', async (req) => {
    const { title, author, stock, datePub, description, category_ID } = req.data;

    if (!title || title.trim().length < 6) {
      return req.error(400, `Título deve ter pelo menos 6 caracteres`);
    }

    if (!author || author.trim().length < 4) {
      return req.error(400, `Autor deve ter pelo menos 4 caracteres`);
    }

    if (stock < 0) {
        return req.error(400, 'Estoque não pode ser negativo');
    }
  
    if (!stock) {
        return req.error(400, 'Estoque não pode estar vazio');
    }

    if (!datePub) {
      return req.error(400, 'Data de publicação é obrigatória');
    }

    if (!description) {
      return req.error(400, 'Descrição é obrigatória');
    }

    if (!category_ID) {
      return req.error(400, 'Categoria é obrigatória');
    }

    const categoryExists = await db.run(SELECT.one.from(Category).where({ ID: category_ID }));
    if (!categoryExists) {
      return req.error(400, 'Categoria não encontrada');
    }
  });

  // ===== BooksNoDraft =====
  this.before(['CREATE', 'UPDATE'], 'BooksNoDraft', async (req) => {
    const { title, author, stock, datePub, description, category_ID } = req.data;

    if (!title || title.trim().length < 6) {
      return req.error(400, `Título deve ter pelo menos 6 caracteres`);
    }

    if (!author || author.trim().length < 4) {
      return req.error(400, `Autor deve ter pelo menos 4 caracteres`);
    }

    if (!datePub) {
      return req.error(400, 'Data de publicação é obrigatória');
    }

    if (!description) {
      return req.error(400, 'Descrição é obrigatória');
    }

    if (stock < 0) {
      return req.error(400, 'Estoque não pode ser negativo');
    }

    if (!category_ID) {
      return req.error(400, 'Categoria é obrigatória');
    }

    const categoryExists = await db.run(SELECT.one.from(Category).where({ ID: category_ID }));
    if (!categoryExists) {
      return req.error(400, 'Categoria não encontrada');
    }
  });

  // ===== CUSTOMERS =====
  this.before(['CREATE', 'UPDATE'], 'Customers', async (req) => {
    const { name, dateNasc, cpf } = req.data;

    if (!name || name.trim().length < 3) {
      return req.error(400, `Nome deve ter pelo menos 3 caracteres`);
    }

    if (!dateNasc) {
      return req.error(400, 'Data de nascimento é obrigatória');
    }

    if (!cpf || cpf.length !== 11) {
      return req.error(400, 'CPF inválido');
    }

    const existingCPF = await db.run(SELECT.one.from(Customers).where({ cpf }));
    if (existingCPF) {
      return req.error(400, 'CPF já cadastrado');
    }
  });

  // ===== CATEGORY =====
  this.before(['CREATE', 'UPDATE'], 'Category', async (req) => {
    const { name, description } = req.data;

    if (!name || name.trim().length < 3) {
      return req.error(400, `Nome deve ter pelo menos 3 caracteres`);
    }

    if (!description) {
      return req.error(400, 'Descrição é obrigatória');
    }
  });

  this.before('DELETE', 'Category', async (req) => {
    const categoryId = req.data.ID;
    
    const booksWithCategory = await db.run(
      SELECT.from(Books).where({ category_ID: categoryId })
    );

    if (booksWithCategory.length > 0) {
      return req.error(400, 'Não é possível deletar categoria em uso');
    }
  });

  // ===== INTEREST =====
  this.before(['CREATE', 'UPDATE'], 'Interest', async (req) => {
    const { customer_ID, category_ID } = req.data;

    const customer = await db.run(SELECT.one.from(Customers).where({ ID: customer_ID }));
    if (!customer) {
      return req.error(404, 'Cliente não encontrado');
    }

    const category = await db.run(SELECT.one.from(Category).where({ ID: category_ID }));
    if (!category) {
      return req.error(404, 'Categoria não encontrada');
    }

    const existingInterest = await db.run(
      SELECT.one.from(Interest).where({ 
        customer_ID: customer_ID, 
        category_ID: category_ID 
      })
    );

    if (existingInterest) {
      return req.error(400, 'Interesse já registrado');
    }
  });

  // Handlers genéricos de READ para todas as entidades
  this.on('READ', 'BooksNoDraft', async (req) => {
    const db = await cds.connect.to('db')
    return await db.run(req.query)
  })

  // Handler global de erro
  this.on('error', (err) => {
    console.error('Erro no serviço:', err);
    return err;
  })
})