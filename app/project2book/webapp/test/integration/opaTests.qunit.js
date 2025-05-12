sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'viewfiorielementsbook/project2book/test/integration/FirstJourney',
		'viewfiorielementsbook/project2book/test/integration/pages/BooksList',
		'viewfiorielementsbook/project2book/test/integration/pages/BooksObjectPage'
    ],
    function(JourneyRunner, opaJourney, BooksList, BooksObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('viewfiorielementsbook/project2book') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheBooksList: BooksList,
					onTheBooksObjectPage: BooksObjectPage
                }
            },
            opaJourney.run
        );
    }
);