sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'viewfioribook.project2',
            componentId: 'InterestObjectPage',
            contextPath: '/Customers/interest'
        },
        CustomPageDefinitions
    );
});