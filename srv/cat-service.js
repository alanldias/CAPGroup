const cds = require('@sap/cds')
const { Books, Customers, Category, Interest } = cds.entities('my.bookshop')

// Constantes para validação
const VALIDATION_RULES = {
    BOOK: {
        MIN_TITLE_LENGTH: 5,
        MIN_AUTHOR_LENGTH: 3,
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
    // Funções de sanitização
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

    // Validações para Livros
    const validateBook = (data, req) => {
        console.log('Validando livro:', data)
        const { title, author, stock, datePub, description, category } = data
        
        const validations = [
            {
                condition: !title || title.length <= VALIDATION_RULES.BOOK.MIN_TITLE_LENGTH,
                message: `O título deve ter pelo menos ${VALIDATION_RULES.BOOK.MIN_TITLE_LENGTH} caracteres`
            },
            {
                condition: !author || author.length <= VALIDATION_RULES.BOOK.MIN_AUTHOR_LENGTH,
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
            // {
            //     condition: !category,
            //     message: "Categoria é obrigatória"
            // }
        ]

        validations.forEach(({ condition, message }) => {
            if(condition) {
                req.error(400, message)
            }
        })

        if (!stock) data.stock = VALIDATION_RULES.BOOK.DEFAULT_STOCK
        return data
    }

    // Validações para Clientes
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
            if(condition) {
                req.error(400, message)
            }
        })

        return data
    }

    // Validações para Categorias
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
            if(condition) {
                req.error(400, message)
            }
        })

        return data
    }

    // Handlers para Livros
    this.before(['CREATE', 'UPDATE'], 'Books', async (req) => {
        try {
            req.data = sanitizeData(req.data)
            validateBook(req.data, req)
        } catch (error) {
            console.error('Erro ao processar livro:', error)
            req.error(500, "Erro interno ao processar livro")
        }
    })

    // this.on('READ', 'Books', async (req) => {
    //     try {
    //         const books = await SELECT.from(Books)
    //         console.log(`${books.length} livros encontrados`)
    //         return books
    //     } catch (error) {
    //         console.error('Erro ao ler livros:', error)
    //         req.error(500, "Erro ao buscar livros")
    //     }
    // })

    this.before('DELETE', 'Books', async (req) => {
        try {
            const bookId = req.data.ID
            const book = await SELECT.from(Books).where({ ID: bookId })
            
            if (!book.length) {
                req.error(404, "Livro não encontrado")
            }
        } catch (error) {
            console.error('Erro ao deletar livro:', error)
            req.error(500, "Erro ao deletar livro")
        }
    })

    // Handlers para Clientes
    this.before(['CREATE', 'UPDATE'], 'Customers', async (req) => {
        try {
            req.data = sanitizeData(req.data)
            validateCustomer(req.data, req)
        } catch (error) {
            console.error('Erro ao processar cliente:', error)
            req.error(500, "Erro interno ao processar cliente")
        }
    })

    //errado
    // this.on('READ', 'Customers', async (req) => {
    //     try {
    //         const customers = await SELECT.from(Customers)
    //         console.log(`${customers.length} clientes encontrados`)
    //         return customers
    //     } catch (error) {
    //         console.error('Erro ao ler clientes:', error)
    //         req.error(500, "Erro ao buscar clientes")
    //     }
    // })

    this.before('DELETE', 'Customers', async (req) => {
        try {
            const customerId = req.data.ID
            const customer = await SELECT.from(Customers).where({ ID: customerId })
            
            if (!customer.length) {
                req.error(404, "Cliente não encontrado")
            }
        } catch (error) {
            console.error('Erro ao deletar cliente:', error)
            req.error(500, "Erro ao deletar cliente")
        }
    })

    // Handlers para Categorias
    // this.before(['CREATE', 'UPDATE'], 'Category', async (req) => {
    //     try {
    //         req.data = sanitizeData(req.data)
    //         validateCategory(req.data, req)
    //     } catch (error) {
    //         console.error('Erro ao processar categoria:', error)
    //         req.error(500, "Erro interno ao processar categoria")
    //     }
    // })

    // this.on('READ', 'Category', async (req) => {
    //     try {
    //         const categories = await SELECT.from(Category)
    //         console.log(`${categories.length} categorias encontradas`)
    //         return categories
    //     } catch (error) {
    //         console.error('Erro ao ler categorias:', error)
    //         req.error(500, "Erro ao buscar categorias")
    //     }
    // })

    this.before('DELETE', 'Category', async (req) => {
        try {
            const categoryId = req.data.ID
            const category = await SELECT.from(Category).where({ ID: categoryId })
            
            if (!category.length) {
                req.error(404, "Categoria não encontrada")
            }

            // Verificar se existem livros usando esta categoria
            const booksWithCategory = await SELECT.from(Books).where({ category_ID: categoryId })
            if (booksWithCategory.length > 0) {
                req.error(400, "Não é possível deletar categoria em uso")
            }
        } catch (error) {
            console.error('Erro ao deletar categoria:', error)
            req.error(500, "Erro ao deletar categoria")
        }
    })

    // Handlers para Interesses
    this.before(['CREATE', 'UPDATE'], 'Interest', async (req) => {
        try {
            const { customer_ID, category_ID } = req.data

            // Validar se cliente existe
            const customer = await SELECT.from(Customers).where({ ID: customer_ID })
            if (!customer.length) {
                req.error(404, "Cliente não encontrado")
            }

            // Validar se categoria existe
            const category = await SELECT.from(Category).where({ ID: category_ID })
            if (!category.length) {
                req.error(404, "Categoria não encontrada")
            }

            // Verificar se interesse já existe (apenas para CREATE)
            if (req.event === 'CREATE') {
                const existingInterest = await SELECT.from(Interest)
                    .where({ customer_ID: customer_ID, category_ID: category_ID })
                
                if (existingInterest.length > 0) {
                    req.error(400, "Interesse já registrado para este cliente e categoria")
                }
            }
        } catch (error) {
            console.error('Erro ao processar interesse:', error)
            req.error(500, "Erro interno ao processar interesse")
        }
    })

    // this.on('READ', 'Interest', async (req) => {
    //     try {
    //         const interests = await SELECT.from(Interest)
    //         console.log(`${interests.length} interesses encontrados`)
    //         return interests
    //     } catch (error) {
    //         console.error('Erro ao ler interesses:', error)
    //         req.error(500, "Erro ao buscar interesses")
    //     }
    // })

    this.before('DELETE', 'Interest', async (req) => {
        try {
            const interestId = req.data.ID
            const interest = await SELECT.from(Interest).where({ ID: interestId })
            
            if (!interest.length) {
                req.error(404, "Interesse não encontrado")
            }
        } catch (error) {
            console.error('Erro ao deletar interesse:', error)
            req.error(500, "Erro ao deletar interesse")
        }
    })

    // Handlers para mensagens de sucesso
    this.after(['CREATE', 'UPDATE', 'DELETE'], ['Books', 'Customers', 'Category', 'Interest'], async (data, req) => {
        const entity = req.target.name
        const operation = req.event
        console.log(`Operação ${operation} realizada com sucesso em ${entity}`)
    })

    // Handler global para erros
    this.on('error', (err, req) => {
        console.error('Erro no serviço:', err)
        return err
    })
})