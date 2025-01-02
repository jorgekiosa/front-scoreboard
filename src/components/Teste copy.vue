<template>
  <div class="scoreboard p-4 bg-light rounded shadow">
    <!-- Título -->
    <h2 class="text-center mb-4">Placar de Tênis</h2>

    <!-- Pontuação Atual -->
    <div class="d-flex justify-content-between mb-3">
      <!-- Jogador 1 -->
      <div>
        <h3 class="text-primary">{{ player1Name }}</h3>
        <p>Pontos: <span class="fw-bold">{{ displayPoints(player1Points) }}</span></p>
        <p>Games: <span class="fw-bold">{{ player1Games }}</span></p>
      </div>
      <!-- Jogador 2 -->
      <div>
        <h3 class="text-danger">{{ player2Name }}</h3>
        <p>Pontos: <span class="fw-bold">{{ displayPoints(player2Points) }}</span></p>
        <p>Games: <span class="fw-bold">{{ player2Games }}</span></p>
      </div>
    </div>

    <!-- Histórico de Sets -->
    <div class="mb-3">
      <h4>Sets:</h4>
      <ul>
        <li>{{ `Set 1: ${setPlayer1.set1} - ${setPlayer2.set1}` }}</li>
        <li>{{ `Set 2: ${setPlayer1.set2} - ${setPlayer2.set2}` }}</li>
        <li v-if="setPlayer1.set3 !== null">{{ `Set 3: ${setPlayer1.set3} - ${setPlayer2.set3}` }}</li>
      </ul>
    </div>

    <!-- Botões para Marcar Pontos -->
    <div class="d-flex justify-content-around">
      <!-- Incrementar pontos -->
      <button class="btn btn-primary" @click="scorePoint(1, 'increment')" :disabled="isGameOver">
        + Ponto para {{ player1Name }}
      </button>
      <button class="btn btn-danger" @click="scorePoint(2, 'increment')" :disabled="isGameOver">
        + Ponto para {{ player2Name }}
      </button>
    </div>

    <div class="d-flex justify-content-around mt-2">
      <!-- Decrementar pontos -->
      <button class="btn btn-secondary" @click="scorePoint(1, 'decrement')" :disabled="isGameOver">
        - Ponto para {{ player1Name }}
      </button>
      <button class="btn btn-secondary" @click="scorePoint(2, 'decrement')" :disabled="isGameOver">
        - Ponto para {{ player2Name }}
      </button>
    </div>

    <!-- Mensagem de Fim de Jogo -->
    <div v-if="isGameOver" class="text-center mt-3">
      <h3 class="text-success">Jogo Finalizado! 🎾</h3>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';

// Nomes dos jogadores
const player1Name = 'Jogador 1';
const player2Name = 'Jogador 2';

// Variáveis de controle
const player1Points = ref(0);
const player2Points = ref(0);

const player1Games = ref(0);
const player2Games = ref(0);

// Objetos para armazenar os valores dos sets de cada jogador
const setPlayer1 = ref({
  set1: 0,
  set2: 0,
  set3: null, // Inicializa com null, para o set 3 ser opcional
});

const setPlayer2 = ref({
  set1: 0,
  set2: 0,
  set3: null, // Inicializa com null, para o set 3 ser opcional
});

// Calcula se o jogo acabou
const isGameOver = computed(() => checkGameOver());

// Função auxiliar para exibir os pontos corretamente
function displayPoints(points) {
  if (points === 0) return '0';
  if (points === 1) return '15';
  if (points === 2) return '30';
  if (points === 3) return '40';
  return 'Vantagem';
}

// Função para marcar ou remover um ponto
function scorePoint(player, action) {
  if (isGameOver.value) return; // Impede novas ações se o jogo acabou

  if (action === 'increment') {
    if (player === 1) player1Points.value++;
    else if (player === 2) player2Points.value++;
  } else if (action === 'decrement') {
    if (player === 1 && player1Points.value > 0) player1Points.value--;
    else if (player === 2 && player2Points.value > 0) player2Points.value--;
  }

  checkGameWinner();
}

// Função para verificar vencedor do game
function checkGameWinner() {
  if (player1Points.value >= 4 && player1Points.value - player2Points.value >= 2) {
    player1Games.value++;
    updateCurrentSet(); // Atualiza o set atual
    resetGame();
    checkSetWinner(); // Verifica se o set foi concluído
  } else if (player2Points.value >= 4 && player2Points.value - player1Points.value >= 2) {
    player2Games.value++;
    updateCurrentSet(); // Atualiza o set atual
    resetGame();
    checkSetWinner(); // Verifica se o set foi concluído
  }
}

// Função para atualizar os valores do set atual
function updateCurrentSet() {
  const currentSet = getCurrentSet();

  if (currentSet === 'set1') {
    setPlayer1.value.set1 = player1Games.value;
    setPlayer2.value.set1 = player2Games.value;
  } else if (currentSet === 'set2') {
    setPlayer1.value.set2 = player1Games.value;
    setPlayer2.value.set2 = player2Games.value;
  } else if (currentSet === 'set3') {
    setPlayer1.value.set3 = player1Games.value;
    setPlayer2.value.set3 = player2Games.value;
  }
}

// Função para verificar vencedor do set
function checkSetWinner() {
  const currentSet = getCurrentSet();

  // Verifica se o jogador 1 venceu o set
  if (player1Games.value >= 6 && player1Games.value - player2Games.value >= 2) {
    setPlayer1.value[currentSet] = player1Games.value;
    setPlayer2.value[currentSet] = player2Games.value;
    resetSet(); // Reinicia os valores de games para o próximo set
  } 
  // Verifica se o jogador 2 venceu o set
  else if (player2Games.value >= 6 && player2Games.value - player1Games.value >= 2) {
    setPlayer2.value[currentSet] = player2Games.value;
    setPlayer1.value[currentSet] = player1Games.value;
    resetSet(); // Reinicia os valores de games para o próximo set
  }

  checkGameOver(); // Verifica se o jogo chegou ao fim
}

function updateSetResults(currentSet, player1SetGames, player2SetGames) {
  if (currentSet === 'set1') {
    setPlayer1.value.set1 = player1SetGames;
    setPlayer2.value.set1 = player2SetGames;
  } else if (currentSet === 'set2') {
    setPlayer1.value.set2 = player1SetGames;
    setPlayer2.value.set2 = player2SetGames;
  } else if (currentSet === 'set3') {
    setPlayer1.value.set3 = player1SetGames;
    setPlayer2.value.set3 = player2SetGames;
  }
}
// Função auxiliar para descobrir o set atual
function getCurrentSet() {
  // Verifica se o Set 1 ainda está em andamento
  if (setPlayer1.value.set1 === 0 && setPlayer2.value.set1 === 0) {
    return 'set1';
  } else if (setPlayer1.value.set1 >= 6 || setPlayer2.value.set1 >= 6) {
    if (Math.abs(setPlayer1.value.set1 - setPlayer2.value.set1) >= 2) {
      // Set 1 está concluído, verifica Set 2
      if (setPlayer1.value.set2 === 0 && setPlayer2.value.set2 === 0) {
        return 'set2';
      } else if (setPlayer1.value.set2 >= 6 || setPlayer2.value.set2 >= 6) {
        if (Math.abs(setPlayer1.value.set2 - setPlayer2.value.set2) >= 2) {
          // Set 2 está concluído, retorna Set 3
          return 'set3';
        }
      } else {
        // Set 2 ainda está em andamento
        return 'set2';
      }
    }
  } else {
    // Set 1 ainda está em andamento
    return 'set1';
  }
  // Por padrão, retorna Set 3 como atual
  return 'set3';
}


// Verifica se o jogo acabou
function checkGameOver() {
  const player1SetsWon = (setPlayer1.value.set1 > setPlayer2.value.set1 ? 1 : 0) +
    (setPlayer1.value.set2 > setPlayer2.value.set2 ? 1 : 0);
  const player2SetsWon = (setPlayer2.value.set1 > setPlayer1.value.set1 ? 1 : 0) +
    (setPlayer2.value.set2 > setPlayer1.value.set2 ? 1 : 0);

  return player1SetsWon === 2 || player2SetsWon === 2;
}

// Reseta pontos e games
function resetGame() {
  player1Points.value = 0;
  player2Points.value = 0;
}

function resetSet() {
  player1Games.value = 0;
  player2Games.value = 0;
}
</script>
<style scoped>
.scoreboard {
  max-width: 500px;
  margin: auto;
}
ul {
  list-style: none;
  padding-left: 0;
}
li {
  margin-bottom: 5px;
}
button {
  width: 45%;
}
.text-success {
  font-weight: bold;
  font-size: 1.5rem;
}
</style>
