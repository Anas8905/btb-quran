<template>
	<div class="quran-screen" @keydown="handleKeydown">
		<!-- ===== MAIN LAYOUT ===== -->
		<div class="main-layout">
			<!-- Quran Panel -->
			<div class="quran-panel">
				<!-- Unified Navbar — surah info + all controls in one strip -->
				<div class="navbar">
					<!-- Left: Surah name -->
					<div class="nav-left">
						<select @change="changeSurah" :value="currentSurahIndex" class="surah-selector">
							<option v-for="(s, i) in allSurahs" :key="i" :value="i">
								{{ i + 1 }}. {{ surahNames[i] }}
							</option>
						</select>
					</div>

					<!-- Center: Teaching controls -->
					<div class="nav-center" v-if="showToolbar">
						<button @click="decreaseFontSize" class="nav-btn">−</button>
						<span class="nav-value">{{ fontSize }}</span>
						<button @click="increaseFontSize" class="nav-btn">+</button>

						<div class="nav-sep"></div>

						<span class="nav-hint">Gap</span>
						<button @click="decreaseSpacing" class="nav-btn">−</button>
						<span class="nav-value">{{ spacing }}</span>
						<button @click="increaseSpacing" class="nav-btn">+</button>

						<div class="nav-sep"></div>

						<button @click="toggleShowAllTranslations" :class="['nav-toggle', { active: showAllTranslations }]">ترجمہ</button>
						<button @click="clearAllHighlights" class="nav-btn" title="Clear highlights">↺</button>
					</div>

					<!-- Right: Stats + slate button + toolbar toggle -->
					<div class="nav-right">
						<span class="nav-count">{{ surah.ayahs?.length }} آیات</span>
						<button @click="goToTeachingSlate" class="nav-btn" title="Teaching Slate (S)">✎</button>
						<button @click="showToolbar = !showToolbar" class="nav-btn" :title="showToolbar ? 'Hide controls (Esc)' : 'Show controls'">
							{{ showToolbar ? '✕' : '⚙' }}
						</button>
					</div>
				</div>

				<!-- Ayahs -->
				<div class="ayahs-scroll" ref="ayahsScroll">
					<div class="ayahs-inner" :style="{ gap: spacing * 12 + 'px' }">
						<div
							v-for="(ayah, idx) in surah.ayahs"
							:key="ayah.number"
							class="ayah-row"
						>
							<div class="ayah-content" dir="rtl">
								<AyahComponent
									@word-selected="handleWordSelected"
									:ayah="ayah"
									:fontSize="fontSize"
									:showAllTranslations="showAllTranslations"
									:spacing="spacing"
									:ref="`ayah-${idx}`"
								/>
							</div>
							<!-- Ayah number below the text, centered -->
							<div class="ayah-num-row">
								<span class="ayah-num">﴿{{ ayah.numberInSurah }}﴾</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Word Detail Panel (right side, away from cam) -->
			<transition name="panel-slide">
				<div v-if="showExplanationSection" class="detail-panel">
					<button @click="showExplanationSection = false" class="detail-close">✕</button>
					<div v-if="selectedWord" class="detail-content">
						<!-- The Arabic word — large & centered -->
						<div class="detail-arabic">{{ selectedWord.arabic }}</div>
						<!-- Urdu meaning -->
						<div class="detail-urdu">{{ selectedWord.urdu }}</div>
						<!-- Divider -->
						<div class="detail-divider"></div>
						<!-- Notes -->
						<textarea
							:value="currentEnglishNotes"
							@input="saveEnglishNotes($event.target.value)"
							placeholder="English notes..."
							class="detail-notes"
							rows="2"
						></textarea>
						<textarea
							:value="currentGrammarNotes"
							@input="saveGrammarNotes($event.target.value)"
							placeholder="گرامر / نوٹس..."
							class="detail-notes detail-notes-rtl"
							rows="2"
						></textarea>
						<!-- Send to slate -->
						<button @click="sendWordToSlate(selectedWord)" class="detail-slate-btn">Send to Slate →</button>
					</div>
					<div v-else class="detail-empty">Click a word</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>
import quranData from '@/quran-text/quran-complete.json';
import AyahComponent from '@/components/AyahComponent.vue';

export default {
  name: 'HomeView',
  components: {
    AyahComponent
  },
  data() {
    return {
      allSurahs: quranData.surahs,
      currentSurahIndex: 0,
      surah: quranData.surahs[0],
      surahNames: [
        'الفاتحة','البقرة','آل عمران','النساء','المائدة','الأنعام','الأعراف','الأنفال','التوبة','يونس',
        'هود','يوسف','الرعد','إبراهيم','الحجر','النحل','الإسراء','الكهف','مريم','طه',
        'الأنبياء','الحج','المؤمنون','النور','الفرقان','الشعراء','النمل','القصص','العنكبوت','الروم',
        'لقمان','السجدة','الأحزاب','سبأ','فاطر','يس','الصافات','ص','الزمر','غافر',
        'فصلت','الشورى','الزخرف','الدخان','الجاثية','الأحقاف','محمد','الفتح','الحجرات','ق',
        'الذاريات','الطور','النجم','القمر','الرحمن','الواقعة','الحديد','المجادلة','الحشر','الممتحنة',
        'الصف','الجمعة','المنافقون','التغابن','الطلاق','التحريم','الملك','القلم','الحاقة','المعارج',
        'نوح','الجن','المزمل','المدثر','القيامة','الإنسان','المرسلات','النبأ','النازعات','عبس',
        'التكوير','الانفطار','المطففين','الانشقاق','البروج','الطارق','الأعلى','الغاشية','الفجر','البلد',
        'الشمس','الليل','الضحى','الشرح','التين','العلق','القدر','البينة','الزلزلة','العاديات',
        'القارعة','التكاثر','العصر','الهمزة','الفيل','قريش','الماعون','الكوثر','الكافرون','النصر',
        'المسد','الإخلاص','الفلق','الناس'
      ],
      selectedWord: null,
      showExplanationSection: false,
      wordNotes: {},
      fontSize: 52,
      spacing: 1.5,
      showAllTranslations: false,
      showToolbar: true
    };
  },

  computed: {
    currentWordKey() {
      return this.selectedWord ? this.selectedWord.arabic : null;
    },
    currentEnglishNotes() {
      if (!this.currentWordKey) return '';
      return this.wordNotes[this.currentWordKey]?.english || '';
    },
    currentGrammarNotes() {
      if (!this.currentWordKey) return '';
      return this.wordNotes[this.currentWordKey]?.grammar || '';
    }
  },

  methods: {
    handleWordSelected(word) {
      this.selectedWord = word;
      this.showExplanationSection = true;
    },

    saveEnglishNotes(value) {
      if (!this.currentWordKey) return;
      if (!this.wordNotes[this.currentWordKey]) {
        this.wordNotes[this.currentWordKey] = { english: '', grammar: '' };
      }
      this.wordNotes[this.currentWordKey].english = value;
    },

    saveGrammarNotes(value) {
      if (!this.currentWordKey) return;
      if (!this.wordNotes[this.currentWordKey]) {
        this.wordNotes[this.currentWordKey] = { english: '', grammar: '' };
      }
      this.wordNotes[this.currentWordKey].grammar = value;
    },

    goToTeachingSlate() {
      this.$router.push('/teaching-slate');
    },

    sendWordToSlate(word) {
      this.$store.commit('setSlateWord', word);
      this.$router.push('/teaching-slate');
    },

    increaseFontSize() {
      if (this.fontSize < 84) this.fontSize += 2;
    },

    decreaseFontSize() {
      if (this.fontSize > 32) this.fontSize -= 2;
    },

    increaseSpacing() {
      if (this.spacing < 4) this.spacing += 0.5;
    },

    decreaseSpacing() {
      if (this.spacing > 0.5) this.spacing -= 0.5;
    },

    toggleShowAllTranslations() {
      this.showAllTranslations = !this.showAllTranslations;
    },

    changeSurah(event) {
      const index = parseInt(event.target.value);
      this.currentSurahIndex = index;
      this.surah = this.allSurahs[index];
      this.selectedWord = null;
      this.showExplanationSection = false;
    },

    clearAllHighlights() {
      Object.keys(this.$refs).forEach(key => {
        if (key.startsWith('ayah-')) {
          const ayahRefs = this.$refs[key];
          if (Array.isArray(ayahRefs)) {
            ayahRefs.forEach(ref => ref?.clearAllClicks && ref.clearAllClicks());
          } else if (ayahRefs?.clearAllClicks) {
            ayahRefs.clearAllClicks();
          }
        }
      });
    },

    handleKeydown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      switch (e.key) {
        case 't': case 'T': e.preventDefault(); this.toggleShowAllTranslations(); break;
        case 'Escape': e.preventDefault(); this.showToolbar = !this.showToolbar; break;
        case 's': case 'S': if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); this.goToTeachingSlate(); } break;
      }
    },
  },

  mounted() {
    window.addEventListener('keydown', this.handleKeydown);
  },

  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400..700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap');

/* ===== SCREEN ===== */
.quran-screen {
  width: 100vw;
  height: 100vh;
  background: #faf9f6;
  overflow: hidden;
  position: relative;
}

/* ===== MAIN LAYOUT ===== */
.main-layout {
  display: flex;
  width: 100%;
  height: 100%;
}

.quran-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* ===== UNIFIED NAVBAR ===== */
.navbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #065f46, #0f766e);
  color: white;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.nav-left {
  flex-shrink: 0;
}

.nav-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.nav-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Surah selector — styled for dark navbar */
.surah-selector {
  padding: 5px 10px;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 6px;
  background: rgba(255,255,255,0.08);
  font-size: 0.95rem;
  font-weight: 700;
  color: white;
  direction: rtl;
  font-family: 'Noto Sans Arabic', sans-serif;
  outline: none;
  cursor: pointer;
  max-width: 200px;
  transition: all 0.15s;
}

.surah-selector:hover { background: rgba(255,255,255,0.14); }
.surah-selector:focus { border-color: rgba(255,255,255,0.4); }

.surah-selector option {
  background: #065f46;
  color: white;
}

/* Nav buttons — minimal, white on dark */
.nav-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(255,255,255,0.08);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: rgba(255,255,255,0.85);
  transition: all 0.15s;
}
.nav-btn:hover {
  background: rgba(255,255,255,0.18);
  color: white;
}

.nav-value {
  font-size: 0.85rem;
  font-weight: 700;
  color: white;
  min-width: 28px;
  text-align: center;
}

.nav-hint {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: 4px;
}

.nav-sep {
  width: 1px;
  height: 18px;
  background: rgba(255,255,255,0.15);
  margin: 0 4px;
}

.nav-toggle {
  padding: 4px 12px;
  border: 1px solid rgba(255,255,255,0.18);
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  font-family: 'Noto Sans Arabic', sans-serif;
  transition: all 0.15s;
}
.nav-toggle:hover {
  background: rgba(255,255,255,0.08);
  color: white;
}
.nav-toggle.active {
  background: white;
  color: #065f46;
  border-color: white;
}

.nav-count {
  font-family: 'Noto Sans Arabic', serif;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.7);
}

/* ===== AYAHS ===== */
.ayahs-scroll {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* Invisible scrollbar — content is king */
.ayahs-scroll::-webkit-scrollbar { width: 6px; }
.ayahs-scroll::-webkit-scrollbar-track { background: transparent; }
.ayahs-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 6px; }
.ayahs-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.15); }

.ayahs-inner {
  display: flex;
  flex-direction: column;
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 40px 15vh 40px;
  /* 15vh bottom = safe zone for bottom-left face cam */
}

/* Each ayah — clean, no card, just text */
.ayah-row {
  padding: 20px 0;
  border-bottom: 1px solid rgba(0,0,0,0.04);
}

.ayah-row:last-child {
  border-bottom: none;
}

.ayah-content {
  width: 100%;
}

/* Ayah number — centered below text, mushaf-style */
.ayah-num-row {
  text-align: center;
  margin-top: 6px;
}

.ayah-num {
  font-family: 'Amiri Quran', 'Noto Sans Arabic', serif;
  font-size: 1rem;
  color: #10b981;
  opacity: 0.45;
  user-select: none;
}

/* ===== DETAIL PANEL ===== */
.detail-panel {
  width: 320px;
  flex-shrink: 0;
  height: 100vh;
  background: white;
  border-left: 1px solid rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  position: relative;
}

.detail-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(0,0,0,0.04);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all 0.15s;
}
.detail-close:hover { background: #fee2e2; color: #dc2626; }

.detail-content {
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  flex: 1;
}

.detail-arabic {
  font-family: 'Amiri Quran', 'Noto Sans Arabic', serif;
  font-size: 56px;
  font-weight: 500;
  color: #1a1a2e;
  text-align: center;
  line-height: 1.5;
  padding: 16px 0;
}

.detail-urdu {
  font-family: 'Noto Nastaliq Urdu', serif;
  font-size: 24px;
  font-weight: 600;
  color: #065f46;
  text-align: center;
  direction: rtl;
  padding: 12px 16px;
  background: #f0fdf4;
  border-radius: 8px;
}

.detail-divider {
  height: 1px;
  background: rgba(0,0,0,0.06);
  margin: 4px 0;
}

.detail-notes {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  transition: border-color 0.15s;
  font-family: 'Inter', sans-serif;
  color: #333;
  background: #fafafa;
}
.detail-notes:focus { border-color: #10b981; background: white; }
.detail-notes::placeholder { color: #bbb; }

.detail-notes-rtl {
  direction: rtl;
  font-family: 'Noto Sans Arabic', serif;
}

.detail-slate-btn {
  padding: 10px 16px;
  background: #065f46;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
  text-align: center;
}
.detail-slate-btn:hover { background: #047857; }

.detail-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 15px;
}

/* ===== TRANSITIONS ===== */
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
.slide-down-leave-to { transform: translateX(-50%) translateY(-100%); opacity: 0; }

.panel-slide-enter-active, .panel-slide-leave-active { transition: all 0.3s ease; }
.panel-slide-enter-from { transform: translateX(100%); opacity: 0; }
.panel-slide-leave-to { transform: translateX(100%); opacity: 0; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
