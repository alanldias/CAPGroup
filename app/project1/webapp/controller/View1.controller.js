sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/layout/form/SimpleForm",
     "sap/m/MessageBox"
], (Controller) => {
    "use strict";

    return Controller.extend("fioricustom.project1.controller.View1", {
        onInit() {
        },
        
        onFilterBooks: function () {
            var oTable = this.byId("BooksTable");
            var oBinding = oTable.getBinding("items");
        
            var sTitle = this.byId("inputTitle").getValue();
            var sCategory = this.byId("inputCategory").getValue();
        
            var aFilters = [];
        
            if (sTitle) {
                aFilters.push(new sap.ui.model.Filter("title", sap.ui.model.FilterOperator.Contains, sTitle));
            }
        
            if (sCategory) {
                aFilters.push(new sap.ui.model.Filter("category/name", sap.ui.model.FilterOperator.Contains, sCategory));
            }
        
            oBinding.filter(aFilters);
        },
        
        onClearFilters: function () {
            this.byId("inputTitle").setValue("");
            this.byId("inputCategory").setValue("");
        
            var oTable = this.byId("BooksTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter([]); // remove todos os filtros
        },

        onFilterSuggestedBooks: async function () {
            const oModel = this.getView().getModel();
            const sCustomerId = this.byId("customerSelect").getSelectedKey();
            const oBooksTable = this.byId("BooksTable");
        
            if (!sCustomerId) {
                sap.m.MessageToast.show("Selecione um cliente primeiro.");
                return;
            }
        
            try {
                // 1. Bind a lista de interesses com filtro
                const oBinding = oModel.bindList("/Interest", undefined, undefined, undefined, {
                    $filter: `customer_ID eq ${sCustomerId}`,
                    $expand: "category"
                });
        
                // 2. Busca os dados
                const aInterests = await oBinding.requestContexts();
                const aCategoryIds = aInterests.map(ctx => ctx.getObject().category_ID);
        
                if (aCategoryIds.length === 0) {
                    sap.m.MessageToast.show("Este cliente não possui interesses.");
                    return;
                }
        
                // 3. Aplicar os filtros na tabela de livros
                const aFilters = aCategoryIds.map(id => new sap.ui.model.Filter("category_ID", "EQ", id));
                oBooksTable.getBinding("items").filter(new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false
                }));
        
            } catch (err) {
                console.error("Erro ao buscar interesses:", err);
            }
        },

        onBookDetailsPress: async function (oEvent) {
            const oButton = oEvent.getSource();
            const oContext = oButton.getBindingContext();
            const oBook = await oContext.requestObject();

            if (!this._oDialog) {
                this._oDialog = new sap.m.Dialog({
                    title: "Detalhes do Livro",
                    contentWidth: "500px",
                    content: new sap.ui.layout.form.SimpleForm({
                        editable: false,
                        layout: "ResponsiveGridLayout",
                        labelSpanM: 3,
                        labelSpanL: 3,
                        labelSpanXL: 2,
                        columnsM: 1,
                        columnsL: 1,
                        columnsXL: 1,
                        content: [
                            new sap.m.Label({ text: "Título" }),
                            new sap.m.Text({ id: "dlgTitle", text: oBook.title }),
        
                            new sap.m.Label({ text: "Autor" }),
                            new sap.m.Text({ id: "dlgAuthor", text: oBook.author }),
        
                            new sap.m.Label({ text: "Categoria" }),
                            new sap.m.Text({ id: "dlgCategory", text: oBook.category?.name || "Sem categoria" }),
        
                            new sap.m.Label({ text: "Descrição" }),
                            new sap.m.Text({ id: "dlgDesc", text: oBook.description || "-" }),
        
                            new sap.m.Label({ text: "Data de Publicação" }),
                            new sap.m.Text({ id: "dlgDate", text: oBook.datePub || "-" }),

                            new sap.m.Label({ text: "Quantidade em estoque:" }),
                            new sap.m.Text({ id: "dlgStock", text: oBook.stock || "Sem estoque" })
                        ]
                    }),
                    beginButton: new sap.m.Button({
                        text: "Fechar",
                        press: function () {
                            this._oDialog.close();
                        }.bind(this)
                    })
                });
        
                this.getView().addDependent(this._oDialog);
            } else {
                sap.ui.getCore().byId("dlgTitle").setText(oBook.title);
                sap.ui.getCore().byId("dlgAuthor").setText(oBook.author);
                sap.ui.getCore().byId("dlgCategory").setText(oBook.category?.name || "Sem categoria");
                sap.ui.getCore().byId("dlgDesc").setText(oBook.description || "-");
                sap.ui.getCore().byId("dlgDate").setText(oBook.datePub || "-");
                sap.ui.getCore().byId("dlgStock").setText(oBook.stock || "Sem estoque");
            }
        
            this._oDialog.open();
        },

        onModuleChange: function (oEvent) {
            const sKey = oEvent.getParameter("item").getKey();
        
            const oView = this.getView();
            oView.byId("columBook").setVisible(false);
            oView.byId("columAuthor").setVisible(false);
            oView.byId("columCategory").setVisible(false);
            oView.byId("columDatePub").setVisible(false);
            oView.byId("columStock").setVisible(false);
            oView.byId("columActions").setVisible(true);
        
            switch (sKey) {
                case "autorCategoria":
                    oView.byId("columAuthor").setVisible(true);
                    oView.byId("columCategory").setVisible(true);
                    break;
                case "categoriaTitulo":
                    oView.byId("columCategory").setVisible(true);
                    oView.byId("columBook").setVisible(true);
                    break;
                case "titulo":
                    oView.byId("columBook").setVisible(true);
                    break;
                case "autor":
                    oView.byId("columAuthor").setVisible(true);
                    break;
                case "categoria":
                    oView.byId("columCategory").setVisible(true);
                    break;
                case "tudo": 
                    oView.byId("columBook").setVisible(true);
                    oView.byId("columAuthor").setVisible(true);
                    oView.byId("columCategory").setVisible(true);
                    oView.byId("columDatePub").setVisible(true);
                    oView.byId("columStock").setVisible(true);
                    break;
            }
        },

        _onSaveNewBook: async function () {
            const oModel = this.getView().getModel();
            const sGroupId = "addBookGroup";
        
            try {
                const oDate = sap.ui.getCore().byId("addDatePub").getDateValue();
                const sDate = oDate ? oDate.toISOString().split("T")[0] : null;
        
                const stockValue = parseInt(sap.ui.getCore().byId("addStock").getValue());
        
                const oNewBook = {
                    title: sap.ui.getCore().byId("addTitle").getValue(),
                    author: sap.ui.getCore().byId("addAuthor").getValue(),
                    category_ID: sap.ui.getCore().byId("addCategoryId").getValue(),
                    description: sap.ui.getCore().byId("addDesc").getValue(),
                    datePub: sDate,
                    stock: isNaN(stockValue) ? 0 : stockValue
                };
        
                // ✅ Aqui usamos bindList().create() que funciona com OData V4
                const oBinding = oModel.bindList("/BooksNoDraft", null, null, null, {
                    $$updateGroupId: sGroupId
                });
        
                oBinding.create(oNewBook);
        
                // Enviar para o backend
                await oModel.submitBatch(sGroupId);
        
                this._oAddDialog.close();
                sap.m.MessageToast.show("Livro criado com sucesso!");
                this.byId("BooksTable").getBinding("items").refresh();
            } catch (err) {
                console.error("Erro ao criar livro:", err);
                sap.m.MessageBox.error("Erro ao criar livro.");
            }
        },
        
        onAddBook: function () {
            if (!this._oAddDialog) {
                this._oAddDialog = new sap.m.Dialog({
                    title: "Novo Livro",
                    contentWidth: "500px",
                    content: new sap.ui.layout.form.SimpleForm({
                        id: "addBookForm",
                        editable: true,
                        layout: "ResponsiveGridLayout",
                        content: [
                            new sap.m.Label({ text: "Título" }),
                            new sap.m.Input("addTitle"),
        
                            new sap.m.Label({ text: "Autor" }),
                            new sap.m.Input("addAuthor"),
        
                            new sap.m.Label({ text: "Categoria ID" }),
                            new sap.m.Input("addCategoryId"),
        
                            new sap.m.Label({ text: "Descrição" }),
                            new sap.m.Input("addDesc"),
        
                            new sap.m.Label({ text: "Data de Publicação" }),
                            new sap.m.DatePicker("addDatePub"),
        
                            new sap.m.Label({ text: "Estoque" }),
                            new sap.m.Input("addStock", { type: "Number" })
                        ]
                    }),
                    beginButton: new sap.m.Button({
                        text: "Salvar",
                        press: this._onSaveNewBook.bind(this)
                    }),
                    endButton: new sap.m.Button({
                        text: "Cancelar",
                        press: function () {
                            this._oAddDialog.close();
                        }.bind(this)
                    })
                });
        
                this.getView().addDependent(this._oAddDialog);
            }
        
            this._oAddDialog.open();
        },
        
        onEditBook: async function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const oBook = oContext.getObject(); 
            this._oEditContext = oContext;
        
            if (!this._oEditDialog) {
                this._oEditDialog = new sap.m.Dialog({
                    title: "Editar Livro",
                    contentWidth: "500px",
                    content: new sap.ui.layout.form.SimpleForm({
                        id: "editBookForm",
                        editable: true,
                        layout: "ResponsiveGridLayout",
                        content: [
                            new sap.m.Label({ text: "Título" }),
                            new sap.m.Input("editTitle"),
        
                            new sap.m.Label({ text: "Autor" }),
                            new sap.m.Input("editAuthor"),
        
                            new sap.m.Label({ text: "Categoria ID" }),
                            new sap.m.Input("editCategoryId"),
        
                            new sap.m.Label({ text: "Descrição" }),
                            new sap.m.Input("editDesc"),
        
                            new sap.m.Label({ text: "Data de Publicação" }),
                            new sap.m.DatePicker("editDatePub"),
        
                            new sap.m.Label({ text: "Estoque" }),
                            new sap.m.Input("editStock", { type: "Number" })
                        ]
                    }),
                    beginButton: new sap.m.Button({
                        text: "Salvar",
                        press: this._onSaveEditBook.bind(this)
                    }),
                    endButton: new sap.m.Button({
                        text: "Cancelar",
                        press: function () {
                            this._oEditDialog.close();
                        }.bind(this)
                    })
                });
        
                this.getView().addDependent(this._oEditDialog);
            }
        
            sap.ui.getCore().byId("editTitle").setValue(oBook.title);
            sap.ui.getCore().byId("editAuthor").setValue(oBook.author);
            sap.ui.getCore().byId("editCategoryId").setValue(oBook.category?.ID);
            sap.ui.getCore().byId("editDesc").setValue(oBook.description);

            const oDate = oBook.datePub ? new Date(oBook.datePub) : null;
            sap.ui.getCore().byId("editDatePub").setDateValue(oDate);
            sap.ui.getCore().byId("editStock").setValue(oBook.stock);

            this._oEditDialog.open();
        },

        _onSaveEditBook: async function () {
            const oModel = this.getView().getModel();
            const sPath = this._oEditContext.getPath(); // exemplo: /Books(guid)
            const sGroupId = "editBookGroup";
        
            try {
                const oBinding = oModel.bindContext(sPath, null, {
                    $$updateGroupId: sGroupId
                });
        
                await oBinding.initialize();
                const oContext = oBinding.getBoundContext();
        
                oContext.setProperty("title", sap.ui.getCore().byId("editTitle").getValue());
                oContext.setProperty("author", sap.ui.getCore().byId("editAuthor").getValue());
                oContext.setProperty("category_ID", sap.ui.getCore().byId("editCategoryId").getValue());
                oContext.setProperty("description", sap.ui.getCore().byId("editDesc").getValue());
        
                const oDate = sap.ui.getCore().byId("editDatePub").getDateValue();
                const sDate = oDate ? oDate.toISOString().split("T")[0] : null;
                oContext.setProperty("datePub", sDate);
        
                const stockValue = parseInt(sap.ui.getCore().byId("editStock").getValue());
                oContext.setProperty("stock", isNaN(stockValue) ? 0 : stockValue);
        
                // ✅ Submete via model, e não no context
                await oModel.submitBatch(sGroupId);
        
                this._oEditDialog.close();
                sap.m.MessageToast.show("Livro atualizado com sucesso!");
                this.byId("BooksTable").getBinding("items").refresh();
            } catch (err) {
                console.error("Erro ao atualizar livro:", err);
                sap.m.MessageBox.error("Erro ao atualizar o livro.");
            }
        },

        onDeleteBook: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const oModel = this.getView().getModel();
        
            sap.m.MessageBox.confirm("Tem certeza que deseja excluir este livro?", {
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                onClose: async function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.YES) {
                        try {
                            await oContext.delete();
                            sap.m.MessageToast.show("Livro excluído com sucesso.");

                        } catch (err) {
                            sap.m.MessageBox.error("Erro ao excluir livro.");
                            console.error(err);
                        }
                    }
                }
            });
        }
    });
});