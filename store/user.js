export const state = () => ({
    users: [],
    user: {
        name: '',
        email: '',
        role_id: '',
        role_name: ''
    },
    roles: [],
    status: {
        loading: false,
        success: false,
        error: false
    },
});

export const getters = {
    get(state) {
        return state.users
    },
    getUser(state) {
        return state.user
    },
    getRole(state) {
        return state.roles
    },
    getStatus(state){
        return state.status;
    },
};

export const mutations = {
    SET(state, users) {
        state.users = users
    },
    SET_USER(state, user) {
        state.user = user
    },
    SETROLE(state, roles) {
        state.roles = roles
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
    CLEARERROR(state, error) {
        state.status = {
            loading: false,
            success: false,
            error: false
        }
    },
};

export const actions = {
    async fetch(context, payload) {
        let vm = this;
        let query = '';
        if (payload.filter){
            query = 'user?outlet_uuid='+payload.outlet_uuid+'&search='+payload.search
        } else {
            query = 'user?outlet_uuid='+payload.outlet_uuid
        }
        return new Promise((resolve, reject) => {
            context.commit('LOADING');
            vm.$axios.get(query).then(response => {
                context.commit('SUCCESS');
                context.commit('SET', response.data.response.users);
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
        let query = 'user/'+payload.user_id+'?outlet_uuid='+payload.outlet_uuid;
        return new Promise((resolve, reject) => {
            context.commit('LOADING');
            vm.$axios.get(query).then(response => {
                context.commit('SUCCESS');
                context.commit('SET_USER', response.data.response.user);
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
            vm.$axios.post('user', payload).then(response => {
                let data = {
                    outlet_uuid: payload.outlet_uuid,
                    filter: false
                };
                dispatch('fetch', data);
                console.log(response.data.response);
                resolve(response);
            }).catch(error => {
                commit('ERROR', error.response.data.error);
                reject(error);
            });
        })
    },

    async fetchRoles(context) {
        let vm = this;
        let query = '';
        return new Promise((resolve, reject) => {
            context.commit('LOADING');
            vm.$axios.get('role').then(response => {
                context.commit('SUCCESS');
                context.commit('SETROLE', response.data);
                console.log(response.data);
                resolve(response);
            }).catch(error => {
                context.commit('ERROR', error.response.data.errors);
                reject(error);
            });
        })
    },
    clearError({commit}){
        commit('CLEARERROR');
    }
};
