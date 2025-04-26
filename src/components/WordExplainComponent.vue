<template>
    <div class="relative bg-white bg-opacity-80 p-6 rounded-lg h-[70%] w-72  border-4 border-yellow-500">
        <div v-if="selectedWord" class="text-gray-800">
            <p style="font-family: Arabic;" class="text-6xl font-bold text-gray-600">{{ selectedWord.arabic }}</p>

            <div class="absolute bottom-4 left-4 hover:scale-105 transition-transform cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-blue-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/>
                </svg>
            </div>
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
            default: () => ({
                arabic: "test",
                urdu: ""
            })
        }
        },
    };
</script>