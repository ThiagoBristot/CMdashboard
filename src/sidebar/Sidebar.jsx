import React, { Component } from "react";
import "./sidebar.css";

//programas
import ManCliente from "../clientes/manutencao de clientes/Manclientes";

//icones
import { CgClose } from "react-icons/cg";
import { FiMenu } from "react-icons/fi";
import { FaPerson } from "react-icons/fa6";
import { CiDollar } from "react-icons/ci";
import { FaBasketShopping } from "react-icons/fa6";
import { BiPackage } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { FaRegNewspaper } from "react-icons/fa";

type State = {
    isOpen: boolean;
    isClientOpen: boolean;
    isFinanceOpen: boolean;
    isStockOpen: boolean;
    isModalGerenciarTiposOpen: boolean;
};

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

export default class SideBar extends Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            isOpen: false,
            isClientOpen: false,
            isFinanceOpen: false,
            isStockOpen: false,
        };
    }

    toggleSidebar = (): void => {
        const { isOpen, isClientOpen, isFinanceOpen, isModalGerenciarTiposOpen, isStockOpen } = this.state;
    
        if (
            isOpen &&
            (isClientOpen || isFinanceOpen  || isStockOpen)
        ) {
            this.setState({
                isClientOpen: false,
                isFinanceOpen: false,
                isStockOpen: false,
                isModalGerenciarTiposOpen: false,
            });
        }
    
        this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    }
    

    toggleClientList = (): void => {
        if (this.state.isOpen) {
            this.setState(prevState => ({ isClientOpen: !prevState.isClientOpen }));
        }
    }

    toggleFinanceList = (): void => {
        if (this.state.isOpen) {
            this.setState(prevState => ({ isFinanceOpen: !prevState.isFinanceOpen }));
        } 
    }

    toggleStockList = (): void => {
        if (this.state.isOpen) {
            this.setState(prevState => ({ isStockOpen: !prevState.isStockOpen }));
        }
    }

    // Função para abrir o modal de gerenciar tipos
    toggleModalGerenciarTipos = (): void => {
        this.setState(prevState => ({
            isModalGerenciarTiposOpen: !prevState.isModalGerenciarTiposOpen,
        }));
    };

    setActiveComponent = (componentName: string): void => {
        this.setState({ activeComponent: componentName });
    }
    
    renderComponent = (): JSX.Element | null => {
        const { activeComponent } = this.state;

        switch (activeComponent) {
            case "ClientMaintenance":
                return <ManCliente />;  // Componente para "Manutenção de Clientes"
            default:
                return null;  // Nenhuma tela ativa
        }
    }

    render() {
        const { isOpen, isClientOpen, isFinanceOpen, isOrdersOpen, isStockOpen, isModalGerenciarTiposOpen } = this.state;

        return (
            <div className='sidebar-div' style={{ width: isOpen ? '13vw' : '6vw' }}>
                <button className="sidebar-toggle-btn" onClick={this.toggleSidebar}>
                    {isOpen ? <CgClose /> : <FiMenu />}
                </button>

                <div id="sidebar" className="sidebar-links-div">
                    <ul className="sidebar-ul">
                        <li onClick={this.toggleClientList}>
                            <FaPerson /> {isOpen ? " Clientes" : ""}
                        </li>
                        {isClientOpen && (
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "start" }} className="sidebar-client-div">
                                <strong>
                                    <div onClick={() => this.props.onComponentSelect("ClientMaintenance")}><MdEdit style={{marginRight: "0.5vw"}}/>Manutenção de Clientes</div>
                                    <div onClick={() => this.props.onComponentSelect("ClientConsultation")}><FaRegNewspaper style={{marginRight: "0.5vw"}}/>Consulta de Clientes</div>
                                </strong>       
                            </div>
                        )}

                        <li onClick={this.toggleFinanceList}>
                            <CiDollar /> {isOpen ? " Financeiro" : ""}
                        </li>
                        {isFinanceOpen && (
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "start" }} className="sidebar-finance-div">
                                <strong>
                                    <div onClick={() => this.props.onComponentSelect("PaymentControl")}>Controle de entradas/saídas</div>
                                    <div onClick={() => this.props.onComponentSelect("FinanceReports")}>Relatórios Financeiros</div>
                                </strong>
                            </div>
                        )}

                        <li onClick={this.toggleStockList}>
                            <BiPackage /> {isOpen ? "Estoque" : ""}
                        </li>
                        {isStockOpen && (
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "start" }} className="sidebar-stock-div">
                                <strong>
                                    <div onClick={() => this.props.onComponentSelect("EstoqueControle")}>Controle de Estoque</div>
                                    <div onClick={() => this.props.onComponentSelect("EstoqueSaida")}>Saída de Itens</div>
                                    <div
                                         onClick={this.toggleModalGerenciarTipos}>Gerenciar Tipos de Produtos
                                    </div>
                                </strong>
                            </div>
                        )}
                        
                    </ul>
                </div>

                {/* Modal de Gerenciar Tipos */}
                <ModalGerenciarTipos
                    isOpen={isModalGerenciarTiposOpen}
                    onClose={this.toggleModalGerenciarTipos}  // Passando a função para fechar o modal
                />

                {/* Renderiza o componente ativo */}
                <div className="active-component-container">
                    {this.renderComponent()}
                </div>
            </div>
        );
    }
}
