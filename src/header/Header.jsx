import React, { Component } from "react";
import "./header.css";
import { IoMdSettings } from "react-icons/io";
import { LuLogIn } from "react-icons/lu";
import Logo from "../assets/fabiologo.jpeg"

type HeaderProps = {
    onTitleClick: () => void; // Definindo a prop para o clique no título
};

export default class Header extends Component<HeaderProps> {
    state = {
        isMenuOpen: false,  // Estado para controlar a abertura da lista de saída
    };

    // Função que alterna a visibilidade da lista
    toggleMenu = () => {
        this.setState(prevState => ({
            isMenuOpen: !prevState.isMenuOpen // Alterna entre abrir e fechar o menu
        }));
    };

    render() {
        const { isMenuOpen } = this.state; // Acessa o estado
        const { onTitleClick } = this.props; // Acessa a função passada como prop

        return (
            <section className="header">
                <div className="header-logo-title" onClick={onTitleClick}> {/* Adicionando o onClick ao título */}
                    <img src={Logo} alt="logo" className="logoimg"/>
                    <h1>CM Dashboard</h1>
                </div>

                <input type="text" className="header-searchbar" placeholder="Escreva qual elemento do sistema gostaria de visualizar" />

                <button className="header-settings-btn"><IoMdSettings /></button>
                <div className="header-logout-lista">
                    <button className="header-login-btn" onClick={this.toggleMenu}><LuLogIn /></button>
                    {isMenuOpen && (
                        <div className="dropdown-menu">
                            <button className="logout-btn">Sair</button>
                        </div>
                    )}
                </div>
            </section>
        );
    }
}
