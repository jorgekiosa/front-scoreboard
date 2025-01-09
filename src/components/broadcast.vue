<template>
    <div class="scoreboard p-3 rounded" v-if="hideBoard">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <!-- Container com duas divs separadas -->
        <div class="d-flex">
          <!-- Div para os minutos -->
          <div class="timer bg-placar px-4 me-1">
            <span class="fs-6 fw-bold text-white">{{ formattedTime}}</span>
          </div>
  
          <!-- Div para o nome ALPROME -->
          <div v-if="sponsor" class="game-name bg-placar px-4">
            <span class="fs-6 fw-bold text-white">{{sponsor}}</span>
          </div>
        </div>
      </div>
  <!-- <pre>{{data}}</pre> -->
      <div class="teams">
        <div class="team bg-placar p-1 text-white">
          <div class="d-flex justify-content-between align-items-center">
            <span class="team-name fs-6 fw-bold">{{team1.name}}</span>
            <div class="team-score d-flex align-items-center">
              <span v-if="team1.set1!==null" class="set-score fs-4 fw-bolder me-2">{{team1.set1}}</span>
              <span v-if="team1.set2!==null" class="set-score fs-4 fw-bolder me-2">{{team1.set2}}</span>
              <span v-if="team1.set3!==null" class="set-score fs-4 fw-bolder me-2">{{team1.set3}}</span>
              <span v-if="data?.gameOver==false" :class="
                 team1.totalScore=='VT'?'total-score fs-4 fw-bolder text-white border border-2 border-white rounded px-2':
                 team1.totalScore==40&&team2.totalScore==40&&data?.deuceRule==='goldenPoint'?'total-score fs-4 fw-bolder text-white bg-gold-point border-gold-point rounded px-2':
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
              <span v-if="team2.set1!==null" class="set-score fs-4 fw-bolder me-2">{{team2.set1}}</span>
              <span v-if="team2.set2!==null" class="set-score fs-4 fw-bolder me-2">{{team2.set2}}</span>
              <span v-if="team2.set3!==null" class="set-score fs-4 fw-bolder me-2">{{team2.set3}}</span>
              <span v-if="data?.gameOver==false" :class="
                 team2.totalScore=='VT'?'total-score fs-4 fw-bolder text-white border border-2 border-white rounded px-2':
                 team1.totalScore==40&&team2.totalScore==40&&data?.deuceRule==='goldenPoint'?'total-score fs-4 fw-bolder text-white bg-gold-point border-gold-point rounded px-2':
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
  import { ref,computed, onMounted, onUnmounted  } from 'vue';
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
  const deuceRule = ref('')
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
  let isListening = false;

  function displayPoints(points) {
    if (points === 0) return '0';
    if (points === 1) return '15';
    if (points === 2) return '30';
    if (points === 3) return '40';
    return 'VT';
 }

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

 const returnData = computed(() => {
   return data.value
  });
  
const updateLocalState=(updatedData)=>{
  if (!updatedData || updatedData.code !== route.query.code) return;

  data.value = updatedData;
  sponsor.value = updatedData.sponsor || '';
  deuceRule.value = updatedData.deuceRule || '';
  timer.value = updatedData.timer || 0;
  hideBoard.value = updatedData.hideBoard || true;

  team1.value = {
    name: updatedData.player1 || 'Home',
    set1: updatedData?.setPlayer1?.set1 || 0,
    set2: updatedData?.setPlayer1?.set2 || null,
    set3: updatedData?.setPlayer1?.set3 || null,
    totalScore: updatedData?.player1Score || 0,
  };

  team2.value = {
    name: updatedData.player2 || 'Away',
    set1: updatedData?.setPlayer2?.set1 || 0,
    set2: updatedData?.setPlayer2?.set2 || null,
    set3: updatedData?.setPlayer2?.set3 || null,
    totalScore: updatedData?.player2Score || 0,
  };
}

const setupSocketListeners=()=> {
  if (isListening) return;
  isListening = true;

  socket.on('gameUpdated', (updatedData) => {
    console.log('Dados recebidos:', updatedData);
    updateLocalState(updatedData);
  });

  socket.on('timerUpdated', (data) => {
    if (data.code === route.query.code) {
      timer.value = data.timer;
      isRunning.value = data.isRunning;
    }
  });

  socket.on('currentTimer', (data) => {
    if (data.code === route.query.code) {
      timer.value = data.timer;
      isRunning.value = data.isRunning;
    }
  });
}

// Remove ouvintes ao sair do componente
function removeSocketListeners() {
  if (!isListening) return;
  isListening = false;

  socket.off('gameUpdated');
  socket.off('timerUpdated');
  socket.off('currentTimer');
}


// Solicita o timer ao carregar a página
onMounted(() => {
  setupSocketListeners();
  //socket.emit('getGame', { code: route.query.code || '' });
  socket.emit('getTimer', { code: route.query.code || '' });
});

// Remove ouvintes ao desmontar o componente
onUnmounted(() => {
  removeSocketListeners();
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
  