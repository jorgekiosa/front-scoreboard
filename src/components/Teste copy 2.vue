<template>
  <div class="tennis-game">
    <h1>Tênis - Jogo</h1>

    <!-- Opções de tipo de set -->
    <div>
      <label>
        <input type="radio" v-model="setType" value="normal" />
        Set Normal
      </label>
      <label>
        <input type="radio" v-model="setType" value="pontosCorridos" />
        Set com Pontos Corridos
      </label>
    </div>

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

    <div v-if="gameOver">
      <h2>Fim de Jogo!</h2>
      <p>Vencedor: {{ winner }}</p>
    </div>

    <div v-if="currentSet > 0">
      <h3>Placar dos Sets</h3>
      <p>Jogador 1: Set 1 - {{ setPlayer1.set1 }} | Set 2 - {{ setPlayer1.set2 }} | Set 3 - {{ setPlayer1.set3 }}</p>
      <p>Jogador 2: Set 1 - {{ setPlayer2.set1 }} | Set 2 - {{ setPlayer2.set2 }} | Set 3 - {{ setPlayer2.set3 }}</p>
    </div>

    <!-- Exibe as opções de regra de Deuce quando o placar estiver 40-40 -->
    <div v-if="player1Score === 40 && player2Score === 40">
      <h3>Escolha a regra do Deuce:</h3>
      <label>
        <input type="radio" v-model="deuceRule" value="advantage" />
        Vantagem (2 pontos consecutivos para vencer)
      </label>
      <label>
        <input type="radio" v-model="deuceRule" value="goldenPoint" />
        Ponto de Ouro (quem fizer o próximo ponto vence)
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch  } from 'vue';

// Estados para pontos, games e sets
const player1Score = ref(0);
const player2Score = ref(0);
const player1Games = ref(0);
const player2Games = ref(0);
const currentSet = ref(1);
const player1Sets = ref(0);
const player2Sets = ref(0);
const gameOver = ref(false); // Estado para indicar fim de jogo

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


// Tipo de set (normal ou pontos corridos)
const setType = ref('normal'); // "normal" é o tipo de set padrão

// Regra do Deuce
const deuceRule = ref(''); // Pode ser 'advantage' ou 'goldenPoint'

// Computed para determinar o vencedor do set
const setWinner = computed(() => {
  if (setType.value === 'normal') {
    if (player1Games.value >= 6 && player1Games.value - player2Games.value >= 2) {
      return 'Jogador 1';
    } else if (player2Games.value >= 6 && player2Games.value - player1Games.value >= 2) {
      return 'Jogador 2';
    }
    if (player1Games.value === 6 && player2Games.value === 6) {
      isTieBreak.value = true;
      return 'Tie-Break';
    }
  } else if (setType.value === 'pontosCorridos') {
    if (player1Games.value === 9) {
      return 'Jogador 1';
    } else if (player2Games.value === 9) {
      return 'Jogador 2';
    }
    if (player1Games.value === 9 && player2Games.value === 9) {
      isTieBreak.value = true;
      return 'Tie-Break';
    }
  }
  return 'Nenhum';
});

// Computed para determinar o vencedor final
const winner = computed(() => {
  if (gameOver.value) {
    return player1Sets.value > player2Sets.value ? 'Jogador 1' : 'Jogador 2';
  }
  return 'Jogo em andamento';
});

// Funções para incrementar os pontos
function incrementPlayer1() {
  if (player1Score.value === 40 && player2Score.value === 40) {
    applyDeuceRule('player1');
  } else if (player1Score.value === 40) {
    // Finaliza o game quando um jogador chega a 40
    player1Score.value = 0;
    player2Score.value = 0;
    player1Games.value++;
    updateSetScore('player1');
    checkSetWinner();
  } else {
    // Incrementa os pontos conforme a lógica normal
    player1Score.value = nextScore(player1Score.value);
  }
}

function incrementPlayer2() {
  if (player2Score.value === 40 && player1Score.value === 40) {
    applyDeuceRule('player2');
  } else if (player2Score.value === 40) {
    // Finaliza o game quando um jogador chega a 40
    player2Score.value = 0;
    player1Score.value = 0;
    player2Games.value++;
    updateSetScore('player2');
    checkSetWinner();
  } else {
    // Incrementa os pontos conforme a lógica normal
    player2Score.value = nextScore(player2Score.value);
  }
}

function decrementPlayer1() {
  if (player1Score.value === 0) return; // Evita pontuação negativa
  if (player1Score.value === 15) {
    player1Score.value = 0;
  } else if (player1Score.value === 30) {
    player1Score.value = 15;
  } else if (player1Score.value === 40) {
    player1Score.value = 30;
  } else if (player1Score.value === 40 && player2Score.value === 40 && deuceRule.value === 'advantage') {
    // Remove a vantagem do Jogador 1 no caso de Deuce com regra de vantagem
    player1Score.value = 40;
    player2Score.value = 40;
  }
}

function decrementPlayer2() {
  if (player2Score.value === 0) return; // Evita pontuação negativa
  if (player2Score.value === 15) {
    player2Score.value = 0;
  } else if (player2Score.value === 30) {
    player2Score.value = 15;
  } else if (player2Score.value === 40) {
    player2Score.value = 30;
  } else if (player2Score.value === 40 && player1Score.value === 40 && deuceRule.value === 'advantage') {
    // Remove a vantagem do Jogador 2 no caso de Deuce com regra de vantagem
    player2Score.value = 40;
    player1Score.value = 40;
  }
}


// Função que aplica a regra do Deuce (Vantagem ou Ponto de Ouro)
function applyDeuceRule(winner) {
  if (deuceRule.value === 'advantage') {
    // Se um jogador alcançar a vantagem, ele precisa ganhar mais um ponto
    if (winner === 'player1') {
      player1Score.value = 40; // Vantagem para Jogador 1
      player2Score.value = 30;
    } else {
      player2Score.value = 40; // Vantagem para Jogador 2
      player1Score.value = 30;
    }
  } else if (deuceRule.value === 'goldenPoint') {
    // Primeiro jogador a fazer um ponto vence o game
    if (winner === 'player1') {
      player1Score.value = 0;
      player2Score.value = 0;
      player1Games.value++;
      updateSetScore('player1');
      checkSetWinner();
    } else {
      player2Score.value = 0;
      player1Score.value = 0;
      player2Games.value++;
      updateSetScore('player2');
      checkSetWinner();
    }
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
    if (setType.value === 'pontosCorridos' || player1Sets.value === 2) {
      // Fim de jogo para pontos corridos ou quando um jogador vence dois sets consecutivos
      gameOver.value = true;
    } else if (player1Sets.value < 3) {
      currentSet.value++;
    }
  } else if (setWinner.value === 'Jogador 2') {
    player2Sets.value++;
    updateSetScore('player2');
    resetGame();
    if (setType.value === 'pontosCorridos' || player2Sets.value === 2) {
      // Fim de jogo para pontos corridos ou quando um jogador vence dois sets consecutivos
      gameOver.value = true;
    } else if (player2Sets.value < 3) {
      currentSet.value++;
    }
  }
}

// Função para atualizar o placar do set atual
function updateSetScore(player, isTieBreak = false) {
  if (player === 'player1') {
    if (currentSet.value === 1) {
      setPlayer1.value.set1 = isTieBreak ? 7 : player1Games.value;
    } else if (currentSet.value === 2) {
      setPlayer1.value.set2 = isTieBreak ? 7 : player1Games.value;
    } else if (currentSet.value === 3) {
      setPlayer1.value.set3 = isTieBreak ? 7 : player1Games.value;
    }
  } else if (player === 'player2') {
    if (currentSet.value === 1) {
      setPlayer2.value.set1 = isTieBreak ? 7 : player2Games.value;
    } else if (currentSet.value === 2) {
      setPlayer2.value.set2 = isTieBreak ? 7 : player2Games.value;
    } else if (currentSet.value === 3) {
      setPlayer2.value.set3 = isTieBreak ? 7 : player2Games.value;
    }
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

// Função para verificar o vencedor do Tie-Break
function checkTieBreakWinner() {
  if (tieBreakPlayer1.value >= 7 && tieBreakPlayer1.value - tieBreakPlayer2.value >= 2) {
    player1Sets.value++;
    updateSetScore('player1', true); // Ajuste para marcar como 7-6 após Tie-Break
    resetTieBreak();
    if (player1Sets.value === 2) {
      gameOver.value = true; // Jogador 1 venceu dois sets consecutivos
    } else if (player1Sets.value < 3) {
      currentSet.value++;
    }
  } else if (tieBreakPlayer2.value >= 7 && tieBreakPlayer2.value - tieBreakPlayer1.value >= 2) {
    player2Sets.value++;
    updateSetScore('player2', true); // Ajuste para marcar como 7-6 após Tie-Break
    resetTieBreak();
    if (player2Sets.value === 2) {
      gameOver.value = true; // Jogador 2 venceu dois sets consecutivos
    } else if (player2Sets.value < 3) {
      currentSet.value++;
    }
  }
}

// Função para resetar a pontuação do game
function resetGame() {
  player1Score.value = 0;
  player2Score.value = 0;
  player1Games.value = 0;
  player2Games.value = 0;
}

// Função para resetar o Tie-Break
function resetTieBreak() {
  tieBreakPlayer1.value = 0;
  tieBreakPlayer2.value = 0;
  isTieBreak.value = false;
  resetGame();
}

// Função para resetar o jogo
function resetMatch() {
  player1Score.value = 0;
  player2Score.value = 0;
  player1Games.value = 0;
  player2Games.value = 0;
  player1Sets.value = 0;
  player2Sets.value = 0;
  tieBreakPlayer1.value = 0;
  tieBreakPlayer2.value = 0;
  isTieBreak.value = false;
  gameOver.value = false;
  currentSet.value = 1;

  setPlayer1.value = {
    set1: 0,
    set2: null,
    set3: null,
  };
  setPlayer2.value = {
    set1: 0,
    set2: null,
    set3: null,
  };
}

// Watch para resetar o jogo ao alterar o tipo de set
watch(setType, () => {
  resetMatch();
});

// Função para iniciar um novo set
function startNewSet() {
  if (setType.value === 'pontosCorridos') {
    console.warn('Somente um set permitido no modo Pontos Corridos.');
    return;
  }
  player1Games.value = 0;
  player2Games.value = 0;
  tieBreakPlayer1.value = 0;
  tieBreakPlayer2.value = 0;
  isTieBreak.value = false;
  currentSet.value++;
}
/* function startNewSet() {
  player1Games.value = 0;
  player2Games.value = 0;
  tieBreakPlayer1.value = 0;
  tieBreakPlayer2.value = 0;
  isTieBreak.value = false;
} */
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
