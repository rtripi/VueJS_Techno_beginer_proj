const vm = new Vue({
  el: "#app",
  data: {
    produtos: {},
    produto: false,
  },
  filters: {
    numeroPreco(valor) {
      return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  methods: {
    fecharModal({ target, currentTarget }) {
      if (target === currentTarget) this.produto = false;
    },
    fetchProdutos() {
      fetch("./api/produtos.json")
        .then((r) => r.json())
        .then((r) => (this.produtos = r));
    },

    abrirModal(id) {
      this.fetchProduto(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then((r) => r.json())
        .then((r) => (this.produto = r));
    },
  },

  created() {
    this.fetchProdutos();
  },
});
