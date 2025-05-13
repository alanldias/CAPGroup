using CatalogService as service from '../../srv/cat-service';



annotate service.Customers with @(
  UI.Facets: [
    {
      $Type: 'UI.ReferenceFacet',
      ID: 'CustomerInfo',
      Label: 'Informações do Cliente',
      Target: '@UI.FieldGroup#CustomerInfo'
    },
    {
      $Type: 'UI.ReferenceFacet',
      ID: 'CustomerInterests',
      Label: 'Interesses',
      Target: 'interest/@UI.LineItem#InterestTable'
    }
  ],
  UI.FieldGroup#CustomerInfo: {
    $Type: 'UI.FieldGroupType',
    Data: [
      {
        $Type: 'UI.DataField',
        Value: name,
        Label: 'Nome'
      },
      {
        $Type: 'UI.DataField',
        Value: dateNasc,
        Label: 'Data de Nascimento'
      },
      {
        $Type: 'UI.DataField',
        Value: cpf,
        Label: 'CPF'
      }
    ]
  },
  UI.LineItem: [ 
    {
      $Type: 'UI.DataField',
      Value: name,
      Label: 'Nome'
    },
    {
      $Type: 'UI.DataField',
      Value: dateNasc,
      Label: 'Data Nascimento'
    },
    {
      $Type: 'UI.DataField',
      Value: cpf,
      Label: 'CPF'
    }
  ]
);

annotate service.Interest with @(
  UI.LineItem #InterestTable: [ 
    {
      $Type: 'UI.DataField',
      Value: category_ID,
      Label: 'Categoria'
    }
  ]
);

annotate service.Interest with {
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
      }
    ]
  }
};

annotate service.Customers with {
  IsActiveEntity @Common.FilterDefaultValue: true;
};



