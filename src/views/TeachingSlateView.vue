<template>
	<div class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center relative overflow-hidden">
		<!-- Main Slate Container - Full Screen -->
		<div :class="['slate-container', { 'dark': darkTheme }]">
			<!-- Top Controls - Compact -->
			<div class="top-controls">
				<button @click="goBack" class="control-btn control-btn-back">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
						<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
					</svg>
				</button>
				<button @click="toggleTheme" class="control-btn">
					<svg v-if="!darkTheme" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
					</svg>
					<svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
					</svg>
				</button>
			</div>

			<!-- Header -->
			<div :class="['slate-header', { 'dark': darkTheme }]">
			</div>

			<!-- Toolbar -->
			<div :class="['toolbar', { 'dark': darkTheme }]">
				<!-- Text Input -->
				<div class="toolbar-group toolbar-group-input">
					<input 
						ref="wordInput"
						v-model="currentInput"
						@keydown.enter="createWordBlock"
						style="direction: rtl;"
						placeholder="لفظ..."
						class="toolbar-input"
					/>
				</div>

				<div class="toolbar-divider"></div>

				<!-- Block Color -->
				<div class="toolbar-group toolbar-group-bordered">
					<span class="toolbar-label">Block Color</span>
					<div class="color-palette-compact">
						<button @click="currentColor = '#10b981'" :class="['color-btn-sm', { 'active': currentColor === '#10b981' }]" style="background: #10b981;"></button>
						<button @click="currentColor = '#ef4444'" :class="['color-btn-sm', { 'active': currentColor === '#ef4444' }]" style="background: #ef4444;"></button>
						<button @click="currentColor = '#3b82f6'" :class="['color-btn-sm', { 'active': currentColor === '#3b82f6' }]" style="background: #3b82f6;"></button>
						<button @click="currentColor = '#f59e0b'" :class="['color-btn-sm', { 'active': currentColor === '#f59e0b' }]" style="background: #f59e0b;"></button>
						<button @click="currentColor = '#8b5cf6'" :class="['color-btn-sm', { 'active': currentColor === '#8b5cf6' }]" style="background: #8b5cf6;"></button>
						<button @click="currentColor = '#ec4899'" :class="['color-btn-sm', { 'active': currentColor === '#ec4899' }]" style="background: #ec4899;"></button>
					</div>
				</div>

				<div class="toolbar-divider"></div>

				<!-- Line Mode -->
				<div class="toolbar-group toolbar-group-bordered">
					<span class="toolbar-label">Connect</span>
					<button @click="toggleLineMode" :class="['toolbar-btn', 'toolbar-btn-sm', { 'active': lineMode }]">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
						</svg>
					</button>
					<select v-model="lineColor" class="toolbar-select toolbar-select-sm">
						<option value="#10b981">Green</option>
						<option value="#ef4444">Red</option>
						<option value="#3b82f6">Blue</option>
						<option value="#f59e0b">Orange</option>
						<option value="#8b5cf6">Purple</option>
						<option value="#1e293b">Black</option>
					</select>
				</div>

				<div class="toolbar-divider"></div>

				<!-- Drawing Mode -->
				<div class="toolbar-group toolbar-group-bordered">
					<span class="toolbar-label">Draw</span>
					<button @click="toggleDrawMode" :class="['toolbar-btn', 'toolbar-btn-sm', { 'active': drawMode }]">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
							<path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
						</svg>
					</button>
					<button @click="toggleStraightLineMode" :class="['toolbar-btn', 'toolbar-btn-sm', { 'active': straightLineMode }]" title="Straight Line">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 19L19 5" />
						</svg>
					</button>
					<button @click="toggleStraightArrowMode" :class="['toolbar-btn', 'toolbar-btn-sm', { 'active': straightArrowMode }]" title="Straight Arrow">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
							<path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
						</svg>
					</button>
					<select v-model="drawColor" class="toolbar-select toolbar-select-sm">
						<option value="#10b981">Green</option>
						<option value="#ef4444">Red</option>
						<option value="#3b82f6">Blue</option>
						<option value="#f59e0b">Orange</option>
						<option value="#8b5cf6">Purple</option>
						<option value="#1e293b">Black</option>
						<option value="#ffffff">White</option>
					</select>
					<input 
						v-if="drawMode || straightLineMode || straightArrowMode" 
						type="range" 
						v-model="drawWidth" 
						min="2" 
						max="20" 
						class="draw-slider"
					/>
					<span v-if="drawMode || straightLineMode || straightArrowMode" class="toolbar-value-sm">{{ drawWidth }}px</span>
				</div>

				<div class="toolbar-divider"></div>

				<!-- Action Buttons -->
				<div class="toolbar-group toolbar-group-actions">
					<!-- Delete Selected -->
					<button v-if="selectedBlock" @click="deleteSelectedBlock" class="toolbar-btn toolbar-btn-sm toolbar-btn-danger" title="Delete selected">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
							<path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
						</svg>
					</button>

					<!-- Clear Lines -->
					<button v-if="lines.length > 0" @click="clearLines" class="toolbar-btn toolbar-btn-sm" title="Clear connections">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
						</svg>
					</button>

					<!-- Clear Drawings -->
					<button v-if="drawings.length > 0" @click="clearDrawings" class="toolbar-btn toolbar-btn-sm" title="Clear drawings">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
							<path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
						</svg>
					</button>

					<!-- Clear All -->
					<button @click="clearSlate" class="clear-btn clear-btn-compact">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
						</svg>
					</button>
				</div>
			</div>

			<!-- Canvas Area -->
			<div 
				ref="canvasArea"
				:class="['canvas-area', { 'dark': darkTheme, 'drawing-mode': drawMode || straightLineMode || straightArrowMode }]"
				@click="deselectBlock"
				@mousedown="handleCanvasMouseDown"
				@mousemove="handleCanvasMouseMove"
				@mouseup="handleCanvasMouseUp"
				@mouseleave="handleCanvasMouseUp"
			>
				<!-- SVG Layer for Lines and Drawings -->
				<svg class="line-layer" ref="svgLayer">
					<!-- Connection Lines -->
					<line 
						v-for="(line, index) in lines" 
						:key="'line-' + index"
						:x1="line.x1"
						:y1="line.y1"
						:x2="line.x2"
						:y2="line.y2"
						:stroke="line.color"
						stroke-width="3"
						stroke-linecap="round"
						class="connection-line"
					/>

					<!-- Drawings -->
					<path
						v-for="(drawing, index) in drawings"
						:key="'drawing-' + index"
						:d="drawing.path"
						:stroke="drawing.color"
						:stroke-width="drawing.width"
						stroke-linecap="round"
						stroke-linejoin="round"
						fill="none"
						class="drawing-path"
					/>

					<!-- Current Drawing Path -->
					<path
						v-if="currentPath"
						:d="currentPath"
						:stroke="drawColor"
						:stroke-width="drawWidth"
						stroke-linecap="round"
						stroke-linejoin="round"
						fill="none"
						class="drawing-path current-path"
					/>
				</svg>

				<!-- Word Blocks -->
				<div 
					v-for="block in wordBlocks" 
					:key="block.id"
					:class="['word-block', { 'selected': selectedBlock === block.id, 'dark': darkTheme, 'connecting': lineMode && lineStartBlock === block.id }]"
					:style="{
						left: block.x + 'px',
						top: block.y + 'px',
						fontSize: block.size + 'px',
						background: block.color,
						width: block.width + 'px',
						direction: 'rtl'
					}"
					@mousedown.stop="lineMode ? startConnection(block, $event) : startDrag(block, $event)"
					@click.stop="lineMode ? endConnection(block) : selectBlock(block.id)"
					@dblclick.stop="toggleColorPicker(block.id)"
				>
					<div class="word-content">{{ block.text }}</div>
					
					<!-- Resize Handles -->
					<div 
						v-if="selectedBlock === block.id && !lineMode"
						class="resize-handles"
					>
						<div class="resize-handle resize-nw" @mousedown.stop="startResize(block, 'nw', $event)"></div>
						<div class="resize-handle resize-ne" @mousedown.stop="startResize(block, 'ne', $event)"></div>
						<div class="resize-handle resize-sw" @mousedown.stop="startResize(block, 'sw', $event)"></div>
						<div class="resize-handle resize-se" @mousedown.stop="startResize(block, 'se', $event)"></div>
					</div>

					<!-- Color Change on Double Click -->
					<div v-if="showColorPicker === block.id" class="block-color-picker">
						<button 
							v-for="color in colorPalette" 
							:key="color"
							@click.stop="changeBlockColor(block.id, color)"
							:style="{ background: color }"
							class="color-option"
						></button>
					</div>

					<!-- Connection Indicator -->
					<div v-if="lineMode" class="connection-dot"></div>
				</div>
			</div>
		</div>

		<!-- Face Cam Safe Zone Indicator (Bottom-Left) -->
		<div class="absolute bottom-0 left-0 w-[300px] h-[200px] z-40 pointer-events-none border-2 border-dashed border-emerald-300/30 rounded-tr-2xl bg-emerald-50/5">
		</div>

		<!-- Decorative Islamic Pattern Background -->
		<div class="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-5">
			<div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2310b981\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
		</div>

		<!-- Decorative Gradient Blobs -->
		<div class="absolute inset-0 pointer-events-none overflow-hidden -z-10">
			<div class="absolute top-0 left-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
			<div class="absolute top-0 right-0 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
			<div class="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'TeachingSlateView',
	data() {
		return {
			currentInput: '',
			textSize: 32,
			darkTheme: false,
			currentColor: '#10b981',
			wordBlocks: [],
			selectedBlock: null,
			showColorPicker: false,
			draggingBlock: null,
			resizingBlock: null,
			resizeDirection: null,
			dragStartX: 0,
			dragStartY: 0,
			blockStartX: 0,
			blockStartY: 0,
			blockStartWidth: 0,
			blockStartHeight: 0,
			blockStartSize: 0,
			nextId: 1,
			colorPalette: ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'],
			lineMode: false,
			lineStartBlock: null,
			lineColor: '#10b981',
			lines: [],
			connections: [],
			// Drawing state
			drawMode: false,
			straightLineMode: false,
			straightArrowMode: false,
			drawColor: '#10b981',
			drawWidth: 4,
			isDrawing: false,
			currentPath: '',
			drawings: [],
			lineStartPoint: null
		};
	},
	methods: {
		goBack() {
			this.$router.push('/');
		},
		increaseTextSize() {
			if (this.textSize < 72) {
				this.textSize += 4;
			}
		},
		decreaseTextSize() {
			if (this.textSize > 16) {
				this.textSize -= 4;
			}
		},
		toggleTheme() {
			this.darkTheme = !this.darkTheme;
		},
		createWordBlock() {
			if (!this.currentInput.trim()) return;

			// Create block within visible canvas bounds
			const block = {
				id: this.nextId++,
				text: this.currentInput.trim(),
				x: 50 + Math.random() * 400,  // Keep within visible area
				y: 50 + Math.random() * 200,  // Keep within visible area
				size: this.textSize,
				color: this.currentColor,
				width: 200
			};

			this.wordBlocks.push(block);
			this.currentInput = '';
			this.$nextTick(() => {
				this.$refs.wordInput.focus();
			});
		},
		selectBlock(id) {
			if (!this.lineMode) {
				this.selectedBlock = id;
			}
		},
		deselectBlock() {
			if (!this.lineMode) {
				this.selectedBlock = null;
				this.showColorPicker = null;
			}
		},
		startDrag(block, event) {
			if (this.lineMode) return;
			
			this.draggingBlock = block;
			this.dragStartX = event.clientX;
			this.dragStartY = event.clientY;
			this.blockStartX = block.x;
			this.blockStartY = block.y;
			
			document.addEventListener('mousemove', this.onDrag);
			document.addEventListener('mouseup', this.stopDrag);
		},
		onDrag(event) {
			if (!this.draggingBlock) return;
			
			const deltaX = event.clientX - this.dragStartX;
			const deltaY = event.clientY - this.dragStartY;
			
			this.draggingBlock.x = this.blockStartX + deltaX;
			this.draggingBlock.y = this.blockStartY + deltaY;
			
			// Update line positions when dragging
			this.$nextTick(() => {
				this.updateLines();
			});
		},
		stopDrag() {
			this.draggingBlock = null;
			document.removeEventListener('mousemove', this.onDrag);
			document.removeEventListener('mouseup', this.stopDrag);
		},
		startResize(block, direction, event) {
			this.resizingBlock = block;
			this.resizeDirection = direction;
			this.dragStartX = event.clientX;
			this.dragStartY = event.clientY;
			this.blockStartX = block.x;
			this.blockStartY = block.y;
			this.blockStartWidth = block.width;
			this.blockStartSize = block.size;
			
			document.addEventListener('mousemove', this.onResize);
			document.addEventListener('mouseup', this.stopResize);
		},
		onResize(event) {
			if (!this.resizingBlock) return;
			
			const deltaX = event.clientX - this.dragStartX;
			const deltaY = event.clientY - this.dragStartY;
			
			let newWidth = this.blockStartWidth;
			let newSize = this.blockStartSize;
			let newX = this.blockStartX;
			let newY = this.blockStartY;
			
			// Handle horizontal resizing
			if (this.resizeDirection.includes('e')) {
				// Resize from right edge
				newWidth = Math.max(100, this.blockStartWidth + deltaX);
			} else if (this.resizeDirection.includes('w')) {
				// Resize from left edge
				const widthChange = -deltaX;
				newWidth = Math.max(100, this.blockStartWidth + widthChange);
				if (newWidth > 100) {
					newX = this.blockStartX - widthChange;
				}
			}
			
			// Handle vertical resizing (affects font size)
			if (this.resizeDirection.includes('s')) {
				// Resize from bottom
				newSize = Math.max(16, Math.min(72, this.blockStartSize + deltaY / 3));
			} else if (this.resizeDirection.includes('n')) {
				// Resize from top
				const sizeChange = -deltaY / 3;
				newSize = Math.max(16, Math.min(72, this.blockStartSize + sizeChange));
				if (newSize >= 16 && newSize <= 72) {
					newY = this.blockStartY - sizeChange * 1.5;
				}
			}
			
			// Apply changes
			this.resizingBlock.width = newWidth;
			this.resizingBlock.size = newSize;
			this.resizingBlock.x = newX;
			this.resizingBlock.y = newY;
			
			// Update lines when resizing
			this.$nextTick(() => {
				this.updateLines();
			});
		},
		stopResize() {
			this.resizingBlock = null;
			this.resizeDirection = null;
			document.removeEventListener('mousemove', this.onResize);
			document.removeEventListener('mouseup', this.stopResize);
		},
		toggleColorPicker(id) {
			this.showColorPicker = this.showColorPicker === id ? null : id;
		},
		changeBlockColor(id, color) {
			const block = this.wordBlocks.find(b => b.id === id);
			if (block) {
				block.color = color;
			}
			this.showColorPicker = null;
		},
		deleteSelectedBlock() {
			if (this.selectedBlock) {
				// Remove connections involving this block
				this.connections = this.connections.filter(
					conn => conn.from !== this.selectedBlock && conn.to !== this.selectedBlock
				);
				
				this.wordBlocks = this.wordBlocks.filter(b => b.id !== this.selectedBlock);
				this.selectedBlock = null;
				this.updateLines();
			}
		},
		clearSlate() {
            this.wordBlocks = [];
            this.selectedBlock = null;
            this.currentInput = '';
            this.lines = [];
            this.connections = [];
            this.drawings = [];
            this.currentPath = '';
		},
		toggleLineMode() {
			this.lineMode = !this.lineMode;
			this.lineStartBlock = null;
			this.drawMode = false;
			this.straightLineMode = false;
			this.straightArrowMode = false;
			if (this.lineMode) {
				this.selectedBlock = null;
			}
		},
		startConnection(block, event) {
			if (!this.lineMode) return;
			
			event.preventDefault();
			event.stopPropagation();
			
			// If no start block, set this as start
			if (!this.lineStartBlock) {
				this.lineStartBlock = block.id;
			} else {
				// This is the end block, create connection
				this.endConnection(block);
			}
		},
		endConnection(block) {
			if (!this.lineMode || !this.lineStartBlock) return;
			
			// Don't connect to self
			if (this.lineStartBlock === block.id) {
				this.lineStartBlock = null;
				return;
			}
			
			// Check if connection already exists
			const exists = this.connections.some(
				conn => (conn.from === this.lineStartBlock && conn.to === block.id) ||
				        (conn.from === block.id && conn.to === this.lineStartBlock)
			);
			
			if (!exists) {
				// Add connection
				const connection = {
					from: this.lineStartBlock,
					to: block.id,
					color: this.lineColor
				};
				
				this.connections.push(connection);
				
				// Update lines immediately
				this.$nextTick(() => {
					this.updateLines();
				});
			}
			
			// Reset for next connection, but keep line mode active
			this.lineStartBlock = null;
		},
		updateLines() {
			
			this.lines = this.connections.map(conn => {
				const fromBlock = this.wordBlocks.find(b => b.id === conn.from);
				const toBlock = this.wordBlocks.find(b => b.id === conn.to);
				
				if (!fromBlock || !toBlock) {
					console.warn('Block not found for connection:', conn);
					return null;
				}
				
				const line = {
					x1: fromBlock.x + fromBlock.width / 2,
					y1: fromBlock.y + 40,
					x2: toBlock.x + toBlock.width / 2,
					y2: toBlock.y + 40,
					color: conn.color
				};
				
				return line;
			}).filter(line => line !== null);
			
		},
		clearLines() {
			if (confirm('Are you sure you want to clear all connections?')) {
				this.lines = [];
				this.connections = [];
				this.lineStartBlock = null;
			}
		},
		toggleDrawMode() {
			this.drawMode = !this.drawMode;
			this.straightLineMode = false;
			this.straightArrowMode = false;
			this.lineMode = false;
			this.selectedBlock = null;
		},
		toggleStraightLineMode() {
			this.straightLineMode = !this.straightLineMode;
			this.drawMode = false;
			this.straightArrowMode = false;
			this.lineMode = false;
			this.selectedBlock = null;
		},
		toggleStraightArrowMode() {
			this.straightArrowMode = !this.straightArrowMode;
			this.drawMode = false;
			this.straightLineMode = false;
			this.lineMode = false;
			this.selectedBlock = null;
		},
		handleCanvasMouseDown(event) {
			if (!this.drawMode && !this.straightLineMode && !this.straightArrowMode) return;
			
			const rect = this.$refs.canvasArea.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			
			this.isDrawing = true;
			
			if (this.straightLineMode || this.straightArrowMode) {
				this.lineStartPoint = { x, y };
				this.currentPath = `M ${x} ${y} L ${x} ${y}`;
			} else {
				this.currentPath = `M ${x} ${y}`;
			}
		},
		handleCanvasMouseMove(event) {
			if ((!this.drawMode && !this.straightLineMode && !this.straightArrowMode) || !this.isDrawing) return;
			
			const rect = this.$refs.canvasArea.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			
			if ((this.straightLineMode || this.straightArrowMode) && this.lineStartPoint) {
				if (this.straightArrowMode) {
					// Create arrow with arrowhead
					const arrowPath = this.createArrowPath(this.lineStartPoint.x, this.lineStartPoint.y, x, y);
					this.currentPath = arrowPath;
				} else {
					this.currentPath = `M ${this.lineStartPoint.x} ${this.lineStartPoint.y} L ${x} ${y}`;
				}
			} else {
				this.currentPath += ` L ${x} ${y}`;
			}
		},
		handleCanvasMouseUp() {
			if ((!this.drawMode && !this.straightLineMode && !this.straightArrowMode) || !this.isDrawing) return;
			
			if (this.currentPath && this.currentPath.length > 10) {
				this.drawings.push({
					path: this.currentPath,
					color: this.drawColor,
					width: this.drawWidth
				});
			}
			
			this.isDrawing = false;
			this.currentPath = '';
			this.lineStartPoint = null;
		},
		createArrowPath(x1, y1, x2, y2) {
			// Calculate arrow line
			const dx = x2 - x1;
			const dy = y2 - y1;
			const angle = Math.atan2(dy, dx);
			
			// Arrowhead size based on line width
			const arrowLength = this.drawWidth * 3;
			
			// Calculate arrowhead points
			const arrowPoint1X = x2 - arrowLength * Math.cos(angle - Math.PI / 6);
			const arrowPoint1Y = y2 - arrowLength * Math.sin(angle - Math.PI / 6);
			const arrowPoint2X = x2 - arrowLength * Math.cos(angle + Math.PI / 6);
			const arrowPoint2Y = y2 - arrowLength * Math.sin(angle + Math.PI / 6);
			
			// Create path: line + arrowhead
			return `M ${x1} ${y1} L ${x2} ${y2} M ${arrowPoint1X} ${arrowPoint1Y} L ${x2} ${y2} L ${arrowPoint2X} ${arrowPoint2Y}`;
		},
		clearDrawings() {
			if (confirm('Are you sure you want to clear all drawings?')) {
				this.drawings = [];
				this.currentPath = '';
			}
		},
		handleKeydown(e) {
			// Cmd/Ctrl + Z => undo last drawing
			if ((e.metaKey || e.ctrlKey) && (e.key === 'z' || e.key === 'Z')) {
				e.preventDefault();
				if (this.drawings.length > 0) {
					this.drawings.pop();
				}
			}
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.$refs.wordInput.focus();
		});
		// If a word was sent from Quran view, pre-fill and create a block
		const slateWord = this.$store.state.slateWord;
		if (slateWord) {
			this.currentInput = slateWord.arabic;
			this.createWordBlock();
			// Also create a block for the Urdu translation
			if (slateWord.urdu) {
				this.currentInput = slateWord.urdu;
				this.currentColor = '#3b82f6';
				this.createWordBlock();
				this.currentColor = '#10b981';
			}
			this.$store.commit('clearSlateWord');
		}
		// register global undo (Cmd/Ctrl+Z) for drawings
		window.addEventListener('keydown', this.handleKeydown);
	},
	beforeUnmount() {
		window.removeEventListener('keydown', this.handleKeydown);
	},
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400..700&display=swap');

.back-btn {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.5rem;
	background: linear-gradient(135deg, #10b981, #14b8a6);
	color: white;
	border: none;
	border-radius: 1rem;
	cursor: pointer;
	transition: all 0.3s;
	box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
	font-weight: 600;
}

.back-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.theme-btn {
	padding: 0.75rem;
	background: white;
	color: #10b981;
	border: 2px solid #10b981;
	border-radius: 1rem;
	cursor: pointer;
	transition: all 0.3s;
	box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.theme-btn:hover {
	transform: scale(1.05);
	background: #10b981;
	color: white;
}

.slate-container {
	width: 100vw;
	height: 100vh;
	background: white;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	transition: all 0.3s;
	position: relative;
}

.slate-container.dark {
	background: #1e293b;
}

.top-controls {
	position: absolute;
	top: 0.50rem;
	left: 0.75rem;
	display: flex;
	gap: 0.5rem;
	z-index: 50;
}

.control-btn {
	width: 2rem;
	height: 2rem;
	padding: 0.35rem;
	background: transparent;
	backdrop-filter: blur(10px);
	border: 1.5px solid #10b981;
	border-radius: 0.5rem;
	cursor: pointer;
	transition: all 0.2s;
	color: #475569;
	display: flex;
	align-items: center;
	justify-content: center;
}

.slate-container.dark .control-btn {
	background: rgba(30, 41, 59, 0.95);
	border-color: #334155;
	color: #94a3b8;
}

.control-btn:hover {
	background: #10b981;
	border-color: #10b981;
	color: white;
	transform: scale(1.05);
	box-shadow: 0 3px 12px rgba(16, 185, 129, 0.3);
}

.control-btn-back {
	width: auto;
	padding: 0.35rem 0.75rem;
	gap: 0.25rem;
}

.control-btn.active {
	background: #10b981;
	border-color: #10b981;
	color: white;
}

.slate-header {
	background: linear-gradient(135deg, #10b981, #14b8a6);
	padding: 1.5rem 0.5rem;
	color: white;
	border-bottom: 3px solid #059669;
}

.header-content {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.icon-wrapper {
	width: 3rem;
	height: 3rem;
	background: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(10px);
	border-radius: 0.75rem;
	display: flex;
	align-items: center;
	justify-content: center;
}

.title {
	font-size: 2.5rem;
	font-weight: 700;
	margin: 0;
}

.subtitle {
	margin: 0.25rem 0 0 0;
	opacity: 0.9;
	font-size: 0.95rem;
}

.toolbar {
	background: #f8fafc;
	padding: 0.75rem 1.5rem;
	border-bottom: 2px solid #e2e8f0;
	display: flex;
	align-items: center;
	gap: 0.75rem;
	flex-wrap: wrap;
	min-height: 3.5rem;
}

.toolbar.dark {
	background: #0f172a;
	border-bottom-color: #334155;
}

.toolbar-group {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.toolbar-group-bordered {
	padding: 0.4rem 0.75rem;
	background: white;
	border: 1.5px solid #e2e8f0;
	border-radius: 0.5rem;
	gap: 0.5rem;
}

.toolbar.dark .toolbar-group-bordered {
	background: #1e293b;
	border-color: #334155;
}

.toolbar-group-input {
	flex: 1;
	min-width: 200px;
	max-width: 300px;
}

.toolbar-group-actions {
	margin-left: auto;
}

.toolbar-divider {
	width: 1px;
	height: 2rem;
	background: #e2e8f0;
}

.toolbar.dark .toolbar-divider {
	background: #334155;
}

.toolbar-label {
	font-weight: 600;
	font-size: 0.65rem;
	color: #64748b;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	white-space: nowrap;
}

.toolbar.dark .toolbar-label {
	color: #94a3b8;
}

.toolbar-btn {
	padding: 0.5rem;
	background: white;
	border: 2px solid #e2e8f0;
	border-radius: 0.5rem;
	cursor: pointer;
	transition: all 0.2s;
	color: #475569;
	display: flex;
	align-items: center;
	justify-content: center;
}

.toolbar-btn-sm {
	padding: 0.4rem;
	border-width: 1.5px;
	border-radius: 0.4rem;
}

.toolbar.dark .toolbar-btn {
	background: #1e293b;
	border-color: #334155;
	color: #94a3b8;
}

.toolbar-btn:hover {
	background: #10b981;
	border-color: #10b981;
	color: white;
	transform: scale(1.05);
}

.toolbar-btn.active {
	background: #10b981;
	border-color: #10b981;
	color: white;
}

.toolbar-btn-danger:hover {
	background: #ef4444;
	border-color: #ef4444;
	color: white;
}

.toolbar-value {
	min-width: 2.5rem;
	text-align: center;
	font-weight: 700;
	color: #10b981;
	font-size: 0.75rem;
}

.toolbar-value-sm {
	min-width: 2rem;
	text-align: center;
	font-weight: 600;
	color: #10b981;
	font-size: 0.7rem;
}

.clear-btn {
	padding: 0.75rem 1.5rem;
	background: linear-gradient(135deg, #ef4444, #dc2626);
	color: white;
	border: none;
	border-radius: 0.75rem;
	cursor: pointer;
	transition: all 0.3s;
	font-weight: 600;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.clear-btn-compact {
	padding: 0.5rem 1rem;
	border-radius: 0.5rem;
	font-size: 0.75rem;
	box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
}

.clear-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.clear-btn-text {
	display: none;
}

@media (min-width: 1024px) {
	.clear-btn-text {
		display: inline;
	}
}

.toolbar-input {
	width: 100%;
	padding: 0.5rem 0.75rem;
	border: 1.5px solid #e2e8f0;
	border-radius: 0.5rem;
	outline: none;
	font-family: 'Noto Nastaliq Urdu', 'Noto Sans Arabic', 'Inter', sans-serif;
	font-weight: 600;
	font-size: 0.875rem;
	background: white;
	color: #1e293b;
	transition: all 0.2s;
}

.toolbar-input:focus {
	border-color: #10b981;
	box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.toolbar-input::placeholder {
	color: #94a3b8;
	font-size: 0.8rem;
}

.toolbar.dark .toolbar-input {
	background: #1e293b;
	color: #e2e8f0;
	border-color: #334155;
}

.toolbar.dark .toolbar-input:focus {
	border-color: #059669;
	box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
}

.toolbar-select {
	padding: 0.5rem;
	border: 2px solid #e2e8f0;
	border-radius: 0.5rem;
	background: white;
	color: #1e293b;
	font-weight: 600;
	cursor: pointer;
	outline: none;
	transition: all 0.2s;
}

.toolbar-select-sm {
	padding: 0.35rem 0.5rem;
	border-width: 1.5px;
	font-size: 0.75rem;
	border-radius: 0.4rem;
}

.toolbar-select:focus {
	border-color: #10b981;
}

.toolbar.dark .toolbar-select {
	background: #1e293b;
	color: #e2e8f0;
	border-color: #334155;
}

.color-palette-compact {
	display: flex;
	gap: 0.25rem;
}

.color-btn-sm {
	width: 1.5rem;
	height: 1.5rem;
	border: 2px solid #e2e8f0;
	border-radius: 0.3rem;
	cursor: pointer;
	transition: all 0.2s;
	padding: 0;
}

.toolbar.dark .color-btn-sm {
	border-color: #334155;
}

.color-btn-sm:hover {
	transform: scale(1.15);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.color-btn-sm.active {
	border-color: #1e293b;
	border-width: 2.5px;
	transform: scale(1.05);
}

.toolbar.dark .color-btn-sm.active {
	border-color: #e2e8f0;
}

.canvas-area {
	flex: 1;
	position: relative;
	overflow: hidden;
	background: linear-gradient(to bottom, #ffffff, #f8fafc);
}

.canvas-area.dark {
	background: linear-gradient(to bottom, #1e293b, #0f172a);
}

.line-layer {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 1;
}

.connection-line {
	stroke-dasharray: 5, 5;
	animation: dash 0.5s linear infinite;
}

@keyframes dash {
	to {
		stroke-dashoffset: -10;
	}
}

.word-block {
	position: absolute;
	padding: 0.5rem 1rem 1.5rem 1rem;
	border-radius: 1rem;
	font-family: 'Noto Nastaliq Urdu', 'Noto Sans Arabic', 'Inter', sans-serif;
	font-weight: 700;
	color: white;
	cursor: move;
	user-select: none;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	transition: transform 0.2s, box-shadow 0.2s;
	min-width: 100px;
	text-align: center;
	word-wrap: break-word;
	z-index: 2;
}

.word-block:hover {
	transform: scale(1.02);
	box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
}

.word-block.selected {
	border: 2px solid #fbbf24;
}

.word-block.connecting {
	border: 3px solid #10b981;
	box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.3), 0 6px 30px rgba(0, 0, 0, 0.2);
	animation: pulse 1s infinite;
}

@keyframes pulse {
	0%, 100% {
		box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.3), 0 6px 30px rgba(0, 0, 0, 0.2);
	}
	50% {
		box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.2), 0 6px 30px rgba(0, 0, 0, 0.2);
	}
}

.connection-dot {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 12px;
	height: 12px;
	background: white;
	border: 3px solid #10b981;
	border-radius: 50%;
	box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
	z-index: 10;
}

.resize-handles {
	position: absolute;
	inset: -6px;
	pointer-events: none;
}

.resize-handle {
	position: absolute;
	width: 12px;
	height: 12px;
	background: #fbbf24;
	border: 2px solid white;
	border-radius: 50%;
	pointer-events: all;
	cursor: pointer;
}

.resize-handle:hover {
	transform: scale(1.3);
	background: #f59e0b;
}

.resize-nw {
	top: 0;
	left: 0;
	cursor: nw-resize;
}

.resize-ne {
	top: 0;
	right: 0;
	cursor: ne-resize;
}

.resize-sw {
	bottom: 0;
	left: 0;
	cursor: sw-resize;
}

.resize-se {
	bottom: 0;
	right: 0;
	cursor: se-resize;
}

.block-color-picker {
	position: absolute;
	bottom: -2.25rem;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	gap: 0.25rem;
	padding: 0.25rem;
	background: white;
	border-radius: 0.5rem;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	z-index: 10;
}

.canvas-area.dark .block-color-picker {
	background: #1e293b;
	border: 2px solid #334155;
}

.color-option {
	width: 1.25rem;
	height: 1.25rem;
	border: 2px solid white;
	border-radius: 0.3rem;
	cursor: pointer;
	transition: transform 0.2s;
}

.color-option:hover {
	transform: scale(1.15);
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.toolbar-btn-color {
	width: 2rem;
	height: 2rem;
	border: 2px solid #e2e8f0;
	border-radius: 0.5rem;
	cursor: pointer;
	transition: all 0.2s;
}

.toolbar.dark .toolbar-btn-color {
	border-color: #334155;
}

.toolbar-btn-color:hover {
	transform: scale(1.1);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.toolbar-btn-color.active {
	border-color: #1e293b;
	border-width: 3px;
	transform: scale(1.05);
}

.toolbar.dark .toolbar-btn-color.active {
	border-color: #e2e8f0;
}

.slate-footer {
	background: #f8fafc;
	padding: 1rem 2rem;
	border-top: 2px solid #e2e8f0;
	display: flex;
	align-items: center;
	gap: 2rem;
}

.slate-footer.dark {
	background: #0f172a;
	border-top-color: #334155;
}

.stat-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.875rem;
	font-weight: 600;
	color: #64748b;
}

.slate-footer.dark .stat-item {
	color: #94a3b8;
}

.stat-item svg {
	color: #10b981;
}

/* Animations */
@keyframes blob {
	0%, 100% {
		transform: translate(0, 0) scale(1);
	}
	33% {
		transform: translate(30px, -50px) scale(1.1);
	}
	66% {
		transform: translate(-20px, 20px) scale(0.9);
	}
}

.animate-blob {
	animation: blob 7s infinite;
}

.animation-delay-2000 {
	animation-delay: 2s;
}

.animation-delay-4000 {
	animation-delay: 4s;
}

/* Custom Scrollbar */
.writing-area::-webkit-scrollbar {
	width: 10px;
}

.writing-area::-webkit-scrollbar-track {
	background: #f1f5f9;
	border-radius: 10px;
}

.writing-area::-webkit-scrollbar-thumb {
	background: linear-gradient(180deg, #10b981, #14b8a6);
	border-radius: 10px;
	border: 2px solid #f1f5f9;
}

.writing-area::-webkit-scrollbar-thumb:hover {
	background: linear-gradient(180deg, #059669, #0d9488);
}

.canvas-area.drawing-mode {
	cursor: crosshair;
}

.canvas-area.drawing-mode .word-block {
	pointer-events: none;
}

.draw-slider {
	width: 60px;
	height: 4px;
	border-radius: 2px;
	background: #e2e8f0;
	outline: none;
	-webkit-appearance: none;
}

.draw-slider::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background: #10b981;
	cursor: pointer;
}

.draw-slider::-moz-range-thumb {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background: #10b981;
	cursor: pointer;
	border: none;
}

.toolbar.dark .draw-slider {
	background: #334155;
}

.drawing-path {
	pointer-events: none;
}

.current-path {
	opacity: 0.8;
}
</style>
