import React, { Component } from "react";
import "./manclientes.css";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";

// Modal de Edição
class ModalEdicao extends Component {
  state = {
    nomeCliente: "",
    CPFCliente: "",
    enderecoCliente: "",
    telefoneCliente: "",
    emailCliente: "",
    idUltimoPedido: "",
    dataUltimoPedido: "",
  };

  componentDidUpdate(prevProps) {
    // Atualiza o estado com os dados do cliente quando o modal é aberto
    if (this.props.cliente !== prevProps.cliente && this.props.cliente) {
      const { cliente } = this.props;
      this.setState({
        nomeCliente: cliente.nomeCliente,
        CPFCliente: cliente.CPFcliente,
        enderecoCliente: cliente.enderecoCliente || "",
        telefoneCliente: cliente.telefoneCliente || "",
        emailCliente: cliente.emailCliente || "",
        idUltimoPedido: cliente.idUltimoPedido || "",
        dataUltimoPedido: cliente.dataUltimoPedido ? new Date(cliente.dataUltimoPedido).toISOString().substring(0, 10) : "",
      });
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSave = () => {
    const onSave = async (data) => {
      try {
        const response = await fetch(`http://localhost:5000/clientes/${data.idCliente}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error('Erro ao atualizar cliente');
        }

      } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
      }
    };
    
    const { cliente } = this.props;
    if (cliente) {
      onSave({ ...this.state, idCliente: cliente.idCliente }); 
    }
  };

  render() {
    const { isOpen, onClose } = this.props;
    const { nomeCliente, CPFCliente, enderecoCliente, telefoneCliente, emailCliente, idUltimoPedido, dataUltimoPedido } = this.state;

    if (!isOpen) {
      return null;
    }

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Editar Cliente</h2>
          <input
            type="text"
            name="nomeCliente"
            value={nomeCliente}
            onChange={this.handleChange}
            placeholder="Nome do cliente"
          />
          <input
            type="text"
            name="CPFCliente"
            value={CPFCliente}
            onChange={this.handleChange}
            placeholder="CPF do cliente"
          />
          <input
            type="text"
            name="enderecoCliente"
            value={enderecoCliente}
            onChange={this.handleChange}
            placeholder="Endereço do cliente"
          />
          <input
            type="text"
            name="telefoneCliente"
            value={telefoneCliente}
            onChange={this.handleChange}
            placeholder="Telefone do cliente"
          />
          <input
            type="email"
            name="emailCliente"
            value={emailCliente}
            onChange={this.handleChange}
            placeholder="Email do cliente"
          />
          <input
            type="text"
            name="idUltimoPedido"
            value={idUltimoPedido}
            onChange={this.handleChange}
            placeholder="ID do Último Pedido"
          />
          <input
            type="date"
            name="dataUltimoPedido"
            value={dataUltimoPedido}
            onChange={this.handleChange}
          />
          <div className="modal-buttons">
            <button onClick={onClose}>Fechar</button>
            <button onClick={() => { this.handleSave(); onClose(); }}>Salvar</button>
          </div>
        </div>
      </div>
    );
  }
}

// Modal de Cadastro
class ModalCadastro extends Component {
  state = {
    nomeCliente: "",
    CPFCliente: "",
    enderecoCliente: "",
    telefoneCliente: "",
    emailCliente: "",
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSave = () => {
    const { onSave } = this.props;
    onSave(this.state); // Passa todos os dados do novo cliente para o método onSave
  };

  render() {
    const { isOpen, onClose } = this.props;
    const { nomeCliente, CPFCliente, enderecoCliente, telefoneCliente, emailCliente } = this.state;

    if (!isOpen) {
      return null;
    }

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Cadastrar Novo Cliente</h2>
          <input
            type="text"
            name="nomeCliente"
            value={nomeCliente}
            onChange={this.handleChange}
            placeholder="Nome do cliente"
          />
          <input
            type="text"
            name="CPFCliente"
            value={CPFCliente}
            onChange={this.handleChange}
            placeholder="CPF do cliente"
          />
          <input
            type="text"
            name="enderecoCliente"
            value={enderecoCliente}
            onChange={this.handleChange}
            placeholder="Endereço do cliente"
          />
          <input
            type="text"
            name="telefoneCliente"
            value={telefoneCliente}
            onChange={this.handleChange}
            placeholder="Telefone do cliente"
          />
          <input
            type="email"
            name="emailCliente"
            value={emailCliente}
            onChange={this.handleChange}
            placeholder="Email do cliente"
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

export default class ManCliente extends Component {
  state = {
    clientes: [],
    clienteSelecionado: null,
    isModalOpen: false,
    isCadastroOpen: false,
    searchTerm: "",
  };

  componentDidMount() {
    this.fetchClientes();
  }

  fetchClientes = async () => {
    const response = await fetch("http://localhost:5000/clientes");
    const clientes = await response.json();
    this.setState({ clientes });
  };

  abrirModal = (cliente) => {
    this.setState({ clienteSelecionado: cliente, isModalOpen: true });
  };

  fecharModal = () => {
    this.setState({ isModalOpen: false, clienteSelecionado: null });
  };

  salvarCliente = async (cliente) => {
    await fetch(`http://localhost:5000/clientes/${cliente.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente),
    });
    this.fetchClientes();
    this.fecharModal();
  };

  deletarCliente = async (id) => {
    await fetch(`http://localhost:5000/clientes/${id}`, { method: "DELETE" });
    this.fetchClientes();
  };

  abrirCadastro = () => {
    this.setState({ isCadastroOpen: true });
  };

  fecharCadastro = () => {
    this.setState({ isCadastroOpen: false });
  };

  cadastrarCliente = async (novoCliente) => {
    await fetch("http://localhost:5000/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoCliente),
    });
    this.fetchClientes();
    this.fecharCadastro();
  };

  handleSearch = (e) => {
    this.setState({ searchTerm: e.target.value }); // Atualiza o termo de pesquisa
  };

  render() {
    const { clientes, clienteSelecionado, isModalOpen, isCadastroOpen, searchTerm } = this.state;

    // Filtrar os clientes com base no termo de pesquisa
    const filteredClientes = clientes.filter(cliente =>
      cliente.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefoneCliente.includes(searchTerm)
    );

    return (
      <section className="manclientes">
        <header className="manclientes-header">
          <h2>Manutenção de clientes</h2>
        </header>
        <nav className="manclientes-filtros">
          <section className="manclientes-section-filtros-addnew">
            <div className="manclientes-addnew-div">
              <h4>Novo cadastro:</h4>
              <button className="manclientes-addnew-btn" onClick={this.abrirCadastro}>
                <IoMdPersonAdd />
              </button>
            </div>
            {/*<h4 style={{ marginRight: "auto" }}>Filtrar por:</h4>
            <div className="manclientes-btns-div">
              <button className="manclientes-filter-btn">Cadastro mais recente</button>
              <button className="manclientes-filter-btn">Cadastro mais antigo</button>
              <button className="manclientes-filter-btn">Pedido mais recente</button>
              <button className="manclientes-filter-btn">Pedido mais antigo</button>
            </div>*/}
          </section>
          <div className="manclientes-input-div">
            <p>Digite o nome ou número de telefone do cadastro desejado:</p>
            <div className="manclientes-input-btn-div">
              <input
                type="text"
                placeholder="digite aqui"
                value={searchTerm}
                onChange={this.handleSearch} // Atualiza o termo de pesquisa
              />
            </div>
          </div>
        </nav>
        <div className="manclientes-lista">
          <div className="manclientes-colunas">
            <span>Nome</span>
            <span>CPF</span>
            <span>Endereço</span>
            <span>Telefone</span>
            <span>Email</span>
            <span className="cliente-dataUltimoPedido">Último Pedido</span>
          </div>
          <ul className="manclientes-lista-ul">
          {filteredClientes.map((cliente) => (
            <div key={cliente.id} className="manclientes-lista-divC">
              <li>
                <span>{cliente.nomeCliente}</span>
                <span>{cliente.CPFcliente}</span>
                <span>{cliente.enderecoCliente || "Endereço não informado"}</span>
                <span>{cliente.telefoneCliente || "Telefone não informado"}</span>
                <span>{cliente.emailCliente || "Email não informado"}</span>
                <span>{cliente.dataUltimoPedido ? new Date(cliente.dataUltimoPedido).toLocaleDateString() : "Data não informada"}</span>
              </li>
                <FaPencilAlt
                  className="manclientes-lista-divC-edit"
                  onClick={() => this.abrirModal(cliente)}
                />
                <MdDelete
                  className="manclientes-lista-divC-delete"
                  onClick={() => this.deletarCliente(cliente.idCliente)}
                />
              </div>
            ))}
          </ul>
        </div>
        {/* Modal de edição */}
        <ModalEdicao
          isOpen={isModalOpen}
          onClose={this.fecharModal}
          onSave={this.salvarCliente}
          cliente={clienteSelecionado}
        />

        {/* Modal de cadastro */}
        <ModalCadastro
          isOpen={isCadastroOpen}
          onClose={this.fecharCadastro}
          onSave={this.cadastrarCliente}
        />  
        
      </section>
    );
  }
}
