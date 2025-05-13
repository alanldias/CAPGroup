sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'bookappcategories/test/integration/FirstJourney',
		'bookappcategories/test/integration/pages/CategoryList',
		'bookappcategories/test/integration/pages/CategoryObjectPage'
    ],
    function(JourneyRunner, opaJourney, CategoryList, CategoryObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('bookappcategories') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheCategoryList: CategoryList,
					onTheCategoryObjectPage: CategoryObjectPage
                }
            },
            opaJourney.run
        );
    }
);