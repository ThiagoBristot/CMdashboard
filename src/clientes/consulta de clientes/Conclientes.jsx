import React, { Component } from "react";
import "./conclientes.css"

export default class ConClientes extends Component {
    state = {
        clientes: [],
        searchTerm: "",
    };
    
    componentDidMount() {
        this.fetchClientes();
    }
    
    fetchClientes = async () => {
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


    handleSearch = (e) => {
        this.setState({ searchTerm: e.target.value }); // Atualiza o termo de pesquisa
    };

    render(){

        const { clientes, searchTerm } = this.state;

        // Filtrar os clientes com base no termo de pesquisa
        const filteredClientes = clientes.filter(cliente =>
            cliente.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.telefoneCliente.includes(searchTerm)
          );

        return(
            <div className="conclientes">
                <header className="conclientes-header"><h1 className="conclientes-titulo">Consulta de Clientes</h1></header>
                <nav className="conclientes-nav">
                    {/*<ul className="conclientes-nav-ul">
                        <li className="conclientes-filter-btn">filtros</li>
                        <li className="conclientes-filter-btn">filtros</li>
                        <li className="conclientes-filter-btn">filtros</li>
                        <li className="conclientes-filter-btn">filtros</li>
                    </ul>*/}
                    <label>Digite o nome do cliente desejado</label>
                    <input
                        type="text"
                        placeholder="digite aqui"
                        value={searchTerm}
                        onChange={this.handleSearch} // Atualiza o termo de pesquisa
                    />
                </nav>
                <section>
                    <header className="conclientes-header-encontrados"><h2>Clientes Encontrados</h2></header>
                    <div className="conclientes-encontrados">
                        <div className="conclientes-encontrados-colunas">
                            <span>nome</span>
                            <span>CPF</span>
                            <span>endereço</span>
                            <span>telefone</span>
                            <span>email</span>
                            <span>Ultimo pedido</span>
                        </div>
                        <ul className="conclientes-encontrados-ul">
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
                            </div>
                        ))}
                        </ul>
                    </div>
                </section>
            </div>
        );
    }
}