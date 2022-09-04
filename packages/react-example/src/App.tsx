import { defineStore } from '@rx-free/react';

const store = defineStore<{ count: number }, { countPlus10: number }>('store', {
  initialState: { count: 1 },
  getters: {
    countPlus10: {
      getter(st) {
        return st.count + 10;
      }
    }
  }
});

function App() {
  const { count, countPlus10 } = store.useStore();
  return (
    <div className="App">
      <div>count: {count}</div>
      <div>countPlus10: {countPlus10}</div>
      <button
        onClick={() => {
          store.setStore((st) => {
            st.count++;
          });
        }}
      >
        inc
      </button>
    </div>
  );
}

export default App;
