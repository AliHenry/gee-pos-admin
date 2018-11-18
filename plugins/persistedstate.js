export default function ({ store }) {
    if (localStorage.getItem('outlet')) {
        let outlet = JSON.parse(localStorage.getItem('outlet'));
        store.commit('outlet/SET_CHECK', outlet);
        store.commit('outlet/SET_OUTLET', outlet);
    }
}