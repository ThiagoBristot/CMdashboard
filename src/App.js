import React, { Component } from 'react';
import './App.css';
import SideBar from "./sidebar/Sidebar";
import Header from './header/Header';
import ManCliente from './clientes/manutencao de clientes/Manclientes';
import Home from "./home/Home";
import ConClientes from './clientes/consulta de clientes/Conclientes';
import ConEstoque from './estoque/controle de estoque/Conestoque';
import SaidaEstoque from './estoque/saida de estoque/Saidaestoque';

type State = {
  activeComponent: string | null;
};

export default class App extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      activeComponent: null,
    };
  }

  setActiveComponent = (componentName: string | null): void => {
    this.setState({ activeComponent: componentName });
  };

  renderComponent = (): JSX.Element | null => {
    const { activeComponent } = this.state;

    switch (activeComponent) {
      //CLIENTE
      case "ClientMaintenance":
        return <ManCliente />;  // Componente para "Manutenção de Clientes"
      case "ClientConsultation":
        return <ConClientes/>; // Componente para "Consulta de Clientes"
      //ESTOQUE
      case "EstoqueControle":
        return <ConEstoque/>; // Componente para "Controle de Estoque"
      case "EstoqueSaida":
        return <SaidaEstoque/>; // Componente para "Saida no Estoque"
      //HOME - default
        default:
        return <Home />;  // Componente padrão
    }
  };

  render() {
    return (
      <div>
        {/* Passando a função de setActiveComponent para o Header */}
        <Header onTitleClick={() => this.setActiveComponent(null)} />
        <SideBar onComponentSelect={this.setActiveComponent} />

        {/* Componente principal */}
        <div
          style={{
            width: "100vw",
            flex: 1,
            textAlign: "center",  // Centraliza o conteúdo
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.renderComponent()}
        </div>
      </div>
    );
  }
}
