using CatalogService as service from '../../srv/cat-service';
annotate service.Category with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Nome',
                Value : name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Descrição',
                Value : description,
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
            Label : 'Nome',
            Value : name,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Descrição',
            Value : description,
        },
    ],
);

annotate service.Category with {
  IsActiveEntity @Common.FilterDefaultValue: true;
};

