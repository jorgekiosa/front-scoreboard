<template>
  <div class="tennis-game">
    <h1>Tênis - Jogo</h1>
    <div class="scoreboard">
      <div>
        <h2>Jogador 1</h2>
        <p>{{ player1Score }}</p>
        <button @click="incrementPlayer1">+1 Ponto</button>
        <button @click="decrementPlayer1">-1 Ponto</button>
      </div>
      <div>
        <h2>Jogador 2</h2>
        <p>{{ player2Score }}</p>
        <button @click="incrementPlayer2">+1 Ponto</button>
        <button @click="decrementPlayer2">-1 Ponto</button>
      </div>
    </div>

    <div v-if="currentSet <= 3">
      <h2>Set {{ currentSet }}</h2>
      <p>Jogador 1: {{ player1Games }} - Jogador 2: {{ player2Games }}</p>
      <p>Vencedor do Set: {{ setWinner }}</p>
    </div>

    <div v-if="isTieBreak">
      <h3>Tie-Break!</h3>
      <p>Jogador 1: {{ tieBreakPlayer1 }} - Jogador 2: {{ tieBreakPlayer2 }}</p>
      <button @click="incrementTieBreakPlayer1">+1 Ponto</button>
      <button @click="incrementTieBreakPlayer2">+1 Ponto</button>
    </div>

    <div v-if="currentSet > 3">
      <h2>Fim de Jogo!</h2>
      <p>Vencedor: {{ winner }}</p>
    </div>

    <div v-if="currentSet > 0">
      <h3>Placar dos Sets</h3>
      <p>Jogador 1: Set 1 - {{ setPlayer1.set1 }} | Set 2 - {{ setPlayer1.set2 }} | Set 3 - {{ setPlayer1.set3 }}</p>
      <p>Jogador 2: Set 1 - {{ setPlayer2.set1 }} | Set 2 - {{ setPlayer2.set2 }} | Set 3 - {{ setPlayer2.set3 }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Estados para pontos, games e sets
const player1Score = ref(0);
const player2Score = ref(0);
const player1Games = ref(0);
const player2Games = ref(0);
const currentSet = ref(1);
const player1Sets = ref(0);
const player2Sets = ref(0);

// Estados para Tie-Break
const isTieBreak = ref(false);
const tieBreakPlayer1 = ref(0);
const tieBreakPlayer2 = ref(0);

// Armazenando os sets de cada jogador
const setPlayer1 = ref({
  set1: 0,
  set2: null,
  set3: null
});

const setPlayer2 = ref({
  set1: 0,
  set2: null,
  set3: null
});

// Computed para determinar o vencedor do set
const setWinner = computed(() => {
  if (player1Games.value >= 6 && player1Games.value - player2Games.value >= 2) {
    return 'Jogador 1';
  } else if (player2Games.value >= 6 && player2Games.value - player1Games.value >= 2) {
    return 'Jogador 2';
  }
  if (player1Games.value === 6 && player2Games.value === 6) {
    isTieBreak.value = true;
    return 'Tie-Break';
  }
  return 'Nenhum';
});

// Computed para determinar o vencedor final
const winner = computed(() => {
  if (player1Sets.value === 3) return 'Jogador 1';
  if (player2Sets.value === 3) return 'Jogador 2';
  return 'Jogo em andamento';
});

// Funções para incrementar os pontos
function incrementPlayer1() {
  if (player1Score.value === 40) {
    player1Score.value = 0;
    player2Score.value = 0;
    player1Games.value++;
    updateSetScore('player1'); // Atualiza o set após cada game ganho
    checkSetWinner();
  } else {
    player1Score.value = nextScore(player1Score.value);
  }
}

function incrementPlayer2() {
  if (player2Score.value === 40) {
    player2Score.value = 0;
    player1Score.value = 0;
    player2Games.value++;
    updateSetScore('player2'); // Atualiza o set após cada game ganho
    checkSetWinner();
  } else {
    player2Score.value = nextScore(player2Score.value);
  }
}

// Funções para decrementar os pontos
function decrementPlayer1() {
  if (player1Score.value > 0) {
    player1Score.value -= 15;
  }
}

function decrementPlayer2() {
  if (player2Score.value > 0) {
    player2Score.value -= 15;
  }
}

// Função para o Tie-Break
function incrementTieBreakPlayer1() {
  if (tieBreakPlayer1.value < 7 || tieBreakPlayer1.value - tieBreakPlayer2.value < 2) {
    tieBreakPlayer1.value++;
    checkTieBreakWinner();
  }
}

function incrementTieBreakPlayer2() {
  if (tieBreakPlayer2.value < 7 || tieBreakPlayer2.value - tieBreakPlayer1.value < 2) {
    tieBreakPlayer2.value++;
    checkTieBreakWinner();
  }
}

// Função para determinar o próximo valor de pontos
function nextScore(currentScore) {
  if (currentScore === 0) return 15;
  if (currentScore === 15) return 30;
  if (currentScore === 30) return 40;
  return 0;
}

// Função para verificar se o set foi vencido
function checkSetWinner() {
  if (setWinner.value === 'Jogador 1') {
    player1Sets.value++;
    updateSetScore('player1');
    resetGame();
    if (player1Sets.value < 3) {
      currentSet.value++;
    }
  } else if (setWinner.value === 'Jogador 2') {
    player2Sets.value++;
    updateSetScore('player2');
    resetGame();
    if (player2Sets.value < 3) {
      currentSet.value++;
    }
  }
}

// Função para verificar o vencedor do Tie-Break
function checkTieBreakWinner() {
  if (tieBreakPlayer1.value >= 7 && tieBreakPlayer1.value - tieBreakPlayer2.value >= 2) {
    player1Sets.value++;
    updateSetScore('player1');
    resetTieBreak();
    if (player1Sets.value < 3) {
      currentSet.value++;
    }
  } else if (tieBreakPlayer2.value >= 7 && tieBreakPlayer2.value - tieBreakPlayer1.value >= 2) {
    player2Sets.value++;
    updateSetScore('player2');
    resetTieBreak();
    if (player2Sets.value < 3) {
      currentSet.value++;
    }
  }
}

// Função para atualizar o placar do set atual
function updateSetScore(player) {
  if (player === 'player1') {
    if (currentSet.value === 1) {
      setPlayer1.value.set1 = player1Games.value;
    } else if (currentSet.value === 2) {
      setPlayer1.value.set2 = player1Games.value;
    } else if (currentSet.value === 3) {
      setPlayer1.value.set3 = player1Games.value;
    }
  } else if (player === 'player2') {
    if (currentSet.value === 1) {
      setPlayer2.value.set1 = player2Games.value;
    } else if (currentSet.value === 2) {
      setPlayer2.value.set2 = player2Games.value;
    } else if (currentSet.value === 3) {
      setPlayer2.value.set3 = player2Games.value;
    }
  }
}

// Função para resetar a pontuação do game
function resetGame() {
  player1Score.value = 0;
  player2Score.value = 0;
  player1Games.value = 0;
  player2Games.value = 0;

  // Verifica se o set foi finalizado, se sim, passa para o próximo set
  if (player1Games.value >= 6 || player2Games.value >= 6) {
    if (player1Sets.value === 3 || player2Sets.value === 3) {
      currentSet.value = 4; // Fim de jogo
    }
  }
}

// Função para resetar o Tie-Break
function resetTieBreak() {
  tieBreakPlayer1.value = 0;
  tieBreakPlayer2.value = 0;
  isTieBreak.value = false;
}

// Função para iniciar um novo set
function startNewSet() {
  player1Games.value = 0;
  player2Games.value = 0;
  tieBreakPlayer1.value = 0;
  tieBreakPlayer2.value = 0;
  isTieBreak.value = false;
}
</script>

<style scoped>
.tennis-game {
  text-align: center;
}

.scoreboard div {
  margin: 20px;
}

button {
  margin-top: 10px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}
</style>
