export default new class Docs {
    docs = {
        Help_and_FAQ: 'HelpAndFAQ',
        Become_an_Expert: 'BecomeAnExpert',
        Become_a_Subscriber: 'BecomeASubscriber',
        Subscribe_Solution: 'SubscribeSolution',
        Documents_For_API: 'DocumentsForAPI',
        Samples: 'Samples',
        Contact_Support: 'ContactSupport',
        About_Us: 'AboutUs',
        Use_of_the_Site: 'UseOfTheSite',
        Posting_Content_on_the_Site: 'PostingContentOnTheSite',
        Registering_for_an_account: 'RegisteringForAnAccount',
        Programs: 'Programs',
        Content_on_the_Site: 'ContentOnTheSite',
        General_terms: 'GeneralTerms',
        'Policy_&_Agreements': 'PolicyAndAgreements',
        Promotions: 'Promotions',
    }
    DocsRouter() {
        let doctArray = Object.keys(this.docs);
        let doctRouter = doctArray.join('|');
        return doctRouter;
    }
    DocsValue(docsKey) {
        return this.docs[docsKey];
    }
}
