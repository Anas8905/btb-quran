<template>
	<div class="ayah-wrapper" dir="rtl">
	  <div class="flex flex-wrap leading-loose items-baseline justify-start" :style="{ gap: (spacing * 12) + 'px' }">
		<span
		  v-for="(word, index) in ayah.words"
		  :key="index"
		  :class="['word-item', 'group', 'relative', 'cursor-pointer', { 
		    'is-active': clickedIndices.includes(index),
		    'is-highlighted': highlightMode && clickedIndices.includes(index),
		    'dark-mode': darkTheme
		  }]"
		  @mouseover="showTooltip(index)"
		  @mouseleave="hideTooltip(index)"
		  @click="handleWordClick(index, word)"
		>
		  <!-- Arabic Text -->
		  <span :class="['arabic-text', { 'dark': darkTheme }]" :style="{ fontSize: fontSize + 'px' }">{{ word.arabic }}</span>
		  
		  <!-- Translation (visible on active or show all) -->
		  <span v-if="clickedIndices.includes(index) || showAllTranslations" :class="['urdu-translation', { 'dark': darkTheme }]" :style="{ fontSize: Math.round(fontSize * 0.5) + 'px' }">
			{{ word.urdu }}
		  </span>

		  <!-- Tooltip (Hover State) -->
		  <span :class="['word-tooltip', { 'show': activeIndices.includes(index) && !clickedIndices.includes(index) && !showAllTranslations }]" :style="{ fontSize: Math.round(fontSize * 0.45) + 'px' }">
			<span class="tooltip-content">{{ word.urdu }}</span>
		  </span>

		  <!-- Active Indicator -->
		  <span v-if="clickedIndices.includes(index)" class="active-indicator"></span>
		  
		  <!-- Hover Ring -->
		  <span class="hover-ring"></span>
		</span>
	  </div>
	</div>
</template>
  
<script>
export default {
  name: 'AyahComponent',

  props: {
    ayah: {
      type: Object,
      required: true
    },
    fontSize: {
      type: Number,
      default: 38
    },
    spacing: {
      type: Number,
      default: 1
    },
    highlightMode: {
      type: Boolean,
      default: false
    },
    showAllTranslations: {
      type: Boolean,
      default: false
    },
    darkTheme: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      activeIndices: [],
      clickedIndices: []
    };
  },

  methods: {
    showTooltip(index) {
      if (!this.activeIndices.includes(index) && !this.clickedIndices.includes(index)) {
        this.activeIndices.push(index);
      }
    },

    hideTooltip(index) {
      const activeIndex = this.activeIndices.indexOf(index);
      if (activeIndex !== -1) {
        this.activeIndices.splice(activeIndex, 1);
      }
    },

    clearActiveIndices() {
      this.activeIndices = [];
    },

    handleWordClick(index, word) {
      // Toggle Urdu translation visibility
      if (!this.clickedIndices.includes(index)) {
        this.clickedIndices.push(index);
      } else {
        const alreadyClicked = this.clickedIndices.indexOf(index);
        this.clickedIndices.splice(alreadyClicked, 1);
      }
      // Also open the word detail panel
      this.$emit('word-selected', word);
    },

    clearAllClicks() {
      this.clickedIndices = [];
    }
  }
};
</script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap');

.ayah-wrapper {
  width: 100%;
}

.word-item {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 14px;
  border-radius: 10px;
  transition: all 0.25s ease;
  background: transparent;
  border: 1.5px solid transparent;
}

.word-item:hover {
  background: rgba(16, 185, 129, 0.06);
  border-color: rgba(16, 185, 129, 0.18);
}

.word-item.is-active {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.35);
}

.word-item.is-highlighted {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.25), rgba(245, 158, 11, 0.25));
  border-color: rgba(251, 191, 36, 0.6);
  animation: highlightPulse 1.5s ease-in-out infinite;
}

@keyframes highlightPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(251, 191, 36, 0);
  }
}

.hover-ring {
  display: none;
}

.word-item.dark-mode {
  border-color: rgba(71, 85, 105, 0.3);
}

.word-item.dark-mode:hover {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(20, 184, 166, 0.15));
  border-color: rgba(16, 185, 129, 0.3);
}

.arabic-text {
  display: block;
  font-family: 'Amiri Quran', 'Noto Sans Arabic', serif;
  font-weight: 500;
  color: #1a1a2e;
  line-height: 1.8;
  transition: all 0.25s ease;
  text-align: center;
}

.arabic-text.dark {
  color: #e2e8f0;
}

.word-item:hover .arabic-text {
  color: #065f46;
}

.word-item:hover .arabic-text.dark {
  color: #6ee7b7;
}

.word-item.is-active .arabic-text {
  color: #065f46;
  font-weight: 600;
}

.word-item.is-active .arabic-text.dark {
  color: #34d399;
}

.urdu-translation {
  display: block;
  font-family: 'Noto Nastaliq Urdu', serif;
  /* font-size set via inline style — scales with Arabic fontSize */
  font-weight: 600;
  color: #047857;
  margin-top: 6px;
  text-align: center;
  padding: 4px 8px;
  animation: fadeInUp 0.25s ease;
}

.urdu-translation.dark {
  color: #6ee7b7;
}

.word-tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(0px);
  background: linear-gradient(135deg, #1f2937, #374151);
  color: white;
  font-family: 'Noto Nastaliq Urdu', serif;
  /* font-size set via inline style — scales with Arabic fontSize */
  font-weight: 600;
  padding: 12px 20px; /* Increased from 10px 16px */
  border-radius: 10px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border: 1.5px solid rgba(16, 185, 129, 0.3);
}

.word-tooltip::before {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #1f2937;
}

.word-tooltip.show {
  opacity: 1;
  transform: translateX(-50%) translateY(-6px);
}

.tooltip-content {
  position: relative;
  z-index: 1;
}

.active-indicator {
  position: absolute;
  bottom: 1px;
  left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 3px;
  background: linear-gradient(90deg, #10b981, #14b8a6);
  border-radius: 2px;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 28px;
    opacity: 1;
  }
}
</style>
