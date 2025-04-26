<template>
	<div class="min-h-screen bg-gradient-to-br from-sky-500 via-teal-400 to-blue-600 flex items-center justify-end px-4 sm:px-6 lg:px-8 relative overflow-hidden">
		<div class="h-[800px] w-8/12 bg-white bg-opacity-80 shadow-2xl rounded-lg p-8 border-4 border-yellow-500 z-10 overflow-auto">
			<h1 class="text-5xl font-bold text-center mb-12 text-yellow-700 border-b-2 border-yellow-500 pb-4">{{ surah.name }}</h1>
			<div class="h-[600px] hide-scrollbar overflow-y-scroll overflow-x-hidden bg-white shadow-md rounded-lg p-8 border-t-4 border-yellow-500">
				<div v-for="ayah in surah.ayahs" :key="ayah.number" class="ayah border-b border-light-gray transition-colors duration-500">
					<AyahComponent @word-selected="handleWordSelected" :ayah="ayah" />
				</div>
			</div>
		</div>
    
    <!-- animated background design -->
    <div class="absolute inset-0">
			<svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
				<defs>
					<path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
				</defs>
				<g class="parallax"> <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.3)"></use> <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.2)"></use> <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.1)"></use> <use xlink:href="#gentle-wave" x="48" y="7" fill="rgba(255,255,255,0.3)"></use></g>
			</svg>
		</div>

		<!-- word explanation component -->
		<div class="fixed top-2 left-8 h-[100%] w-full">
			<WordExplainComponent v-show="showExplanationSection" :selectedWord="selectedWord" />
		</div>
	</div>
</template>


<script>
import quranData from '@/quran-text/quran-complete.json';
import AyahComponent from '@/components/AyahComponent.vue';
import WordExplainComponent from '@/components/WordExplainComponent.vue';

export default {
  name: 'HomeView',
  components: {
    AyahComponent,
    WordExplainComponent
  },
  data() {
    return {
      surah: quranData.surahs[0], // Load the first Surah
      selectedWord: null,
      showExplanationSection: false
    };
  },

  methods: {
    handleWordSelected(word) {
      this.selectedWord = word;
      this.showExplanationSection = true;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@100..900&display=swap');

.ayah {
  transition: all 0.3s ease-in-out;
  max-width: 100%;
}

.ayah:hover {
  cursor: pointer;
}

.border-light-gray {
  border-color: #d1d5db;
}

.text-yellow-700 {
  color: #b8860b;
}

.border-yellow-500 {
  border-color: #b8860b;
}

.bg-yellow-500 {
  background-color: #b8860b;
}

/* SVG Wave Animation */
.waves {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 200px;
  min-height: 100px;
}

.parallax > use {
  animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
}

.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}

.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}

.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}

.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}

@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}

/* Hide scrollbar for Chrome, Safari, and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge, and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
