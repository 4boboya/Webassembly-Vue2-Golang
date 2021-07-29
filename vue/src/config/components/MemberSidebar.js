
export default new class MemberCtrl{
    MemberCtrl = [
        {icon:['fas', 'user-cog'],text:"AccountSidebar.Profile",path:'profile'},
        {icon: ['fas', 'scroll'],text:"AccountSidebar.Order",path:'order'},
    ]
    MemberCtrlItem(){
        return this.MemberCtrl
    }
}