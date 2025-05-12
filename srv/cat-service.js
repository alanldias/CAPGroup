// const cds = require('@sap/cds')

// const { Books, Customers, Category, Interest } = cds.entities('my.bookshop')

// module.exports = cds.service.impl(async function() {
//     this.before(['CREATE', 'UPDATE'], 'Books', async (req) => {
//         if (req.data.stock < 0) {
//             req.error(400, 'O estoque não pode ser negativo!')
//         }
//     })

//     this.before('CREATE', 'Customers', async (req) => {
//         const { cpf } = req.data
//         const exists = await SELECT.from(Customers).where({ cpf })
//         if (exists.length > 0) {
//             req.error(400, "CPF já cadastrado")
//         }
//     })

//     this.before('CREATE', 'Interest', async (req) => {
//         const { customer_ID, category_ID } = req.data

//         const customerExists = await SELECT.from(Customers).where({ ID: customer_ID })

//         if (!customerExists.length) {
//             req.error(400, 'Cliente não encontrado')
//         }

//         const categoryExists = await SELECT.from(Category).where({ ID: category_ID })

//         if (!categoryExists.length) {
//             req.error(400, 'Categoria não encontrada')
//         }
//     })

//     // Ações 
//     this.on('checkBookStock', async (req) => {
//         const { bookId } = req.data
//         const book = await SELECT.from(Books).where({ ID: bookId })

//         if(!book.length) {
//             return{ available: false, message: 'Livro não encontrado'}
//         }
//     })
// })

