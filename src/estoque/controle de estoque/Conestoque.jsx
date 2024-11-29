import React, { Component } from "react";
import "./conestoque.css";
import { IoMdPersonAdd } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

class ModalCadastro extends Component {
    state = {
      nomeProduto: "",
      descricaoProduto: "",
      idTipoProduto: "",
      valorEntrada: "",
      valorSaida: "",
      numeroSerie: "",
    };
  
    handleChange = (e) => {
      this.setState({ [e.target.name]: e.target.value });
    };
  
    handleSave = () => {
      const { onSave } = this.props;
      onSave(this.state); // Passa todos os dados do novo produto para o método onSave
    };
  
    render() {
      const { isOpen, onClose } = this.props;
      const { nomeProduto, descricaoProduto, idTipoProduto, valorEntrada, valorSaida, numeroSerie } = this.state;
  
      if (!isOpen) {
        return null;
      }
  
      return (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Cadastrar Novo Produto</h2>
            <input
              type="text"
              name="nomeProduto"
              value={nomeProduto}
              onChange={this.handleChange}
              placeholder="Nome do produto"
            />
            <input
              type="text"
              name="descricaoProduto"
              value={descricaoProduto}
              onChange={this.handleChange}
              placeholder="Descrição do produto"
            />
            <select
                name="idTipoProduto"
                value={idTipoProduto}
                onChange={this.handleChange}
            >
                <option value="">Selecione o tipo</option>
                {this.props.tipoProduto.map((tipo) => (
                    <option key={tipo.idTipoProduto} value={tipo.idTipoProduto}>
                        {tipo.nomeTipoProduto}
                    </option>
                ))}
            </select>
            <button onClick={this.props.onGerenciarTipos}>Gerenciar Tipos</button>
            <input
              type="number"
              name="valorEntrada"
              value={valorEntrada}
              onChange={this.handleChange}
              placeholder="Valor de Entrada"
            />
            <input
              type="number"
              name="valorSaida"
              value={valorSaida}
              onChange={this.handleChange}
              placeholder="Valor de Saída"
            />
            <input
              type="text"
              name="numeroSerie"
              value={numeroSerie}
              onChange={this.handleChange}
              placeholder="Número de série (opcional)"
            />
            <div className="modal-buttons">
              <button onClick={onClose}>Fechar</button>
              <button onClick={() => { this.handleSave(); onClose(); }}>Cadastrar</button>
            </div>
          </div>
        </div>
      );
    }
}

class ModalGerenciarTipos extends Component {
    state = {
        tipos: [],
        novoTipo: "",
        tipoSelecionado: null,
    };

    componentDidMount() {
        this.buscarTipos();
    }

    buscarTipos = () => {
        fetch("http://localhost:5000/tipoprodutos")
            .then((response) => response.json())
            .then((data) => this.setState({ tipos: data }))
            .catch((error) => console.error("Erro ao buscar tipos:", error));
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    adicionarTipo = () => {
        fetch("http://localhost:5000/tipoprodutos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nomeTipoProduto: this.state.novoTipo }),
        })
            .then(() => {
                this.setState({ novoTipo: "" });
                this.buscarTipos();
            })
            .catch((error) => console.error("Erro ao adicionar tipo:", error));
    };

    editarTipo = (tipo) => {
        fetch(`http://localhost:5000/tipoprodutos/${tipo.idTipoProduto}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nomeTipoProduto: tipo.nomeTipoProduto }),
        })
            .then(() => this.buscarTipos())
            .catch((error) => console.error("Erro ao editar tipo:", error));
    };

    excluirTipo = (idTipoProduto) => {
        fetch(`http://localhost:5000/tipoprodutos/${idTipoProduto}`, {
            method: "DELETE",
        })
            .then(() => this.buscarTipos())
            .catch((error) => console.error("Erro ao excluir tipo:", error));
    };

    render() {
        const { isOpen, onClose } = this.props;
        const { tipos, novoTipo } = this.state;

        if (!isOpen) return null;

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Gerenciar Tipos de Produtos</h2>
                    <input
                        type="text"
                        name="novoTipo"
                        value={novoTipo}
                        onChange={this.handleChange}
                        placeholder="Novo tipo"
                    />
                    <button className='gerenciartipos-btn-adicionar' onClick={this.adicionarTipo}>Adicionar</button>
                    <ul>
                        {tipos.map((tipo) => (
                            <li key={tipo.idTipoProduto}>
                                <input
                                    type="text"
                                    value={tipo.nomeTipoProduto}
                                    onChange={(e) =>
                                        this.setState({
                                            tipos: tipos.map((t) =>
                                                t.idTipoProduto === tipo.idTipoProduto
                                                    ? { ...t, nomeTipoProduto: e.target.value }
                                                    : t
                                            ),
                                        })
                                    }
                                />
                                <button className='gerenciartipos-btn-salvar' onClick={() => this.editarTipo(tipo)}>Salvar</button>
                                <button className='gerenciartipos-btn-excluir' onClick={() => this.excluirTipo(tipo.idTipoProduto)}>
                                    Excluir
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={onClose}>Fechar</button>
                </div>
            </div>
        );
    }
}

export default class ConEstoque extends Component {
    constructor(props) {
        super(props);
        this.state = {
            produtos: [],
            produtoSelecionado: null,
            isModalOpen: false,
            isCadastroOpen: false,
            searchTerm: '',
            tipoProduto: [],
            isTipoModalOpen: false,
        };
    }

    componentDidMount() {
        this.buscarProdutos();
    }

    buscarProdutos = () => {
        fetch('https://quiet-carefully-elk.ngrok-free.app/produtos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "ngrok-skip-browser-warning": "true",
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();  // Converte a resposta para JSON
            } else {
                throw new Error('Erro ao obter dados');
            }
        })
        .then(data => {
            console.log('Produtos recebidos:', data);
            // Aqui você pode manipular os dados de acordo com sua necessidade
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    };

    buscarTipos = () => {
        fetch("http://localhost:5000/tipoprodutos")
            .then((response) => response.json())
            .then((data) => this.setState({ tipoProduto: data }))
            .catch((error) => console.error("Erro ao buscar tipos:", error));
    };

    abrirModal = (produto) => {
        this.buscarTipos();
        this.setState({ produtoSelecionado: produto, isModalOpen: true });
    };

    fecharModal = () => {
        this.setState({ produtoSelecionado: null, isModalOpen: false });
    };

    deletarProduto = (idProduto) => {
        fetch(`http://localhost:5000/produtos/${idProduto}`, {
            method: "DELETE"
        })
            .then(() => {
                this.buscarProdutos();
            })
            .catch((error) => console.error("Erro ao deletar produto:", error));
    };

    atualizarProduto = (event) => {
        event.preventDefault();
        const { produtoSelecionado } = this.state;

        fetch(`http://localhost:5000/produtos/${produtoSelecionado.idProduto}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nomeProduto: produtoSelecionado.nomeProduto,
                descricaoProduto: produtoSelecionado.descricaoProduto,
                idTipoProduto: produtoSelecionado.idTipoProduto,
                valorEntrada: produtoSelecionado.valorEntrada,
                valorSaida: produtoSelecionado.valorSaida
            })
        })
            .then((response) => {
                if (response.ok) {
                    this.fecharModal();
                    this.buscarProdutos();
                } else {
                    console.error("Erro ao atualizar o produto");
                }
            })
            .catch((error) => console.error("Erro na requisição:", error));
    };

    abrirCadastro = () => {
        this.buscarTipos();
        this.setState({ isCadastroOpen: true });
    };
    
    fecharCadastro = () => {
        this.setState({ isCadastroOpen: false });
    };
    
    cadastrarProduto = async (novoProduto) => {
        await fetch("http://localhost:5000/produtos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novoProduto),
        });
        this.buscarProdutos();
        this.fecharCadastro();
      };

    onGerenciarTipos = () => {
        console.log("Abrindo modal de Gerenciar Tipos...");
        this.setState({ isTipoModalOpen: true });
    };
    
    fecharGerenciarTipos = () => {
        this.setState({ isTipoModalOpen: false });
    };

    handleSearch = (e) => {
        this.setState({ searchTerm: e.target.value }); // Atualiza o termo de pesquisa
    };
    
    render() {
        const { produtos, produtoSelecionado, isModalOpen, isCadastroOpen, searchTerm } = this.state;

        const filteredProdutos = produtos.filter(produto =>
            produto.nomeProduto.toLowerCase().includes(searchTerm.toLowerCase())
          );

        return (
        <div className="conestoque">
            <header className="conestoque-header"><h1>Controle de Estoque</h1></header>
            <section className="conestoque-section">
                <div className="conestoque-addnew-div">
                    <h4>Novo produto:</h4>
                    <button className="conestoque-addnew-btn" onClick={this.abrirCadastro}>
                        <IoMdPersonAdd />
                    </button>
                </div>

                <h4 style={{ marginRight: "auto" }}>Filtrar por:</h4>
                <div className="conestoque-btns-div">
                    <button className="conestoque-filter-btn">Cadastro mais recente</button>
                    <button className="conestoque-filter-btn">Cadastro mais antigo</button>
                    <button className="conestoque-filter-btn">Pedido mais recente</button>
                    <button className="conestoque-filter-btn">Pedido mais antigo</button>
                </div>
                <div className="conestoque-input-div">
                    <p>Digite o nome do produto desejado:</p>
                    <div className="conestoque-input-btn-div">
                    <input
                        type="text"
                        placeholder="digite aqui"
                        value={searchTerm}
                        onChange={this.handleSearch} // Atualiza o termo de pesquisa
                    />
                    </div>
                </div>

                <div className="conestoque-div-colunas">
                    <span>Nome</span>
                    <span>Descrição</span>
                    <span>Tipo</span>
                    <span>Valor de Entrada</span>
                    <span>Valor de Saída</span>
                    <span>Ações</span>
                </div>
                <div className="conestoque-div-produtos">
                    <ul>
                        {filteredProdutos.map((produto) => (
                            <li key={produto.idProduto} className="produto-item">
                                <span>{produto.nomeProduto}</span>
                                <span>{produto.descricaoProduto}</span>
                                <span>{produto.nomeTipoProduto}</span>
                                <span>R$ {produto.valorEntrada}</span>
                                <span>R$ {produto.valorSaida}</span>
                                <div>
                                    <FaPencilAlt
                                        className="conestoque-edit"
                                        onClick={() => this.abrirModal(produto)}
                                    />
                                    <MdDelete
                                        className="conestoque-delete"
                                        onClick={() => this.deletarProduto(produto.idProduto)}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={this.fecharModal}>X</span>
                        <h2>Editar Produto</h2>
                        <form onSubmit={this.atualizarProduto}>
                            <label>Nome</label>
                            <input
                                type="text"
                                value={produtoSelecionado.nomeProduto}
                                onChange={(e) =>
                                    this.setState({
                                        produtoSelecionado: {
                                            ...produtoSelecionado,
                                            nomeProduto: e.target.value
                                        }
                                    })
                                }
                            />
                            <label>Descrição</label>
                            <input
                                type="text"
                                value={produtoSelecionado.descricaoProduto}
                                onChange={(e) =>
                                    this.setState({
                                        produtoSelecionado: {
                                            ...produtoSelecionado,
                                            descricaoProduto: e.target.value
                                        }
                                    })
                                }
                            />
                            <label>Tipo</label>
                            <input
                                type="number"
                                value={produtoSelecionado.idTipoProduto}
                                onChange={(e) =>
                                    this.setState({
                                        produtoSelecionado: {
                                            ...produtoSelecionado,
                                            idTipoProduto: e.target.value
                                        }
                                    })
                                }
                            />
                            <label>Valor de Entrada</label>
                            <input
                                type="number"
                                value={produtoSelecionado.valorEntrada}
                                onChange={(e) =>
                                    this.setState({
                                        produtoSelecionado: {
                                            ...produtoSelecionado,
                                            valorEntrada: e.target.value
                                        }
                                    })
                                }
                            />
                            <label>Valor de Saída</label>
                            <input
                                type="number"
                                value={produtoSelecionado.valorSaida}
                                onChange={(e) =>
                                    this.setState({
                                        produtoSelecionado: {
                                            ...produtoSelecionado,
                                            valorSaida: e.target.value
                                        }
                                    })
                                }
                            />
                            <button type="submit">Salvar</button>
                        </form>
                    </div>
                </div>
            )}
        {/* Modal de cadastro */}
        <ModalCadastro
          isOpen={isCadastroOpen}
          onClose={this.fecharCadastro}
          onSave={this.cadastrarProduto}
          tipoProduto={this.state.tipoProduto}
          onGerenciarTipos={this.onGerenciarTipos}
        />

        <ModalGerenciarTipos 
            isOpen={this.state.isTipoModalOpen} 
            onClose={this.fecharGerenciarTipos} 
        />
        </div>
    );
}
}   