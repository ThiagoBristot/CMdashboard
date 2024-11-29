import React, { Component } from "react";
import "./home.css";
import { MdAttachMoney } from "react-icons/md";
import { BiPackage } from "react-icons/bi";
import { FaBasketShopping } from "react-icons/fa6";
import { FaPerson } from "react-icons/fa6";

export default class Home extends Component {
  render() {
    return (
      <div className="home-container">
        {/* Cabeçalho */}
        <header className="home-header">
          <div><h1>Bem-vindo ao CMDashboard Dashboard de controle e manutenção! </h1></div>
          <p>Gerencie seu estoque, finanças, pedidos e muito mais em um só lugar</p>
        </header>

        {/* Seção de Navegação */}
        <div className="home-navigation-div">
            <section className="home-navigation">
            <div className="home-nav-card">
                <h3><BiPackage style={{width: "2em", height: "auto"}}/></h3>
                <p>Gerencie seus produtos e mantenha o controle do inventário.</p>
            </div>

            <div className="home-nav-card">
                <h3><MdAttachMoney style={{width: "2em", height: "auto"}}/></h3>
                <p>Acompanhe suas despesas, receitas e fluxo de caixa.</p>
            </div>

            <div className="home-nav-card">
                <h3><FaBasketShopping style={{width: "2em", height: "auto"}}/></h3>
                <p>Gerencie os pedidos de seus clientes e acompanhe o status.</p>
            </div>

            <div className="home-nav-card">
                <h3><FaPerson style={{width: "2em", height: "auto"}}/></h3>
                <p>Gerencie os cadastros de clientes, além de poder conferir relatórios variados</p>
            </div>
            </section>
            </div>
        {/* Rodapé */}
        <footer className="home-footer">
          <p>&copy; 2024 Sistema de Controle. Todos os direitos reservados.</p>
        </footer>
      </div>
    );
  }
}
