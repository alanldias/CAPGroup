using CatalogService as service from '../../srv/cat-service';
annotate service.Customers with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'name',
                Value : name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'dateNasc',
                Value : dateNasc,
            },
            {
                $Type : 'UI.DataField',
                Label : 'cpf',
                Value : cpf,
            },
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
            Label : 'name',
            Value : name,
        },
        {
            $Type : 'UI.DataField',
            Label : 'dateNasc',
            Value : dateNasc,
        },
        {
            $Type : 'UI.DataField',
            Label : 'cpf',
            Value : cpf,
        },
    ],
);

