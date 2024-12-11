import React, { Component } from 'react';
import './App.css';
import SideBar from "./sidebar/Sidebar";
import Header from './header/Header';
import ManCliente from './clientes/manutencao de clientes/Manclientes';
import Home from "./home/Home";
import ConClientes from './clientes/consulta de clientes/Conclientes';
import ConEstoque from './estoque/controle de estoque/Conestoque';
import SaidaEstoque from './estoque/saida de estoque/Saidaestoque';
import Relatoriosfinanceiros from "./financeiro/relatorios financeiros/Relatoriosfinanceiros";
import AuthForm from './auth/AuthForm';  // Importe o componente AuthForm

type State = {
  activeComponent: string | null;
  isAuthenticated: boolean;  // Adicionando estado para verificar se o usuário está autenticado
};

export default class App extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      activeComponent: null,
      isAuthenticated: false,  // Inicialmente, o usuário não está autenticado
    };
  }

  // Função chamada quando o login for bem-sucedido
  handleAuthSuccess = () => {
    this.setState({ isAuthenticated: true });  // Marca o usuário como autenticado
  };

  setActiveComponent = (componentName: string | null): void => {
    this.setState({ activeComponent: componentName });
  };

  renderComponent = (): JSX.Element | null => {
    const { activeComponent } = this.state;

    switch (activeComponent) {
      //CLIENTE
      case "ClientMaintenance":
        return <ManCliente />;
      case "ClientConsultation":
        return <ConClientes />;
      //ESTOQUE
      case "EstoqueControle":
        return <ConEstoque />;
      case "EstoqueSaida":
        return <SaidaEstoque />;
      //FINANCEIRO
      case "FinanceReports":
        return <Relatoriosfinanceiros />;
      //HOME - default
      default:
        return <Home />;
    }
  };

  render() {
    const { isAuthenticated } = this.state;

    return (
      <div>
        {/* Se o usuário não estiver autenticado, exibe o formulário de autenticação */}
        {!isAuthenticated ? (
          <AuthForm onAuthSuccess={this.handleAuthSuccess} />
        ) : (
          <>
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
                alignItems: "center",
              }}
            >
              {this.renderComponent()}
            </div>
          </>
        )}
      </div>
    );
  }
}
