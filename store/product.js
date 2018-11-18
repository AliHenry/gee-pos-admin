export const state = () => ({
    cart: [],
    products: [],
    search: [],
    product: {
        name: '',
        description: '',
        category: {
            name: ''
        },
        quantity: '',
        price: '',
        hide: '',
        sold_quantity: 0,
        sold_amount: 0.00,
        pro_likes: 0
    },
    status: {
        loading: false,
        success: false,
        error: false
    },
});

export const getters = {
    get(state) {
        return state.products
    },
    getSearch(state) {
        return state.search
    },
    getProduct(state) {
        return state.product
    },
    getStatus(state){
        return state.status;
    },
    getCart(state) {
        return state.cart
    },
    cartProduct(state){
        return state.cart.map(cartItem => {
            let product = state.products.find(product => product.prod_uuid === cartItem.prod_uuid)
            return {
                prod_uuid: product.prod_uuid,
                name: product.name,
                quantity: cartItem.quantity,
                price: product.price * cartItem.quantity,
                unitPrice: product.price
            }
        })
    },
    cartTotal(state, getter){
        return getter.cartProduct.reduce((total, product) => total += product.unitPrice * product.quantity, 0)
    },

    cartTotalQty(state, getter){
        return getter.cartProduct.reduce((total, product) => total += product.quantity, 0)
    }

};

export const mutations = {
    SET(state, products) {
        state.products = products
    },
    SETSEARCH(state, products) {
        state.search = products
    },
    SET_PRODUCT(state, product) {
        state.product = product;
    },
    PUSHCART(state, prod_uuid) {
        state.cart.push({
            prod_uuid: prod_uuid,
            quantity: 1,
        });
    },
    INCREMENTQTY(state, cartItem) {
        cartItem.quantity++
    },
    DECREMENTQTY(state, cartProd) {
        cartProd.quantity--
    },
    REMOVE(state, cartProd) {
        let cart = state.cart
        cart.splice(cart.indexOf(cartProd), 1)
    },
    EMPTY(state) {
        state.search = [];
    },
    CLEARCART(state) {
        state.cart = [];
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
            query = 'product?outlet_uuid='+payload.outlet_uuid+'&search='+payload.search
        } else {
            query = 'product?outlet_uuid='+payload.outlet_uuid
        }
        return new Promise((resolve, reject) => {
            context.commit('LOADING');
            vm.$axios.get(query).then(response => {
                context.commit('SUCCESS');
                context.commit('SET', response.data.response.products);
                console.log(response.data.response);
                resolve(response);
            }).catch(error => {
                context.commit('ERROR', error.response.data.errors);
                reject(error);
            });
        })
    },

    async search(context, payload) {
        let vm = this;
        let query = '';
        if (payload.filter){
            query = 'product?outlet_uuid='+payload.outlet_uuid+'&search='+payload.search
        } else {
            query = 'product?outlet_uuid='+payload.outlet_uuid
        }
        return new Promise((resolve, reject) => {
            context.commit('LOADING');
            vm.$axios.get(query).then(response => {
                context.commit('SUCCESS');
                context.commit('SETSEARCH', response.data.response.products);
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
            vm.$axios.post('product', payload).then(response => {
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
        let query = 'product/'+payload.prod_uuid+'?outlet_uuid='+payload.outlet_uuid
        return new Promise((resolve, reject) => {
            context.commit('LOADING');
            vm.$axios.get(query).then(response => {
                context.commit('SUCCESS');
                context.commit('SET_PRODUCT', response.data.response.product);
                console.log(response.data.response);
                resolve(response);
            }).catch(error => {
                context.commit('ERROR', error.response.data.errors);
                reject(error);
            });
        })
    },

    async addCart(context, product) {
        let vm = this;

        if(product.quantity > 0){
            let cartItem = context.state.cart.find(item => item.prod_uuid === product.prod_uuid);
            if (!cartItem){
                context.commit('PUSHCART', product.prod_uuid);
            } else{
                context.commit('INCREMENTQTY', cartItem);
            }
        }
    },

    async increase(context, cart) {
        let vm = this;
        if (cart.quantity > 0) {
            let cartItem = context.state.cart.find(item => item.prod_uuid === cart.prod_uuid);
            if (cartItem){
                let product = context.state.products.find(item => item.prod_uuid === cart.prod_uuid);
                if (cartItem.quantity < product.quantity) {
                    context.commit('INCREMENTQTY', cartItem);
                }
            }
        }
    },

    async decrease(context, cart) {
        let vm = this;
        if (cart.quantity > 0){
            let cartItem = context.state.cart.find(item => item.prod_uuid === cart.prod_uuid);
            if (cartItem){
                context.commit('DECREMENTQTY', cartItem);
            }
        }
    },

    async remove(context, cart) {
        let vm = this;
        if (cart.quantity > 0){
            let cartItem = context.state.cart.find(item => item.prod_uuid === cart.prod_uuid);
            if (cartItem){
                context.commit('REMOVE', cartItem);
            }
        }
    },

    async emptySearch(context) {
        context.commit('EMPTY');
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
