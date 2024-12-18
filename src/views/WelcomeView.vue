<template>
    <div class="page-container d-flex">
      <!-- Coluna da imagem -->
      <div class="col-md-6 p-0 position-relative image-container">
        <img
          src="@/assets/banner-tennis.jpg"
          alt="Banner Scoreboard"
          class="img-fluid w-100 h-100"
          style="object-fit: cover"
        />
      </div>
  
      <!-- Coluna do conteúdo -->
      <div
        class="col-md-6 d-flex flex-column justify-content-center align-items-center"
        style="background-color: #f9f9f9;"
      >
        <div class="w-75">
          <!-- Logo -->
          <div class="text-center mb-4">
            <h1 class="fw-bold text-uppercase">
              Seja <span class="text-orange">Bem-Vindo</span> Ao
              <span class="text-blue"><strong>Scoreboard</strong></span>
            </h1>
          </div>
       
          <!-- Cards -->
          <div class="row g-3 mb-4">
            <h6 class="text-center mb-4">Solução para a gestão de placares e resultados! Foi desenvolvida para oferecer uma experiência dinâmica e interativa no acompanhamento de pontuações, ideal para eventos esportivos, competições e jogos digitais.</h6>
            <h5 class="mb-3">Recursos Principais:</h5>
            <div
              class="col-6"
              v-for="(item, index) in cardData"
              :key="index"
              @click="openModal(item)"
            >
              <div class="card text-center shadow-sm card-hover p-3">
                <h6 class="fw-bold">{{ item.title }}</h6>
              </div>
            </div>
          </div>
  
          <!-- Modal -->
          <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content p-4">
              <h4 class="fw-bold mb-3">{{ selectedItem.title }}</h4>
              <p>{{ selectedItem.description }}</p>
              <button class="btn btn-danger" @click="closeModal">Fechar</button>
            </div>
          </div>
  
          <!-- Botão Começar -->
          <div class="d-grid">
            <button @click="handleStart" class="btn btn-danger btn-lg">
              Começar
            </button>
          </div>
          <h6 class="mt-4 text-center">
            Pronto para elevar a experiência do seu evento? Comece agora! 🚀
          </h6>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  
  // Instância do Router
  const router = useRouter();
  
  // Função para gerar número aleatório
  const generateRandomNumber = () => {
    return Math.floor(10000 + Math.random() * 90000);
  };
  
  // Função do botão "Começar"
  const handleStart = () => {
    const randomNumber = generateRandomNumber();
    router.push(`/home?code=${randomNumber}`);
  };
  
  // Dados dos cards
  const cardData = [
    {
      title: "🏆 Resultados em Tempo Real",
      description: "Atualizações automáticas e sem esforço.",
    },
    {
      title: "💡 Fácil de Usar",
      description: "Interface amigável e intuitiva, sem complicação.",
    },
    {
      title: "⚙️ Altamente Personalizável",
      description:
        "Ajuste os placares conforme as regras e identidade do seu evento.",
    },
    {
      title: "🔔 Engajamento Garantido",
      description:
        "Mantenha o público informado e conectado durante toda a competição.",
    },
  ];
  
  // Estado da modal
  const showModal = ref(false);
  const selectedItem = ref(null);
  
  // Função para abrir modal
  const openModal = (item) => {
    selectedItem.value = item;
    showModal.value = true;
  };
  
  // Função para fechar modal
  const closeModal = () => {
    showModal.value = false;
    selectedItem.value = null;
  };
  </script>
  
  <style scoped>
  /* Container principal */
  .page-container {
    overflow: hidden;
    height: 100vh;
  }
  
  /* Estilo do texto */
  .text-orange {
    color: #f36c21;
  }
  
  .text-blue {
    color: #033380;
  }
  
  /* Estilo dos cards */
  .card {
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    background-color: #fff;
    border: none;
  }
  
  .card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  /* Imagem com gradiente */
  .image-container {
    position: relative;
  }
  
  .image-container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.5) 50%,
      rgba(0, 0, 0, 0.5) 50%
    );
    z-index: 1;
  }
  
  img {
    position: relative;
    z-index: 0;
    object-fit: cover;
  }
  
  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: #fff;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  }
  
  .modal-content button {
    display: block;
    margin: 0 auto;
  }
  </style>
  