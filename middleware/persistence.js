export default function ({
                             store,
                             route,
                         }) {
    if (window.localStorage.get('state')) {
        store.commit('outlet/SET_CHECK', window.localStorage.get('outlet'))
    }

}
