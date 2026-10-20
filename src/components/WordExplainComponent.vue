<template>
    <div class="explanation-panel">
        <!-- Header -->
        <div class="panel-header">
            <h2 class="panel-title">Word Details</h2>
            <button @click="$emit('close')" class="close-button" aria-label="Close panel">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Content -->
        <div class="panel-content" v-if="selectedWord">
            <!-- Arabic Word Display -->
            <div class="arabic-section">
                <div class="arabic-word">{{ selectedWord.arabic }}</div>
                <div class="word-badge">Arabic</div>
            </div>

            <!-- Translation Section (Urdu) -->
            <div class="translation-section">
                <div class="section-label">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
                    </svg>
                    <span>Urdu Translation</span>
                </div>
                <div class="translation-text urdu">{{ selectedWord.urdu || 'ترجمہ دستیاب نہیں' }}</div>
            </div>

            <!-- Send to Slate Button -->
            <button @click="$emit('sendToSlate', selectedWord)" class="send-slate-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                </svg>
                <span>Send to Slate</span>
            </button>

            <!-- English Meaning (for grammar explanations) -->
            <div class="info-section">
                <div class="section-label">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    <span>English Notes</span>
                </div>
                <div class="notes-input">
                    <textarea
                        :value="englishNotes"
                        @input="$emit('update:englishNotes', $event.target.value)"
                        placeholder="Add English explanation or grammar notes for this word..."
                        rows="3"
                        class="english-notes"
                    ></textarea>
                </div>
            </div>

            <!-- Arabic Grammar Section -->
            <div class="info-section">
                <div class="section-label">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                    <span>Grammar / Etymology</span>
                </div>
                <div class="notes-input">
                    <textarea
                        :value="grammarNotes"
                        @input="$emit('update:grammarNotes', $event.target.value)"
                        placeholder="Root word, verb form, grammatical notes (e.g., فَعَلَ pattern)..."
                        rows="2"
                        class="arabic-grammar"
                    ></textarea>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-gray-300">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            <p class="empty-text">Select a word to view details</p>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'WordExplainComponent',

    props: {
        selectedWord: {
            type: Object,
            required: false,
            default: null
        },
        englishNotes: {
            type: String,
            default: ''
        },
        grammarNotes: {
            type: String,
            default: ''
        }
    },
    emits: ['close', 'update:englishNotes', 'update:grammarNotes', 'sendToSlate']
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap');

.explanation-panel {
    height: 100%;
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    background: linear-gradient(135deg, #10b981, #14b8a6);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.panel-title {
    font-size: 18px;
    font-weight: 600;
    color: white;
    margin: 0;
}

.close-button {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 8px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-button:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
}

.panel-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
}

.arabic-section {
    background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
    border: 2px solid #10b981;
    border-radius: 12px;
    padding: 32px 24px;
    text-align: center;
    margin-bottom: 24px;
    position: relative;
}

.arabic-word {
    font-family: 'Amiri Quran', 'Noto Sans Arabic', serif;
    font-size: 68px; /* Increased from 56px for 4K */
    font-weight: 600;
    color: #065f46;
    line-height: 1.4;
    margin-bottom: 12px;
}

.word-badge {
    display: inline-block;
    background: #10b981;
    color: white;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.translation-section,
.info-section {
    background: #f9fafb;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    border: 1px solid #e5e7eb;
}

.section-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #374151;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.section-label svg {
    color: #10b981;
}

.translation-text {
    font-family: 'Noto Nastaliq Urdu', serif;
    font-size: 24px; /* Increased from 20px for 4K */
    font-weight: 600;
    color: #1f2937;
    line-height: 1.8;
    padding: 16px; /* Increased from 12px */
    background: white;
    border-radius: 8px;
    border-left: 4px solid #10b981;
}

.translation-text.urdu {
    direction: rtl;
    text-align: right;
}

.notes-input {
    margin-top: 8px;
}

.english-notes,
.arabic-grammar {
    width: 100%;
    padding: 12px 16px;
    font-size: 16px;
    line-height: 1.6;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    outline: none;
    transition: all 0.2s;
    background: white;
    resize: vertical;
    font-family: 'Inter', sans-serif;
}

.arabic-grammar {
    font-family: 'Noto Sans Arabic', serif;
    direction: rtl;
    text-align: right;
}

.english-notes:focus,
.arabic-grammar:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.english-notes::placeholder,
.arabic-grammar::placeholder {
    color: #9ca3af;
    font-size: 14px;
}

.info-text {
    color: #6b7280;
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
}

.empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
}

.empty-text {
    margin-top: 16px;
    color: #9ca3af;
    font-size: 16px;
    font-weight: 500;
}

.send-slate-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px 16px;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
}

.send-slate-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
}

@keyframes slideIn {
    from {
        transform: translateX(20px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Custom Scrollbar */
.panel-content::-webkit-scrollbar {
    width: 6px;
}

.panel-content::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
}

.panel-content::-webkit-scrollbar-thumb {
    background: #10b981;
    border-radius: 10px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
    background: #059669;
}
</style>