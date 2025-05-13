using CatalogService as service from '../../srv/cat-service';

annotate service.Books with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Titulo',
                Value : title,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Descrição',
                Value : description,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Autor',
                Value : author,
            },
            {
                $Type : 'UI.DataField',
                Label : 'DatePub',
                Value : datePub,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Estoque',
                Value : stock,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Categoria',
                Value : category_ID,
            }
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Titulo',
            Value : title,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Descrição',
            Value : description,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Autor',
            Value : author,
        },
        {
            $Type : 'UI.DataField',
            Label : 'DatePub',
            Value : datePub,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Estoque',
            Value : stock,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Categoria',
            Value : category_ID,
        }
    ],
);

annotate service.Books with {
    category @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Category',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : category_ID,
                ValueListProperty : 'ID',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'name',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'description',
            },
        ],
    }
};

annotate service.Books with {
  IsActiveEntity @Common.FilterDefaultValue: true;
};