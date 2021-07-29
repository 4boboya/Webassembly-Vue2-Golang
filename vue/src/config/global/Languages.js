import {i18n} from '@/i18n'
export default new class Languages {
    languages = [
        { text: 'English', key: 'enus' },
        { text: '日本語', key: 'jajp' },
        { text: '繁體中文', key: 'zhtw' },
        { text: '简体中文', key: 'zhcn' },
    ]
    Languages() {
        return this.languages
    }
    LanguagesBar() {
        return [{ text: i18n.t('Header.Languages'), value: this.Languages(), side: 'Languages' }]
    }
}
