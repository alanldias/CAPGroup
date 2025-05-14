const cds = require('@sap/cds')
const { Books, Customers, Category, Interest } = cds.entities('my.bookshop')

// Constantes para validação
const VALIDATION_RULES = {
    BOOK: {
        MIN_TITLE_LENGTH: 6,
        MIN_AUTHOR_LENGTH: 4,
        DEFAULT_STOCK: 0
    },
    CUSTOMER: {
        MIN_NAME_LENGTH: 3,
        CPF_LENGTH: 11
    },
    CATEGORY: {
        MIN_NAME_LENGTH: 3
    }
}

module.exports = cds.service.impl(async function() {

    // --- Funções utilitárias ---
    // Sanitiza strings removendo espaços
    const sanitizeData = (data) => {
        const sanitized = {}
        for (let key in data) {
            if (typeof data[key] === 'string') {
                sanitized[key] = data[key].trim()
            } else {
                sanitized[key] = data[key]
            }
        }
        return sanitized
    }

    // Validação de Livros
    const validateBook = (data, req) => {
        console.log('Validando livro:', data)
        const { title, author, stock, datePub, description } = data
        const validations = [
            {
                condition: !title || title.length < VALIDATION_RULES.BOOK.MIN_TITLE_LENGTH,
                message: `O título deve ter pelo menos ${VALIDATION_RULES.BOOK.MIN_TITLE_LENGTH} caracteres`
            },
            {
                condition: !author || author.length < VALIDATION_RULES.BOOK.MIN_AUTHOR_LENGTH,
                message: `O nome do autor deve ter pelo menos ${VALIDATION_RULES.BOOK.MIN_AUTHOR_LENGTH} caracteres`
            },
            {
                condition: !datePub,
                message: "Data de publicação é obrigatória!"
            },
            {
                condition: !description,
                message: "Descrição é obrigatória!"
            },
            {
                condition: data.stock < 0,
                message: "O estoque não pode estar negativo"
            },
            {
                condition: !(data.category || data.category_ID),
                message: "Categoria é obrigatória"
            }
        ]
        validations.forEach(({ condition, message }) => {
            if (condition) req.error(400, message)
        })

        if (!stock) data.stock = VALIDATION_RULES.BOOK.DEFAULT_STOCK

    }

    // Validação de Clientes
    const validateCustomer = (data, req) => {
        console.log('Validando cliente:', data)
        const { name, dateNasc, cpf } = data
        const validations = [
            {
                condition: !name || name.length <= VALIDATION_RULES.CUSTOMER.MIN_NAME_LENGTH,
                message: `O nome deve ter pelo menos ${VALIDATION_RULES.CUSTOMER.MIN_NAME_LENGTH} caracteres`
            },
            {
                condition: !dateNasc,
                message: "Data de nascimento é obrigatória!"
            },
            {
                condition: !cpf || cpf.length !== VALIDATION_RULES.CUSTOMER.CPF_LENGTH,
                message: "CPF inválido!"
            }
        ]
        validations.forEach(({ condition, message }) => {
            if (condition) req.error(400, message)
        })
        return data
    }

    // Validação de Categorias
    const validateCategory = (data, req) => {
        console.log('Validando categoria:', data)
        const { name, description } = data
        const validations = [
            {
                condition: !name || name.length <= VALIDATION_RULES.CATEGORY.MIN_NAME_LENGTH,
                message: `O nome deve ter pelo menos ${VALIDATION_RULES.CATEGORY.MIN_NAME_LENGTH} caracteres`
            },
            {
                condition: !description,
                message: "Descrição é obrigatória!"
            }
        ]
        validations.forEach(({ condition, message }) => {
            if (condition) req.error(400, message)
        })
        return data
    }

    // =========================
    // === HANDLERS: BOOKS ====
    // =========================

    // --- BEFORE ---
    // CREATE & UPDATE: Sanitiza e valida dados de livro
    this.before(['CREATE', 'UPDATE'], 'Books', async (req) => {
        try {
            req.data = sanitizeData(req.data)
            validateBook(req.data, req)
        } catch (error) {
            console.error('Erro ao processar livro:', error)
            req.error(500, "Erro interno ao processar livro")
        }
    })

    // DELETE: Verifica existência do livro antes de deletar
    this.before('DELETE', 'Books', async (req) => {
        try {
            const bookId = req.data.ID
            const book = await SELECT.from(Books).where({ ID: bookId })
            if (!book.length) req.error(404, "Livro não encontrado")
        } catch (error) {
            console.error('Erro ao deletar livro:', error)
            req.error(500, "Erro ao deletar livro")
        }
    })

    // --- ON ---
    // READ: Usa req.query para garantir compatibilidade com drafts e filtros
    this.on('READ', 'Books', async (req) => {
        try {
            return await cds.tx(req).run(req.query)
        } catch (error) {
            req.error(500, "Erro ao buscar livros")
        }
    })

    // --- AFTER ---
    // CREATE, UPDATE, DELETE: Log de sucesso (não altera retorno)
    this.after(['CREATE', 'UPDATE', 'DELETE'], 'Books', async (data, req) => {
        const entity = req.target.name
        const operation = req.event
        console.log(`Operação ${operation} realizada com sucesso em ${entity}`)
    })

    // ============================
    // === HANDLERS: CUSTOMERS ====
    // ============================

    // --- BEFORE ---
    // CREATE & UPDATE: Sanitiza e valida dados de cliente
    this.before(['CREATE', 'UPDATE'], 'Customers', async (req) => {
        try {
            req.data = sanitizeData(req.data)
            validateCustomer(req.data, req)
        } catch (error) {
            console.error('Erro ao processar cliente:', error)
            req.error(500, "Erro interno ao processar cliente")
        }
    })

    // DELETE: Verifica existência do cliente antes de deletar
    this.before('DELETE', 'Customers', async (req) => {
        try {
            const customerId = req.data.ID
            const customer = await SELECT.from(Customers).where({ ID: customerId })
            if (!customer.length) req.error(404, "Cliente não encontrado")
        } catch (error) {
            console.error('Erro ao deletar cliente:', error)
            req.error(500, "Erro ao deletar cliente")
        }
    })

    // --- ON ---
    // READ: Retorna todos os clientes
    this.on('READ', 'Customers', async (req) => {
        try {
            return await cds.tx(req).run(req.query)
        } catch (error) {
            req.error(500, "Erro ao buscar livros")
        }
    })

    // --- AFTER ---
    // CREATE, UPDATE, DELETE: Log de sucesso
    this.after(['CREATE', 'UPDATE', 'DELETE'], 'Customers', async (data, req) => {
        const entity = req.target.name
        const operation = req.event
        console.log(`Operação ${operation} realizada com sucesso em ${entity}`)
    })

    // ===========================
    // === HANDLERS: CATEGORY ====
    // ===========================

    // --- BEFORE ---
    // CREATE & UPDATE: Sanitiza e valida dados de categoria
    this.before(['CREATE', 'UPDATE'], 'Category', async (req) => {
        try {
            req.data = sanitizeData(req.data)
            validateCategory(req.data, req)
        } catch (error) {
            console.error('Erro ao processar categoria:', error)
            req.error(500, "Erro interno ao processar categoria")
        }
    })

    // DELETE: Verifica existência e uso da categoria antes de deletar
    this.before('DELETE', 'Category', async (req) => {
        try {
            const categoryId = req.data.ID
            const category = await SELECT.from(Category).where({ ID: categoryId })
            if (!category.length) req.error(404, "Categoria não encontrada")
            // Verifica se há livros usando esta categoria
            const booksWithCategory = await SELECT.from(Books).where({ category_ID: categoryId })
            if (booksWithCategory.length > 0) req.error(400, "Não é possível deletar categoria em uso")
        } catch (error) {
            console.error('Erro ao deletar categoria:', error)
            req.error(500, "Erro ao deletar categoria")
        }
    })

    // --- ON ---
    // READ: Retorna todas as categorias
    this.on('READ', 'Category', async (req) => {
        try {
            return await cds.tx(req).run(req.query)
        } catch (error) {
            req.error(500, "Erro ao buscar livros")
        }
    })
    // --- AFTER ---
    // CREATE, UPDATE, DELETE: Log de sucesso
    this.after(['CREATE', 'UPDATE', 'DELETE'], 'Category', async (data, req) => {
        const entity = req.target.name
        const operation = req.event
        console.log(`Operação ${operation} realizada com sucesso em ${entity}`)
    })

    // ===========================
    // === HANDLERS: INTEREST ====
    // ===========================

    // --- BEFORE ---
    // CREATE & UPDATE: Valida existência de cliente e categoria, e duplicidade de interesse
    this.before(['CREATE', 'UPDATE'], 'Interest', async (req) => {
        try {
            const { customer_ID, category_ID } = req.data
            // Valida cliente
            const customer = await SELECT.from(Customers).where({ ID: customer_ID })
            if (!customer.length) req.error(404, "Cliente não encontrado")
            // Valida categoria
            const category = await SELECT.from(Category).where({ ID: category_ID })
            if (!category.length) req.error(404, "Categoria não encontrada")
            // Verifica duplicidade (apenas para CREATE)
            if (req.event === 'CREATE') {
                const existingInterest = await SELECT.from(Interest)
                    .where({ customer_ID: customer_ID, category_ID: category_ID })
                if (existingInterest.length > 0) req.error(400, "Interesse já registrado para este cliente e categoria")
            }
        } catch (error) {
            console.error('Erro ao processar interesse:', error)
            req.error(500, "Erro interno ao processar interesse")
        }
    })

    // DELETE: Verifica existência do interesse antes de deletar
    this.before('DELETE', 'Interest', async (req) => {
        try {
            const interestId = req.data.ID
            const interest = await SELECT.from(Interest).where({ ID: interestId })
            if (!interest.length) req.error(404, "Interesse não encontrado")
        } catch (error) {
            console.error('Erro ao deletar interesse:', error)
            req.error(500, "Erro ao deletar interesse")
        }
    })

    // --- ON ---
    // READ: Retorna todos os interesses
    this.on('READ', 'Interest', async (req) => {
        try {
            return await cds.tx(req).run(req.query)
        } catch (error) {
            req.error(500, "Erro ao buscar livros")
        }
    })

    // --- AFTER ---
    // CREATE, UPDATE, DELETE: Log de sucesso
    this.after(['CREATE', 'UPDATE', 'DELETE'], 'Interest', async (data, req) => {
        const entity = req.target.name
        const operation = req.event
        console.log(`Operação ${operation} realizada com sucesso em ${entity}`)
    })

    // ===========================
    // === HANDLER GLOBAL DE ERRO
    // ===========================
    this.on('error', (err) => {
        console.error('Erro no serviço:', err)
        return err
    })
})