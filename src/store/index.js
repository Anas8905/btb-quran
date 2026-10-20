import { createStore } from 'vuex'

export default createStore({
  state: {
    slateWord: null // word sent from Quran view to Teaching Slate
  },
  mutations: {
    setSlateWord(state, word) {
      state.slateWord = word;
    },
    clearSlateWord(state) {
      state.slateWord = null;
    }
  }
})
