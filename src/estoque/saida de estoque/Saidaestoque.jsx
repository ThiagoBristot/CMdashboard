import React, { Component } from "react";
import "./saidaestoque.css";
import { IoIosAddCircle } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

class Modal extends Component {
    render() {
        const { isOpen, onClose, children } = this.props;
        if (!isOpen) return null;

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <button className="modal-close" onClick={onClose}>X</button>
                    {children}
                </div>
            </div>
        );
    }
}

// Modal de Nova Venda
class ModalNovaVenda extends Component {
       
    render() {
        const {
            isOpen,
            onClose,
            clientes,
            produtos,
            clienteSelecionado,
            produtoAtual,
            quantidadeAtual,
            valorTotal,
            dataVenda,
            produtosVenda,
            onClienteChange,
            onProdutoChange,
            onQuantidadeChange,
            onAdicionarProduto,
            onValorChange,
            onDataChange,
            onRegistrarVenda,
        } = this.props;

        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <h3>Nova Venda</h3>
                <input 
                    type="text" 
                    list="clientes" 
                    value={clienteSelecionado} 
                    onChange={onClienteChange} 
                    className="novavenda-select-cliente" 
                    placeholder="Selecione um cliente"
                />
                <datalist id="clientes">
                    <option value="">Selecione um cliente</option>
                    {clientes.map((cliente) => (
                        <option key={cliente.idCliente} value={cliente.idCliente}>
                            {cliente.nomeCliente}
                        </option>
                    ))}
                </datalist>

                <input 
                    type="text" 
                    list="produtos" 
                    value={produtoAtual} 
                    onChange={onProdutoChange} 
                    className="novavenda-select-cliente" 
                    placeholder="Selecione um produto"
                />
                <datalist id="produtos">
                    <option value="">Selecione um produto</option>
                    {produtos.map((produto) => (
                        <option key={produto.idProduto} value={produto.idProduto}>
                            {produto.nomeProduto}
                        </option>
                    ))}
                </datalist>
                <input
                    type="number"
                    placeholder="Quantidade"
                    value={quantidadeAtual}
                    onChange={onQuantidadeChange}
                />
                <button onClick={onAdicionarProduto} className="saida-novavenda-adcproduto-btn">Adicionar Produto</button>
                <div className="saida-novavenda-div-boxprodutos">
                    <h4>Produtos Selecionados</h4>
                    <ul className="saida-novavenda-ul-produtoselecionado">
                        {produtosVenda.map((item, index) => (
                            <li key={index}>
                                <div className="saida-novavenda-div-produtoselecionado">
                                    <h4>{item.nomeproduto}</h4> 
                                    <strong>{item.quantidade}</strong>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <input
                    type="number"
                    placeholder="Valor Total"
                    value={valorTotal}
                    onChange={onValorChange}
                />
                <input
                    type="date"
                    value={dataVenda}
                    onChange={onDataChange}
                />
                <button onClick={onRegistrarVenda} className="saida-novavenda-regvenda-btn">Registrar Venda</button>
            </Modal>
        );
    }
}

// Modal de Edição de Venda
class ModalEditarVenda extends Component {
    render() {
        const {
            isOpen,
            onClose,
            vendaSelecionada,
            onQuantidadeChange,
            onValorChange,
            onDataChange,
            onSalvarEdicao,
        } = this.props;

        if (!vendaSelecionada) return null;

        const { cliente, produto, quantidade, valorTotal, dataVenda } = vendaSelecionada;

        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <h3>Editar Venda</h3>
                <p>Cliente: {cliente}</p>
                <p>Produto: {produto}</p>
                <input
                    type="number"
                    placeholder="Quantidade"
                    value={quantidade}
                    onChange={onQuantidadeChange}
                />
                <input
                    type="number"
                    placeholder="Valor Total"
                    value={valorTotal}
                    onChange={onValorChange}
                />
                <input
                    type="date"
                    value={dataVenda}
                    onChange={onDataChange}
                />
                <button onClick={onSalvarEdicao}>Salvar</button>
            </Modal>
        );
    }
}
export default class SaidaEstoque extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vendas: [],
            produtosVenda: [],
            produtoAtual: "",
            quantidadeAtual: "",
            clienteSelecionado: "",
            dataVenda: "",
            modalNovaVendaAberto: false,
            modalEdicaoAberto: false,
            vendaSelecionada: null,
            searchTerm: "",
            clientes: [],
            produtos: [],
            valorTotal: "",
            produtosModalAberto: false,
            produtosModal: [],
        };
    }

    buscarVendas = () => {
        const authToken = "ak_2pXWf6mAlrMYNVuI7bhf4mSw1pW";
        fetch("https://quiet-carefully-elk.ngrok-free.app/vendas", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${authToken}`,
                "ngrok-skip-browser-warning": 1,
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Erro ao obter dados");
                }
            })
            .then((data) => {
                this.setState({ vendas: data });
                console.log(data);
            })
            .catch((error) => {
                console.error("Erro:", error);
            });
    };

    buscarClientes = () => {
        const authToken = "ak_2pXWf6mAlrMYNVuI7bhf4mSw1pW";
        fetch("https://quiet-carefully-elk.ngrok-free.app/clientes", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${authToken}`,
                "ngrok-skip-browser-warning": 1,
            },
        })
            .then((response) => response.json())
            .then((data) => this.setState({ clientes: data }))
            .catch((error) => console.error("Erro ao buscar clientes:", error));
    };
    
    buscarProdutos = () => {
        const authToken = 'ak_2pXWf6mAlrMYNVuI7bhf4mSw1pW';
        fetch('https://quiet-carefully-elk.ngrok-free.app/produtos', {
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
            console.log('Produtos recebidos:', data);
            this.setState({ produtos: data.produtos });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    };
       

    deletarVenda = (idVenda) => {
        const authToken = "ak_2pXWf6mAlrMYNVuI7bhf4mSw1pW";
        fetch(`https://quiet-carefully-elk.ngrok-free.app/vendas/${idVenda}`, {
            method: "DELETE",
            headers: {
                Authorization: `Token ${authToken}`,
                "ngrok-skip-browser-warning": 1,
            },
        })
            .then((response) => {
                if (response.ok) {
                    this.buscarVendas();
                    alert("Venda excluída com sucesso!");
                } else {
                    throw new Error("Erro ao excluir venda");
                }
            })
            .catch((error) => {
                console.error("Erro:", error);
                alert("Erro ao excluir venda");
            });
    };

    abrirModalNovaVenda = () => this.setState({ modalNovaVendaAberto: true });
    fecharModalNovaVenda = () => this.setState({ modalNovaVendaAberto: false });

    abrirModalEdicao = (venda) => this.setState({ modalEdicaoAberto: true, vendaSelecionada: venda });
    fecharModalEdicao = () => this.setState({ modalEdicaoAberto: false, vendaSelecionada: null });


    editarVenda = () => {
        const { vendaSelecionada } = this.state;
        const authToken = "ak_2pXWf6mAlrMYNVuI7bhf4mSw1pW";

        fetch(`https://quiet-carefully-elk.ngrok-free.app/vendas/${vendaSelecionada.idVenda}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${authToken}`,
                "ngrok-skip-browser-warning": 1,
            },
            body: JSON.stringify(vendaSelecionada),
        })
            .then((response) => {
                if (response.ok) {
                    this.buscarVendas();
                    this.fecharModalEdicao();
                    alert("Venda atualizada com sucesso!");
                } else {
                    throw new Error("Erro ao atualizar venda");
                }
            })
            .catch((error) => {
                console.error("Erro:", error);
                alert("Erro ao atualizar venda");
            });
    };


    handleProdutoChange = (event) => {
        const idProdutoSelecionado = event.target.value;
        const produtoSelecionado = this.state.produtos.find(
            (produto) => produto.idProduto.toString() === idProdutoSelecionado.toString()
        );
    
        if (produtoSelecionado) {
            const valorProduto = parseFloat(produtoSelecionado.valorSaida) || 0; // Garantir que o valor do produto seja um número
            const quantidadeAtual = this.state.quantidadeAtual && !isNaN(this.state.quantidadeAtual) ? parseInt(this.state.quantidadeAtual) : 0; // Converter quantidade para número
    
            // Calcula o valor total do produto selecionado
            const valorProdutoTotal = quantidadeAtual > 0 ? valorProduto * quantidadeAtual : 0;
    
            // Soma o valor total do produto ao valor total da venda
            const novoValorTotal = parseFloat(this.state.valorTotal) + valorProdutoTotal; // Garantir que o valor total da venda seja um número
    
            // Limpar os zeros à direita (caso o valor seja decimal)
            const valorTotalLimpo = novoValorTotal.toString().replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
    
            // Atualiza o estado com o valor total formatado
            this.setState({
                produtoAtual: idProdutoSelecionado,
                valorTotal: valorTotalLimpo, // Atualiza o valor total com a soma correta
            });
        } else {
            console.log("Produto não encontrado");
        }
    };    
    
    handleQuantidadeChange = (event) => {
        // Obtém o valor da quantidade como número
        const quantidadeAtual = parseInt(event.target.value, 10) || 0; // Se não for número válido, define como 0
    
        // Encontra o produto atual e obtém o valor de saída (valorVenda)
        const produtoSelecionado = this.state.produtos.find(
            (produto) => produto.idProduto === this.state.produtoAtual
        );
    
        const valorProduto = produtoSelecionado ? produtoSelecionado.valorSaida : 0;
    
        // Calcula o novo valor total com base na quantidade e valor do produto
        const novoValorTotal = valorProduto * quantidadeAtual;
    
        // Atualiza o estado com a nova quantidade e valor total
        this.setState({
            quantidadeAtual, // Atualiza a quantidade atual
            valorTotal: novoValorTotal + this.state.valorTotal, // Soma o novo valor ao total existente
        });
    };
    
    handleValorChange = (event) => {
        this.setState({
            valorTotal: event.target.value, // Permite a alteração manual do valor total
        });
    };

    handleDataChange = (event) => {
        const valorData = event.target.value; // Obtém o valor do campo de data no formato 'YYYY-MM-DD'
    
        if (valorData) {
            // Formata a data para o formato 'DD/MM/YYYY' para exibição
            const dataExibicao = new Date(valorData);
            const dataFormatada = `${dataExibicao.getDate().toString().padStart(2, '0')}/${(dataExibicao.getMonth() + 1).toString().padStart(2, '0')}/${dataExibicao.getFullYear()}`;
    
            console.log("Data formatada para exibição:", dataFormatada);
    
            // Mantém o valor no formato 'YYYY-MM-DD' para envio ao banco
            this.setState({
                dataVenda: valorData, // Mantém o formato original 'YYYY-MM-DD'
                dataVendaExibicao: dataFormatada, // Armazena o formato para exibição
            });
        } else {
            console.log("Data não selecionada.");
        }
    };
    
    

    handleClienteChange = (event) => {
        const clienteSelecionado = event.target.value;
        this.setState({ clienteSelecionado });
    };

    handleAdicionarProduto = () => {
        const { produtoAtual, quantidadeAtual, produtosVenda, produtos, valorTotal } = this.state;
    
        if (!produtoAtual || !quantidadeAtual) {
            alert("Selecione um produto e informe a quantidade.");
            return;
        }
    
        const produto = produtos.find((p) => p.idProduto === parseInt(produtoAtual));
    
        if (!produto) {
            alert("Produto inválido.");
            return;
        } else {
            console.log(produto); // Para visualizar o produto encontrado
        }
    
        // Cria o novo produto para adicionar à venda
        const novoProduto = {
            nomeproduto: produto.nomeProduto,
            idProduto: produto.idProduto,
            quantidade: parseInt(quantidadeAtual),
            valorUnitario: produto.valorSaida, // Valor unitário do produto
            valorVenda: produto.valorSaida * parseInt(quantidadeAtual), // Valor total para este produto
        };
    
        // Calcula o novo valor total da venda (soma com o valor total atual)
        const novoValorTotal = parseFloat(valorTotal || 0) + novoProduto.valorVenda;
    
        // Atualiza o estado com o novo produto e o valor total
        this.setState({
            produtosVenda: [...produtosVenda, novoProduto],  // Adiciona o novo produto à lista
            produtoAtual: "",  // Limpa o campo de produto selecionado
            quantidadeAtual: "",  // Limpa o campo de quantidade
            valorTotal: novoValorTotal.toFixed(2),  // Atualiza o valor total com duas casas decimais
        });
    };    
    
    // Função para registrar a venda com um array de produtos
    registrarVenda = () => {
        const authToken = "ak_2pXWf6mAlrMYNVuI7bhf4mSw1pW";

        // Adicionando log para visualizar os dados antes de processar
        console.log("Dados da venda antes de processar:", this.state.produtosVenda);

        // Estrutura da venda
        const venda = {
            idCliente: this.state.clienteSelecionado, // ID do cliente
            produtos: this.state.produtosVenda.map((produto) => {
                let valorUnitario = parseFloat(produto.valorUnitario); // Converte para número
                let quantidade = parseInt(produto.quantidade); // Converte para número inteiro

                // Adicionando log para verificar cada produto
                console.log(`Produto ID: ${produto.idProduto}, Quantidade: ${quantidade}, Valor Unitário: ${valorUnitario}`);

                // Verifica se valorUnitario, quantidade são números válidos
                if (isNaN(valorUnitario) || isNaN(quantidade)) {
                    console.error("Erro: Dados de venda inválidos (quantidade ou valor unitário inválido).");
                    throw new Error("Dados de venda inválidos (quantidade ou valor unitário inválido).");
                }

                // Calcula o valor total do produto (valorUnitario * quantidade)
                const valorTotal = valorUnitario * quantidade;

                return {
                    idProduto: produto.idProduto,
                    quantidade: quantidade,
                    valorUnitario: valorUnitario,
                    valorVenda: valorTotal, // Valor total do produto
                };
            }),
            dataVenda: this.state.dataVenda, // Data da venda
        };

        // Log final para visualizar a estrutura da venda antes do envio
        console.log("Estrutura final da venda a ser enviada:", venda);

        // Envia a venda para o backend
        fetch("https://quiet-carefully-elk.ngrok-free.app/vendas/nova", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${authToken}`,
                "ngrok-skip-browser-warning": 1,
            },
            body: JSON.stringify(venda),
        })
        .then(async (response) => {
            const responseText = await response.text();  // Obtém a resposta como texto
            try {
                const responseJson = JSON.parse(responseText);  // Tenta converter o texto em JSON
                if (response.ok) {
                    alert("Venda registrada com sucesso!");
                    this.setState({
                        clienteSelecionado: "",
                        produtosVenda: [],
                        valorTotal: "",
                        dataVenda: "",
                    });
                } else {
                    throw new Error(responseJson.message || "Erro ao registrar venda.");
                }
            } catch (error) {
                console.error("Erro ao registrar venda:", error);
                alert("Erro ao registrar venda.");
            }
        })
        .catch((error) => {
            console.error("Erro ao registrar venda:", error);
            alert("Erro ao registrar venda.");
        });
    };      

    // Abre o modal com os produtos da venda
    abrirModalProdutos = (produtos) => {
        this.setState({
            produtosModalAberto: true,
            produtosModal: produtos,
        });
    };

    // Fecha o modal
    fecharModalProdutos = () => {
        this.setState({
            produtosModalAberto: false,
            produtosModal: [],
        });
    };

    componentDidMount() {
        this.buscarVendas();
        this.buscarClientes();
        this.buscarProdutos();
    }    

    render() {
        const {
            searchTerm,
            vendas,
            modalNovaVendaAberto,
            modalEdicaoAberto,
            vendaSelecionada,
            produtosVenda,
            produtoAtual,
            quantidadeAtual,
            clientes,
            produtos,
            clienteSelecionado,
            valorTotal,
            dataVenda,
        } = this.state;

        const filteredVendas = vendas.filter((venda) =>
            venda.idVenda?.toString().includes(searchTerm.toString())
        );

        return (
            <div className="saida-estoque">
                <header className="saida-estoque-header">
                    <h2>Saída de itens</h2>
                </header>
                <section className="saida-estoque-section">
                    <div className="saida-estoque-addnew-div">
                        <h4>Nova venda:</h4>
                        <button className="saida-estoque-ns-btn" onClick={this.abrirModalNovaVenda}>
                            <IoIosAddCircle/>
                        </button>
                    </div>

{/*                    <h4 style={{ marginRight: "auto", width: "fit-content", marginLeft: "2em" }}>Filtrar por:</h4>
                    <div className="saida-estoque-btns-div">
                        <button className="saida-estoque-filter-btn">Cadastro mais recente</button>
                        <button className="saida-estoque-filter-btn">Cadastro mais antigo</button>
                        <button className="saida-estoque-filter-btn">Saída mais recente</button>
                        <button className="saida-estoque-filter-btn">Saída mais antiga</button>
                    </div>*/}
                    <div className="saida-estoque-input-div">
                        <p>Digite o ID da venda desejada:</p>
                        <div className="saida-estoque-input-btn-div">
                            <input
                                type="text"
                                placeholder="digite aqui"
                                value={searchTerm}
                                onChange={this.handleSearch} // Atualiza o termo de pesquisa
                            />
                        </div>
                    </div>
                    <div className="saida-estoque-div-colunas">
                        <span>ID da venda</span>
                        <span>Nome do cliente</span>
                        <span>Produtos</span>
                        <span>Quantidade total</span>
                        <span>Valor da venda</span>
                        <span>Data da venda</span>
                        <span>Ações</span>
                    </div>
                    <div className="saida-estoque-div-produtos">
                        <ul>
                            {filteredVendas.map((venda) => (
                                <li key={venda.idVenda} className="produto-item">
                                    <span>{venda.idVenda}</span>
                                    <span>{venda.nomeCliente}</span>
                                    {/* Produtos transformados em texto ou parte clicável */}
                                    <span
                                        className="produto-item-link"
                                        onClick={() => this.abrirModalProdutos(venda.produtos)}
                                    >
                                        Ver produtos
                                    </span>

                                    {this.state.produtosModalAberto && (
                                        <div className="modal-produtos-overlay">
                                            <div className="modal-produtos">
                                                <button
                                                    onClick={this.fecharModalProdutos}
                                                    className="modal-produtos-btn-fechar"
                                                >
                                                    X
                                                </button>
                                                <h2 className="modal-produtos-title">Produtos da Venda</h2>
                                                <table className="modal-produtos-table">
                                                    <thead>
                                                        <tr>
                                                            <th className="modal-produtos-th">Nome do Produto</th>
                                                            <th className="modal-produtos-th">Quantidade</th>
                                                            <th className="modal-produtos-th">Valor Unitário</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.produtosModal.map((produto, index) => (
                                                            <tr key={index} className="modal-produtos-row">
                                                                <td className="modal-produtos-td">{produto.nomeProduto}</td>
                                                                <td className="modal-produtos-td">{produto.quantidade}</td>
                                                                <td className="modal-produtos-td">
                                                                    R$ {parseFloat(produto.valorUnitario).toFixed(2)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    <span>{venda.quantidadeTotal}</span>
                                    <span>R$ {parseFloat(venda.valorTotal).toFixed(2)}</span>
                                    <span>{new Date(venda.dataVenda).toLocaleDateString()}</span>
                                    <div>
                                        <FaPencilAlt
                                            className="saida-estoque-edit"
                                            onClick={() => this.abrirModalEdicao(venda)}
                                        />
                                        <MdDelete
                                            className="saida-estoque-delete"
                                            onClick={() => this.deletarVenda(venda.idVenda)}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

            {/* Modal para Nova Venda */}
            <ModalNovaVenda
                isOpen={modalNovaVendaAberto}
                onClose={this.fecharModalNovaVenda}
                produtos={produtos}
                clientes={clientes}
                produtoAtual={produtoAtual}
                quantidadeAtual={quantidadeAtual}
                clienteSelecionado={clienteSelecionado}
                dataVenda={dataVenda}
                produtosVenda={produtosVenda}
                valorTotal={valorTotal}
                onProdutoChange={this.handleProdutoChange}
                onQuantidadeChange={this.handleQuantidadeChange}
                onClienteChange={this.handleClienteChange}
                onAdicionarProduto={this.handleAdicionarProduto}
                onRegistrarVenda={this.registrarVenda}
                onValorChange={this.handleValorChange}
                onDataChange={this.handleDataChange}
            />

            {/* Modal para Editar Venda */}
            <ModalEditarVenda
                isOpen={modalEdicaoAberto}
                onClose={this.fecharModalEdicao}
                vendaSelecionada={vendaSelecionada}
                produtos={produtos}
                clientes={clientes}
                onEditarVenda={this.handleEditarVenda}
                onDeletarVenda={this.handleDeletarVenda}
            />
                    
            </div>
        );
    }
}
