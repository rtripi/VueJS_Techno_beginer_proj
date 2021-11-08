const vm = new Vue({
  el: "#app",
  data: {
    produtos: {},
    produto: false,
    mensagemAlerta: "Item adicionado",
    carrinho: [],
    carrinhoAtivo: false,
    alertaAtivo: false,
  },
  filters: {
    numeroPreco(valor) {
      return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  computed: {
    carrinhoTotal() {
      let total = 0;
      if (this.carrinho.length) {
        this.carrinho.forEach((item) => {
          total += item.preco;
        });
      }
      return total;
    },
  },
  methods: {
    fecharModal({ target, currentTarget }) {
      if (target === currentTarget) this.produto = false;
    },

    clickForaCarrinho({ target, currentTarget }) {
      if (target === currentTarget) this.carrinhoAtivo = false;
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

    adicionarItem() {
      this.produto.estoque--;
      const { id, nome, preco } = this.produto;
      this.carrinho.push({ id, nome, preco });
      this.alerta(`Item adicionado ao carrinho`);
      console.log(this.CarrinhoAtivo);
    },

    removerItem(index) {
      this.carrinho.splice(index, 1);
    },

    checarLocalStorage() {
      if (window.localStorage.carrinho) {
        this.carrinho = JSON.parse(window.localStorage.carrinho);
      }
    },

    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then((r) => r.json())
        .then((r) => (this.produto = r));
    },
    alerta(mensagem) {
      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true;
      setTimeout(() => {
        this.alertaAtivo = false;
      }, 1000);
    },

    router() {
      const hash = document.location.hash;

      if (hash) this.fetchProduto(hash.replace("#%20", ""));
    },

    compararStorage() {
      const items = this.carrinho.filter((item) => item.id === this.produto.id);

      this.produto.estoque -= items.length;
    },
  },

  watch: {
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    },
    produto() {
      const hash = this.produto.id || "";
      document.title = this.produto.nome || "Techno";
      history.pushState(null, null, `# ${hash}`);
      if (this.produto) this.compararStorage();
    },
  },

  created() {
    this.fetchProdutos();
    this.router();
    this.checarLocalStorage();
  },
});
