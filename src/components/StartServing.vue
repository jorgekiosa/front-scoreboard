<template>
    <div class="scoreboard bg-light p-3 rounded">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <!-- Container com duas divs separadas -->
        <div class="d-flex">
          <!-- Div para os minutos -->
          <div class="timer bg-white px-4 rounded-3 me-2">
            <span class="fs-6 fw-bold text-primary">{{ formattedTime}}</span>
          </div>
  
          <!-- Div para o nome ALPROME -->
          <div v-if="sponsor" class="game-name bg-white px-4 rounded-3">
            <span class="fs-6 fw-bold text-primary">{{sponsor}}</span>
          </div>
        </div>
      </div>
  
      <div class="teams">
        <div class="team bg-primary p-1 rounded text-white mb-2">
          <div class="d-flex justify-content-between align-items-center">
            <span class="team-name fs-6 fw-bold">{{team1.name}}</span>
            <div class="team-score d-flex align-items-center">
              <span class="set-score fs-4 fw-bolder me-2">{{team1.set1}}</span>
              <span class="set-score fs-4 fw-bolder me-2">{{team1.set2}}</span>
              <span class="set-score fs-4 fw-bolder me-2">{{team1.set3}}</span>
              <span :class="
                 displayPoints(team1.totalScore)=='VT'?'total-score fs-4 fw-bolder text-white border border-2 border-white rounded px-2':
                 displayPoints(team1.totalScore)==40&&displayPoints(team2.totalScore)?'total-score fs-4 fw-bolder text-warning border border-2 border-warning rounded px-2':
                'total-score fs-4 fw-bolder text-white border border-2 border-white rounded px-2'">
                {{displayPoints(team1.totalScore)}}
            </span>
            </div>
          </div>
        </div>
        
        <div class="team bg-primary p-1 rounded text-white">
          <div class="d-flex justify-content-between align-items-center">
            <span class="team-name fs-6 fw-bold">{{team2.name}}</span>
            <div class="team-score d-flex align-items-center">
                <span class="set-score fs-4 fw-bolder me-2">{{team2.set1}}</span>
              <span class="set-score fs-4 fw-bolder me-2">{{team2.set2}}</span>
              <span class="set-score fs-4 fw-bolder me-2">{{team2.set3}}</span>
              <span :class="
                 displayPoints(team2.totalScore)=='VT'?'total-score fs-4 fw-bolder text-white border border-2 border-white rounded px-2':
                 displayPoints(team1.totalScore)==40&&displayPoints(team2.totalScore)?'total-score fs-4 fw-bolder text-warning border border-2 border-warning rounded px-2':
                'total-score fs-4 fw-bolder text-white border border-2 border-white rounded px-2'">
                {{displayPoints(team2.totalScore)}}
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

  const socket = io('http://localhost:3007',{query: { code:route.query.code || '' }});
  
  // Definição de dados de exemplo para os times
  const timer = ref(0);
  const isRunning = ref(false);
  const sponsor = ref('');
  const team1 = ref({
    name: 'Home',
    setScores: 0,
    totalScore: 0,
    set1:0,
    set2:0,
    set3:0,
  });
  const team2 = ref({
    name: 'Away',
    setScores: 0,
    totalScore: 0,
    set1:0,
    set2:0,
    set3:0,
  });

  const data = ref(null);

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

  socket.on('gameUpdated', (updatedData) => {
  if (updatedData.code === route.query.code) {
    console.log("Dados recebidos:", updatedData);
    data.value=updatedData

    sponsor.value=updatedData.sponsor || ''
    timer.value = updatedData.timer || '00:00';
    team1.value.name = updatedData.player1 || 'Home';
    team1.value.set1 = updatedData?.setPlayer1?.set1 || 0;
    team1.value.set2 = updatedData?.setPlayer1?.set2 || 0;
    team1.value.set3 = updatedData?.setPlayer1?.set3 || 0;
    team1.value.totalScore = updatedData.scores?.player1 || 0;

    team2.value.name = updatedData.player2 || 'Away';
    team2.value.set1 = updatedData?.setPlayer2?.set1 || 0;
    team2.value.set2 = updatedData?.setPlayer2?.set2 || 0;
    team2.value.set3 = updatedData?.setPlayer2?.set3 || 0;
    team2.value.totalScore = updatedData.scores?.player2 || 0;
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
  