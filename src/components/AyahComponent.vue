<template>
	<div class="relative inline-block w-full text-center hover:bg-gray-100" @click="clearActiveIndices">
	  <div class="flex flex-row-reverse items-center flex-wrap" @click.stop>
		<span
		  v-for="(word, index) in ayah.words"
		  :key="index"
		  :class="['word-wrapper', 'group', 'inline-block', 'relative', 'cursor-pointer', 'mx-1', { 'active': clickedIndices.includes(index) }]"
		  @mouseover="showTooltip(index)"
		  @mouseleave="hideTooltip(index)"
		  @click="addClickedWord(index)"
		>
		  <span class="arabic">{{ word.arabic }}</span>
		  <span class="block mt-1 text-sm translation">{{ word.urdu }}</span>
		  <span class="tooltip" :class="{ 'show': activeIndices.includes(index) }">
			{{ word.urdu }}
			<span class="arrow"></span>
		  </span>
		</span>
		<span class="text-gray-500 text-xl -mt-2" v-if="ayah.words.length > 0">۞</span>
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
		if (!this.activeIndices.includes(index)) {
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
  
	  addClickedWord(index) {
		if (!this.clickedIndices.includes(index)) {
		  this.clickedIndices.push(index);
		} else {
		  const alreadyClicked = this.clickedIndices.indexOf(index);
		  this.clickedIndices.splice(alreadyClicked, 1);
		}
	  }
	}
  };
  </script>
  
  <style scoped>
  .tooltip {
	position: absolute;
	left: 50%;
	bottom: 4.5rem;
	transform: translateX(-50%);
	margin-bottom: 10px;
	background: #ffffff;
	color: #000000;
	font-size: 18px;
	border-radius: 8px;
	padding: 4px 12px;
	z-index: 99;
	width: 200px;
	box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
	opacity: 0;
	transition: opacity 0.3s ease-in-out;
	text-align: center;
	pointer-events: none;
	border: 2px solid #03a9f4;
  }
  
  .word-wrapper {
	position: relative;
	display: inline-block;
	cursor: pointer;
	padding: 8px 4px;
	text-align: center;
	transition: color 0.3s ease;
  }
  
  .word-wrapper:hover .arabic {
	color: #03a9f4;
  }
  
  .word-wrapper.active .arabic {
	color: #f43b03;
  }
  
  .word-wrapper.active .translation {
	color: #f43b03 !important;
	border-top: 1px solid black !important;
  }
  
  .translation {
	color: #ffffff;
	border-top: 1px solid white;
  }
  
  .relative.inline-block.w-full.text-center:hover .translation {
	color: #f5f5f5; /* Equivalent to gray-100 */
	border-top: 1px solid #f5f5f5; /* Equivalent to gray-100 */
  }
  
  ::v-deep .arabic {
	display: block;
	font-size: 30px;
	font-weight: 500;
	color: #333;
	font-family: Arabic !important;
  }
  
  .tooltip.show {
	opacity: 1;
	pointer-events: auto;
  }
  
  .arrow {
	position: absolute;
	width: 10px;
	height: 10px;
	background: #ffffff;
	transform: rotate(45deg);
	bottom: -4px;
	left: 50%;
	transform: translateX(-50%) rotate(45deg);
	border-bottom: 2px solid #03a9f4;
	border-right: 2px solid #03a9f4;
  }
  </style>
  