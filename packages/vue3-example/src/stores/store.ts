import { defineStore } from '@rx-free/vue';

const store = defineStore<{ count: number }, { countPlus10: number }>('AppStore', {
  initialState: { count: 1 },
  getters: {
    countPlus10: {
      getter(st) {
        return st.count + 10;
      }
    }
  }
});

export default store;
