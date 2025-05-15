sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'bookappcustomers/test/integration/FirstJourney',
		'bookappcustomers/test/integration/pages/CustomersList',
		'bookappcustomers/test/integration/pages/CustomersObjectPage',
		'bookappcustomers/test/integration/pages/InterestObjectPage'
    ],
    function(JourneyRunner, opaJourney, CustomersList, CustomersObjectPage, InterestObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('bookappcustomers') + '/index.html'
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