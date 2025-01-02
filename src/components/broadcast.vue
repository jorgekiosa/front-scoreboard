<template>
    <div class="scoreboard p-3 rounded" v-if="returnData?.hideBoard">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <!-- Container com duas divs separadas -->
        <div class="d-flex">
          <!-- Div para os minutos -->
          <div class="timer bg-placar px-4 me-1">
            <span class="fs-6 fw-bold text-white">{{ formattedTime}}</span>
          </div>
          <!-- Div para o nome do Patrocinador -->
          <div v-if="sponsor" class="game-name bg-placar px-4">
            <span class="fs-6 fw-bold text-white">{{sponsor}}</span>
          </div>
        </div>
      </div>
      <div class="teams">
        <div class="team bg-placar p-1 text-white">
          <div class="d-flex justify-content-between align-items-center">
            <span class="team-name fs-6 fw-bold">{{team1.name}}</span>
            <div class="team-score d-flex align-items-center">
              <span v-for="(value, set) in returnData?.setPlayer1" :key="set" v-if="value!==null" class="set-score fs-4 fw-bolder me-2">{{value}}</span>
              <span v-if="returnData?.gameOver==false" :class="
                 team1.totalScore=='VT'?'total-score fs-4 fw-bolder text-white border border-2 border-white rounded px-2':
                returnData?.deuceRule==='goldenPoint'?'total-score fs-4 fw-bolder text-white bg-gold-point border-gold-point rounded px-2':
                'total-score fs-4 fw-bolder text-white border border-2 border-white rounded px-2'">
                {{team1.totalScore}}
            </span>
            </div>
          </div>
        </div>
        <div class="team bg-placar p-1 text-white">
          <div class="d-flex justify-content-between align-items-center">
            <span class="team-name fs-6 fw-bold">{{team2.name}}</span>
            <div class="team-score d-flex align-items-center">
              <span v-for="(value, set) in returnData?.setPlayer2" :key="set" v-if="value!==null" class="set-score fs-4 fw-bolder me-2">{{value}}</span>
              <span v-if="returnData?.gameOver==false" :class="
                 team2.totalScore=='VT'?'total-score fs-4 fw-bolder text-white border border-2 border-white rounded px-2':
                 returnData?.deuceRule==='goldenPoint'?'total-score fs-4 fw-bolder text-white bg-gold-point border-gold-point rounded px-2':
                'total-score fs-4 fw-bolder text-white border border-2 border-white rounded px-2'">
                {{team2.totalScore}}
            </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref,computed, onMounted } from 'vue';
  import { io } from 'socket.io-client';
  import { useRouter, useRoute } from 'vue-router';
  const router = useRouter();
  const route = useRoute();

  const socket = io(import.meta.env.VITE_WEBSOCKT_BASE_URL || 'http://localhost:3007',{query: { code:route.query.code || '' },transports: ['websocket','polling'],});
  
  // Definição de dados de exemplo para os times
  const timer = ref(0);
  const isRunning = ref(false);
  const sponsor = ref('');
  const hideBoard =ref(true)
  const team1 = ref({
    name: 'Home',
    setScores: 0,
    totalScore: 0,
    set1:0,
    set2:null,
    set3:null,
  });
  const team2 = ref({
    name: 'Away',
    setScores: 0,
    totalScore: 0,
    set1:0,
    set2:null,
    set3:null,
  });

  const data = ref(null);

  function displayPoints(points) {
    if (points === 0) return '0';
    if (points === 1) return '15';
    if (points === 2) return '30';
    if (points === 3) return '40';
    return 'VT';
 }
 const returnData = computed(() => {
   return data.value
  });
  // Formatação do tempo em MM:SS
  const formattedTime = computed(() => {
    const time = Number(timer.value);
    if (isNaN(time) || time < 0) {
        return '00:00'; 
    }
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
    });

  socket.on('gameUpdated', (updatedData) => {
  if (updatedData.code === route.query.code) {
    console.log("Dados recebidos:", updatedData);
    data.value=updatedData

    sponsor.value=updatedData.sponsor || ''
    timer.value = updatedData.timer || '00:00';
    team1.value.name = updatedData.player1 || 'Home';
    team1.value.set1 = updatedData?.setPlayer1?.set1 || 0;
    team1.value.set2 = updatedData?.setPlayer1?.set2 || null;
    team1.value.set3 = updatedData?.setPlayer1?.set3 || null;
    team1.value.totalScore = updatedData?.player1Score || 0;
    hideBoard.value=updatedData?.hideBoard || true
    team2.value.name = updatedData.player2 || 'Away';
    team2.value.set1 = updatedData?.setPlayer2?.set1 || 0;
    team2.value.set2 = updatedData?.setPlayer2?.set2 || null;
    team2.value.set3 = updatedData?.setPlayer2?.set3 || null;
    team2.value.totalScore = updatedData?.player2Score || 0;
  }
});

// Recebe atualizações do timer
socket.on('timerUpdated', (data) => {
  if (data.code === route.query.code) {
    timer.value = data.timer;
    isRunning.value = data.isRunning;
  }
});

// Solicita o timer ao carregar a página
onMounted(() => {
  console.log("route.query.code",route.query.code)
  console.log("import.meta.env.VITE_WEBSOCKT_BASE_URL",import.meta.env.VITE_WEBSOCKT_BASE_URL)
  socket.emit('getGame', { code: route.query.code || '' });
  socket.emit('getTimer', { code: route.query.code || '' });
  socket.on('currentTimer', (data) => {
    if (data.code === route.query.code) {
      timer.value = data.timer;
      isRunning.value = data.isRunning;
    }
  });
});

</script>
  
<style scoped>
.bg-placar{
  background-color:#172131
}
.bg-gold-point{
  background-color:#be9826
}
.text-gold-point{
  background-color:#be9826
}
.border-gold-point{
  border: 1px solid #be9826
}
.scoreboard {
  max-width: 350px;
}
  
  .team-name {
    font-size: 1rem; /* Menor para ajustar ao tamanho desejado */
  }
  
  .set-score {
    font-size: 1.25rem;
  }
  
  .total-score {
    font-size: 1.25rem;
    color: #ffc107; /* Cor amarela */
  }
  
  .team-score {
    display: flex;
    align-items: center;
  }
  
  .team {
    padding: 0.5rem; /* Menor padding para ajustar o tamanho */
  }
  
  .timer {
    font-size: 1rem; /* Tamanho menor para os minutos */
    padding: 0.25rem 0.5rem; /* Reduzir o padding */
  }
  
  .game-name {
    font-size: 1rem; /* Tamanho menor para o nome */
    padding: 0.25rem 0.5rem; /* Reduzir o padding */
  }
  
  .d-flex.bg-white {
    background-color: white; /* Fundo branco */
    padding: 0.25rem; /* Padding para o contêiner */
    border-radius: 0.5rem; /* Cantos arredondados */
  }
  
  .timer, .game-name {
    display: inline-block; /* Para os elementos ficarem na mesma linha */
  }
  </style>
  