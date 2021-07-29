import {i18n} from '@/i18n'

export default new class Customer {
    Customer_Expert = [
        { text: 'Header.BecomeAnExpert', icon: ['fas', 'scroll'], path:'/docs/Become_an_Expert' },]
    Customer_Subscriber = [
        { text: 'Header.BecomeASubscriber', icon: ['fas', 'scroll'], path:'/docs/Become_a_Subscriber' },]
    Customer_Help = [
        { text: 'Header.Orders', icon: ['fas', 'scroll'], path:'/' },
        { text: 'Header.Notifications', icon: ['fas', 'file-invoice-dollar'], path:'/' },
        { text: 'Header.SubscribeSolution', icon: ['fas', 'box'], path:'/docs/Subscribe_Solution' },
        { text: 'Header.DocumentsForAPI', icon: ['fas', 'truck-loading'], path:'/docs/Documents_For_API' },
        { text: 'Header.Samples', icon: ['fas', 'file-invoice-dollar'], path:'/docs/Samples' },];
    Customer_Support = [
        { text: 'Header.ContactSupport', icon: ['fas', 'info-circle'],path:'/docs/Contact_Support' },]
    Customer_Policy = [
        { text: 'Header.AboutUs', icon: ['fas', 'info-circle'], path:'/docs/About_Us' },
        { text: 'Header.UseOfTheSite', icon: ['far', 'comments'], path:'/docs/Use_of_the_Site' },
        { text: 'Header.PostingContentOnTheSite', icon: ['fas', 'comment'], path:'/docs/Posting_Content_on_the_Site' },
        { text: 'Header.RegisteringForAnAccount', icon: ['fas', 'question-circle'], path:'/docs/Registering_for_an_account' },
        { text: 'Header.Programs', icon: ['fas', 'info-circle'], path:'/docs/Programs' },
        { text: 'Header.ContentOnTheSite', icon: ['far', 'comments'], path:'/docs/Content_on_the_Site' },
        { text: 'Header.GeneralTerms', icon: ['fas', 'comment'], path:'/docs/General_terms' },]

    Feedback = [
        { text: 'Header.Help', icon: ['fas', 'info-circle'], path:'/docs/Help_and_FAQ' },]

    User = [
        { text: 'Header.Profile', icon: ['fas', 'user-cog'], path: '/account/profile' },
        { text: 'Header.ViewMyPoints', icon: ['fas', 'sign-out-alt'], path: '/' },
        { text: 'Header.OrderHistory', icon: ['fas', 'sign-out-alt'], path: '/' },
        { text: 'Header.AutoNotifications', icon: ['fas', 'sign-out-alt'], path: '/' },
        { text: 'Header.BecomeAnExpert', icon: ['fas', 'sign-out-alt'], path: '/' },
        { text: 'Header.LogOut', icon: ['fas', 'sign-out-alt'], path: '/LogOut' },]
    Header_CustomerExpert() {
        return this.Customer_Expert
    }
    Header_CustomerSubscriber() {
        return this.Customer_Subscriber
    }
    Header_CustomerHelp() {
        return this.Customer_Help
    }
    Header_CustomerSupport() {
        return this.Customer_Support
    }
    Header_CustomerPolicy() {
        return this.Customer_Policy
    }
    User_list() {
        return this.User
    }
    Feedback_list() {
        return this.Feedback
    }
    UserBar() {
        let UserBar = [
            { text: 'Header.Feeback', value: this.Feedback_list(), side: 'Feedback' },
            { text: 'Header.CustomerExpert', value: this.Header_CustomerExpert(), side: 'Customer_Expert' },
            { text: 'Header.CustomerSubscriber', value: this.Header_CustomerSubscriber(), side: 'Customer_Subscriber' },
            { text: 'Header.CustomerHelp', value: this.Header_CustomerHelp(), side: 'Customer_Help' },
            { text: 'Header.CustomerSupport', value: this.Header_CustomerSupport(), side: 'Customer_Support' },
            { text: 'Header.CustomerPolicy', value: this.Header_CustomerPolicy(), side: 'Customer_Policy' },
        ]

        return UserBar
    }
}
