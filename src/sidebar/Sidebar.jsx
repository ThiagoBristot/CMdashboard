import React, { Component } from "react";
import "./sidebar.css";

//icones
import { CgClose } from "react-icons/cg";
import { FiMenu } from "react-icons/fi";
import { FaPerson } from "react-icons/fa6";
import { CiDollar } from "react-icons/ci";
import { CiInboxIn, CiInboxOut  } from "react-icons/ci";
import { BiPackage } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { FaRegNewspaper } from "react-icons/fa";
import { TbZoomMoney } from "react-icons/tb";
import { CgArrowTopRightO } from "react-icons/cg";


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
        novoTipoDesc: "",
        tipoSelecionado: null,
    };

    componentDidMount() {
        this.buscarTipos();
    }

    buscarTipos = () => {
        const authToken = 'ak_2pXWf6mAlrMYNVuI7bhf4mSw1pW';
        fetch('https://quiet-carefully-elk.ngrok-free.app/tipoprodutos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
                'ngrok-skip-browser-warning': 1
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
            console.log('tipos recebidos no modal de gerenciamento:', data);
            this.setState({ tipos: data });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleChangeDesc = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    adicionarTipo = () => {
        console.log('Dados para adicionar tipo:', {
            nomeTipoProduto: this.state.novoTipo, 
            descricaoTipoProduto: this.state.novoTipoDesc 
        });
    
        fetch("https://quiet-carefully-elk.ngrok-free.app/tipoprodutos", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ 
                nomeTipoProduto: this.state.novoTipo, 
                descricaoTipoProduto: this.state.novoTipoDesc 
            }),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text);
                });
            }
            return response.json();
        })
        .then((data) => {
            console.log('Resposta do servidor ao adicionar tipo:', data);
            this.setState({ novoTipo: "", novoTipoDesc: "" });
            this.buscarTipos();
        })
        .catch((error) => {
            console.error("Erro ao adicionar tipo:", error);
        });
    };
    
    editarTipo = (tipo) => {
        fetch(`https://quiet-carefully-elk.ngrok-free.app/tipoprodutos/${tipo.idTipoProduto}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                nomeTipoProduto: tipo.nomeTipoProduto, 
                descricaoTipoProduto: tipo.descricaoTipoProduto 
            }),
        })
            .then(() => this.buscarTipos())
            .catch((error) => console.error("Erro ao editar tipo:", error));
    };

    excluirTipo = (idTipoProduto) => {
        fetch(`https://quiet-carefully-elk.ngrok-free.app/tipoprodutos/${idTipoProduto}`, {
            method: "DELETE",
        })
            .then(() => this.buscarTipos())
            .catch((error) => console.error("Erro ao excluir tipo:", error));
    };

    render() {
        const { isOpen, onClose } = this.props;
        const { tipos, novoTipo, novoTipoDesc } = this.state;

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
                    <input
                        type="text" 
                        name="novoTipoDesc"
                        value={this.state.novoTipoDesc}
                        onChange={this.handleChangeDesc}
                        placeholder="Descrição do novo tipo"
                    />
                    <button className='gerenciartipos-btn-adicionar' onClick={this.adicionarTipo}>Adicionar</button>
                    <ul style={{width: "90%"}}>
                        {tipos.map((tipo) => (
                            <li key={tipo.idTipoProduto} style={{display: "flex", flexDirection: "column", width: "90%", justifyContent: "center", alignItems: "center"}}>
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
                                    placeholder="Nome do Tipo"
                                />
                                <input
                                    type="text"
                                    value={tipo.descricaoTipoProduto}
                                    onChange={(e) =>
                                        this.setState({
                                            tipos: tipos.map((t) =>
                                                t.idTipoProduto === tipo.idTipoProduto
                                                    ? { ...t, descricaoTipoProduto: e.target.value }
                                                    : t
                                            ),
                                        })
                                    }
                                    placeholder="Descrição do Tipo"
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
            isModalGerenciarTiposOpen: false,
        };
    }

    handleClientListClick = (): void => {
        this.setState(prevState => {
            // If sidebar is not open, open it and the client list
            if (!prevState.isOpen) {
                return {
                    isOpen: true,
                    isClientOpen: true,
                };
            }
            
            // If sidebar is open and client list is not open, open it
            if (!prevState.isClientOpen) {
                return {
                    ...prevState,
                    isClientOpen: true,
                };
            }
            
            // If client list is already open, close it
            return {
                ...prevState,
                isClientOpen: false,
            };
        });
    }

    handleFinanceListClick = (): void => {
        this.setState(prevState => {
            // If sidebar is not open, open it and the finance list
            if (!prevState.isOpen) {
                return {
                    isOpen: true,
                    isFinanceOpen: true,
                };
            }
            
            // If sidebar is open and finance list is not open, open it
            if (!prevState.isFinanceOpen) {
                return {
                    ...prevState,
                    isFinanceOpen: true,
                };
            }
            
            // If finance list is already open, close it
            return {
                ...prevState,
                isFinanceOpen: false,
            };
        });
    }

    handleStockListClick = (): void => {
        this.setState(prevState => {
            // If sidebar is not open, open it and the stock list
            if (!prevState.isOpen) {
                return {
                    isOpen: true,
                    isStockOpen: true,
                };
            }
            
            // If sidebar is open and stock list is not open, open it
            if (!prevState.isStockOpen) {
                return {
                    ...prevState,
                    isStockOpen: true,
                };
            }
            
            // If stock list is already open, close it
            return {
                ...prevState,
                isStockOpen: false,
            };
        });
    }

    toggleModalGerenciarTipos = (): void => {
        this.setState(prevState => {
            // If sidebar is not open, open it
            if (!prevState.isOpen) {
                return {
                    isOpen: true,
                    isModalGerenciarTiposOpen: true,
                    isClientOpen: false,
                    isFinanceOpen: false,
                    isStockOpen: false
                };
            }
            
            // If sidebar is open, toggle the modal
            return {
                ...prevState,
                isModalGerenciarTiposOpen: !prevState.isModalGerenciarTiposOpen,
                isClientOpen: false,
                isFinanceOpen: false,
                isStockOpen: false
            };
        });
    }

    toggleSidebar = (): void => {
        this.setState(prevState => ({ 
            isOpen: !prevState.isOpen,
            isClientOpen: false,
            isFinanceOpen: false,
            isStockOpen: false,
            isModalGerenciarTiposOpen: false
        }));
    }

    render() {
        const { isOpen, isClientOpen, isFinanceOpen, isStockOpen, isModalGerenciarTiposOpen } = this.state;

        return (
            <div className='sidebar-div' style={{ width: isOpen ? '13vw' : '6vw' }}>
                <button className="sidebar-toggle-btn" onClick={this.toggleSidebar}>
                    {isOpen ? <CgClose /> : <FiMenu />}
                </button>

                <div id="sidebar" className="sidebar-links-div">
                    <ul className="sidebar-ul">
                        <li 
                            onClick={this.handleClientListClick} 
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            <FaPerson /> {isOpen ? " Clientes" : ""}
                        </li>
                        {isClientOpen && (
                            <div style={{ 
                                display: "flex", 
                                flexDirection: "column", 
                                justifyContent: "start", 
                                alignItems: "start" 
                            }} className="sidebar-client-div">
                                <strong>
                                    <div 
                                        onClick={() => this.props.onComponentSelect("ClientMaintenance")} 
                                        style={{
                                            gap: "1rem", 
                                            cursor: 'pointer', 
                                            display: 'flex', 
                                            alignItems: 'center'
                                        }}
                                    >
                                        <MdEdit style={{width: "2rem", height: "auto"}}/> Manutenção de Clientes
                                    </div>
                                    <div 
                                        onClick={() => this.props.onComponentSelect("ClientConsultation")} 
                                        style={{
                                            gap: "1rem", 
                                            cursor: 'pointer', 
                                            display: 'flex', 
                                            alignItems: 'center'
                                        }}
                                    >
                                        <FaRegNewspaper style={{width: "2rem", height: "auto"}}/> Consulta de Clientes
                                    </div>
                                </strong>       
                            </div>
                        )}

                        <li 
                            onClick={this.handleFinanceListClick} 
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            <CiDollar /> {isOpen ? " Financeiro" : ""}
                        </li>
                        {isFinanceOpen && (
                            <div style={{ 
                                display: "flex", 
                                flexDirection: "column", 
                                justifyContent: "start", 
                                alignItems: "start" 
                            }} className="sidebar-finance-div">
                                <strong>
                                    <div 
                                        onClick={() => this.props.onComponentSelect("FinanceReports")} 
                                        style={{
                                            gap: "1rem", 
                                            cursor: 'pointer', 
                                            display: 'flex', 
                                            alignItems: 'center'
                                        }}
                                    >
                                        <TbZoomMoney style={{width: "2rem", height: "auto"}}/> Relatórios Financeiros
                                    </div>
                                </strong>
                            </div>
                        )}

                        <li 
                            onClick={this.handleStockListClick} 
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            <BiPackage /> {isOpen ? "Estoque" : ""}
                        </li>
                        {isStockOpen && (
                            <div style={{ 
                                display: "flex", 
                                flexDirection: "column", 
                                justifyContent: "start", 
                                alignItems: "start" 
                            }} className="sidebar-stock-div">
                                <strong>
                                    <div 
                                        onClick={() => this.props.onComponentSelect("EstoqueControle")} 
                                        style={{
                                            gap: "1rem", 
                                            cursor: 'pointer', 
                                            display: 'flex', 
                                            alignItems: 'center'
                                        }}
                                    >
                                        <CiInboxIn style={{width: "2rem", height: "auto"}}/> Entrada de itens
                                    </div>
                                    <div 
                                        onClick={() => this.props.onComponentSelect("EstoqueSaida")} 
                                        style={{
                                            gap: "1rem", 
                                            cursor: 'pointer', 
                                            display: 'flex', 
                                            alignItems: 'center'
                                        }}
                                    >
                                        <CiInboxOut style={{width: "2rem", height: "auto"}}/> Saída de itens
                                    </div>
                                    <div
                                        onClick={this.toggleModalGerenciarTipos} 
                                        style={{
                                            gap: "1rem", 
                                            cursor: 'pointer', 
                                            display: 'flex', 
                                            alignItems: 'center'
                                        }}
                                    >
                                        <CgArrowTopRightO style={{width: "2rem", height: "auto"}}/> Gerenciar Tipos de Produtos
                                    </div>
                                </strong>
                            </div>
                        )}
                    </ul>
                </div>

                {/* Modal de Gerenciar Tipos */}
                <ModalGerenciarTipos
                    isOpen={isModalGerenciarTiposOpen}
                    onClose={this.toggleModalGerenciarTipos}
                />
            </div>
        );
    }
}