import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = () => new Vuex.Store({
    state: {
        isBlogEdit: false,
        user: null
    },
    getters: {
        getLocalStorage: function(state){
            if(!state.user){
                state.user = JSON.parse(sessionStorage.getItem('user'));
            }

            return state.user;
        }
    },

    mutations: {
        changeBlogEditState (state) {
            state.isBlogEdit = !state.isBlogEdit;
        },
        cancelBlogEditState (state) {
            state.isBlogEdit = false;
        },

        $_setStorage(state, value){
            state.user = value;
            sessionStorage.setItem('user', JSON.stringify(value));
        },

        $_removeStorage(state){
            state.user = null;
            sessionStorage.removeItem('user');
        }
    },
    actions: { //通过dispatch访问
        //实现异步提交mutations
        changeBlogEditState ({ commit }) {
            commit("changeBlogEditState", true);
        },
        cancelBlogEditState ({ commit }) {
            commit("cancelBlogEditState", true);
        },

        // $_setStorage(state, value){
        //     commit("$_setStorage", true);
        // },

        // $_removeStorage(state){
        //     commit("$_removeStorage", true);
        // }
    }
});

export default store;