export const state = () => ({
    categories: [],
    category: {
        name: '',
        description: '',
        parent: {
            name: '',
        }
    },
    status: {
        loading: false,
        success: false,
        error: false
    },
});

export const getters = {
    get(state) {
        return state.categories
    },
    getCategory(state) {
        return state.category
    },
    getStatus(state){
        return state.status;
    }

};

export const mutations = {
    SET(state, categories) {
        state.categories = categories
    },
    SET_CATEGORY(state, category) {
        state.category = category;
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
        if (payload.filter){
            query = 'category?outlet_uuid='+payload.outlet_uuid+'&search='+payload.search
        } else {
            query = 'category?outlet_uuid='+payload.outlet_uuid
        }
        console.log(query)
        return new Promise((resolve, reject) => {
            context.commit('LOADING');
            vm.$axios.get(query).then(response => {
                context.commit('SUCCESS');
                context.commit('SET', response.data.response.categories);
                console.log(response.data.response);
                resolve(response);
            }).catch(error => {
                context.commit('ERROR', error.response.data.errors);
                reject(error);
            });
        })
    },

    async add({commit, dispatch}, payload) {
        let vm = this;
        return new Promise((resolve, reject) => {
            vm.$axios.post('category', payload).then(response => {
                let data = {
                    outlet_uuid: payload.outlet_uuid,
                    filter: false
                };
                dispatch('fetch', data);
                console.log(response.data.response);
                resolve(response);
            }).catch(error => {
                commit('ERROR', error.response.data.errors);
                reject(error);
            });
        })
    },

    async get(context, payload) {
        let vm = this;
        let query = 'category/'+payload.cate_uuid+'?outlet_uuid='+payload.outlet_uuid;
        return new Promise((resolve, reject) => {
            context.commit('LOADING');
            vm.$axios.get(query).then(response => {
                context.commit('SUCCESS');
                context.commit('SET_CATEGORY', response.data.response.category);
                console.log(response.data.response);
                resolve(response);
            }).catch(error => {
                context.commit('ERROR', error.response.data.errors);
                reject(error);
            });
        })
    },

    async edit({commit, dispatch}, payload) {
        let vm = this;
        let query = 'category/'+payload.cate_uuid;
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
