export default class PreferModeStorage {
    static save(modeId:number) {
        localStorage.setItem('prefered-mode', modeId.toString());
    }

    static get() {
        const modeId = localStorage.getItem('prefered-mode');
        if (!modeId) {
            return null;
        }
        return parseInt(modeId);
    }
}   