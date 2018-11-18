export const state = () => ({
    transactions: [],
    transaction: {
        trans_uuid: '',
        quantity: '',
        total: '',
        sales_person: {
            name: ''
        },
        created_at: '',
        products: []
    },
    status: {
        loading: false,
        success: false,
        error: false
    },
});

export const getters = {
    get(state) {
        return state.transactions
    },
    getTransaction(state) {
        return state.transaction
    },
    getStatus(state){
        return state.status;
    },
};

export const mutations = {
    SET(state, transactions) {
        state.transactions = transactions
    },
    SET_TRANSACTION(state, transaction) {
        state.transaction = transaction;
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
    async fetch(context, payload) {
        let vm = this;
        let query = '';
        let data = null;
        if (payload.filter){
            data = {
                params: {
                    outlet_uuid: payload.outlet_uuid,
                    search: payload.search ? payload.search : '',
                    startDate: payload.startDate ? payload.startDate : false,
                    endDate: payload.endDate ? payload.endDate : false,
                }
            };
        }else {
            data = {
                params: {
                    outlet_uuid: payload.outlet_uuid,
                }
            };
        }
        return new Promise((resolve, reject) => {
            context.commit('LOADING');
            vm.$axios.get('transaction', data).then(response => {
                context.commit('SUCCESS');
                context.commit('SET', response.data.response.transactions);
                console.log(response.data.response);
                resolve(response);
            }).catch(error => {
                context.commit('ERROR', error.response.data.errors);
                reject(error);
            });
        })
    },

    async get(context, payload) {
        let vm = this;
        let data = {
            params: {
                outlet_uuid: payload.outlet_uuid
            }
        };
        return new Promise((resolve, reject) => {
            context.commit('LOADING');
            vm.$axios.get('transaction/'+payload.trans_uuid, data).then(response => {
                context.commit('SUCCESS');
                context.commit('SET_TRANSACTION', response.data.response.transaction);
                console.log(response.data.response);
                resolve(response);
            }).catch(error => {
                context.commit('ERROR', error.response.data.errors);
                reject(error);
            });
        })
    },


    async transaction({commit, dispatch}, payload) {
        let vm = this;
        return new Promise((resolve, reject) => {
            vm.$axios.post('transaction', payload).then(response => {
                let data = {
                    outlet_uuid: payload.outlet_uuid,
                    filter: false
                };
                dispatch('fetch', data);
                commit('CLEARCART');
                console.log(response.data.response);
                resolve(response);
            }).catch(error => {
                commit('ERROR', error.response.data.errors);
                reject(error);
            });
        })
    },

    async edit({commit, dispatch}, payload) {
        let vm = this;
        let query = 'product/'+payload.prod_uuid;
        return new Promise((resolve, reject) => {
            vm.$axios.put(query, payload).then(response => {
                let data = {
                    outlet_uuid: payload.outlet_uuid,
                    filter: false
                };
                dispatch('get', payload);
                dispatch('fetch', data);
                console.log(response.data.response);
                resolve(response);
            }).catch(error => {
                commit('ERROR', error.response.data.errors);
                reject(error);
            });
        })
    },

}
