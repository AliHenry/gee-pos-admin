export const state = () => ({
    cart: [],
});

export const getters = {
    get(state) {
        return state.cart
    },
};

export const mutations = {
    PUSHCART(state, prod_uuid) {
        state.cart.push({
            prod_uuid: prod_uuid,
            quantity: 1,
        });
    },
    INCREMENTQTY(state, cartProd) {
        cartProd.quantity++
    },
    DECREMENTQTY(state, cartProd) {
        cartProd.quantity--
    },
};

export const actions = {
    async addCart(context, product) {
        let vm = this;

        if(product.quantity > 0){
            let cartItem = context.state.cart.find(item => item.prod_uuid === product.prod_uuid);
            if (!cartItem){
                context.commit('PUSHCART', product.prod_uuid);
            } else{
                context.commit('INCREMENTQTY', product);
            }
        }
    },
};
