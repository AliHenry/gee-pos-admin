export const state = () => ({
    checkOutlet: {
        status: false,
        code: '',
        outletId: ''
    },
    business: {},
    outlet: {},
    status: {
        loading: false,
        success: false,
        error: false
    },
});

export const getters = {
    getBiz(state) {
        return state.business
    },
    getOutlet(state) {
        return state.outlet
    },
    getCheck(state){
        return state.checkOutlet;
    },
    getStatus(state){
        return state.status;
    }

};

export const mutations = {
    SET_BUSINESS(state, business) {
        state.business = business
    },
    SET_OUTLET(state, outlet) {
        state.outlet = outlet;
    },
    SET_CHECK(state, outlet) {
        state.checkOutlet.status = true;
        state.checkOutlet.code = outlet.code;
        state.checkOutlet.outletId = outlet.outlet_uuid;
    },
    CLEAR_CHECK(state) {
        state.checkOutlet.status = false;
        state.checkOutlet.code = '';
        state.checkOutlet.outletId = '';
    },
    LOADING(state) {
        state.status = {
            loading: true,
            success: false,
            error: false
        }
    },
    SUCCESS(state) {
        state.status = {
            loading: false,
            success: true,
            error: false
        }
    },
    ERROR(state, error) {
        state.status = {
            loading: false,
            success: false,
            error: error && error.message || error
        }
    },
};

export const actions = {
    async register(context, payload) {
        let vm = this;
        return new Promise((resolve, reject) => {
            context.commit('LOADING');
            vm.$axios.post('business', payload).then(response => {
                context.commit('SUCCESS');
                context.commit('SET_BUSINESS', response.data.response.data.business);
                context.commit('SET_OUTLET', response.data.response.data.outlet);
                console.log(response.data.response.data)
                resolve(response);
            }).catch(error => {
                context.commit('ERROR', error.response.data.errors);
                reject(error);
            });
        })
    },

    async checkOutlet(context, code) {
        let vm = this;
        return new Promise((resolve, reject) => {
            context.commit('LOADING');
            vm.$axios.get('check-outlet?code='+ code).then(response => {
                context.commit('SUCCESS');
                context.commit('SET_CHECK', response.data.response.outlet);
                localStorage.setItem('outlet', JSON.stringify(response.data.response.outlet));
                console.log(response.data.response.outlet);
                resolve(response);
            }).catch(error => {
                context.commit('ERROR', error.response.data.error);
                console.log(error.response.data.error);
                reject(error);
            });
        })
    },

    async clearOutlet({commit}) {
       commit('CLEAR_CHECK');
    },


}
