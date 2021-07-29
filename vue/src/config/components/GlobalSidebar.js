import {i18n} from '@/i18n'

export default new class Ball {
    Ball = [
        { icon: ['fas', 'basketball-ball'], text: 'Sidebar.Basketball', type: "BK" },
        { icon: ['fas', 'futbol'], text: 'Sidebar.Soccer', type: "SC" },
        { icon: ['fas', 'baseball-ball'], text: 'Sidebar.Baseball', type: "BS" },
        { icon: ['fas', 'hockey-puck'], text: 'Sidebar.IceHockey', type: "HL" },
        { icon: ['fas', 'table-tennis'], text: 'Sidebar.Tennis', type: "TN" },
    ]
    BallItem() {
        return this.Ball
    }
}