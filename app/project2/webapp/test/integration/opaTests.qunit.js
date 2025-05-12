sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'viewfioribook/project2/test/integration/FirstJourney',
		'viewfioribook/project2/test/integration/pages/CustomersList',
		'viewfioribook/project2/test/integration/pages/CustomersObjectPage',
		'viewfioribook/project2/test/integration/pages/InterestObjectPage'
    ],
    function(JourneyRunner, opaJourney, CustomersList, CustomersObjectPage, InterestObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('viewfioribook/project2') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheCustomersList: CustomersList,
					onTheCustomersObjectPage: CustomersObjectPage,
					onTheInterestObjectPage: InterestObjectPage
                }
            },
            opaJourney.run
        );
    }
);