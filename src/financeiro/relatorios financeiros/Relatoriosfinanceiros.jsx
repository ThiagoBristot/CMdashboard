import React, { Component } from 'react';
import "./relatoriosfinanceiros.css";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MdAttachMoney } from "react-icons/md";

class RelatoriosFinanceiros extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startMonth: 0,
      endMonth: 11,
      financialData: [],
      expensesData: [],
    };
  }

  componentDidMount() {
    this.fetchVendas();
    this.fetchGastos();
  }

  fetchVendas = async () => {
    try {
      const { startMonth, endMonth } = this.state;
      const response = await fetch("https://quiet-carefully-elk.ngrok-free.app/sumvendas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"},
        body: JSON.stringify({ startMonth, endMonth }),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar dados financeiros.');
      }

      const data = await response.json();
      this.setState({ financialData: data });
    } catch (error) {
      console.error(error.message);
    }
  };

  fetchGastos = async () => {
    try {
      const { startMonth, endMonth } = this.state;
      const response = await fetch("https://quiet-carefully-elk.ngrok-free.app/sumgastos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"},
        body: JSON.stringify({ startMonth, endMonth }),

      });

      if (!response.ok) {
        throw new Error('Erro ao buscar dados de gastos.');
      }

      const data = await response.json();
      this.setState({ expensesData: data });
    } catch (error) {
      console.error(error.message);
    }
  };

  handleStartMonthChange = (e) => {
    const newStartMonth = Number(e.target.value);
    if (newStartMonth <= this.state.endMonth) {
      this.setState({ startMonth: newStartMonth });
    }
  };

  handleEndMonthChange = (e) => {
    const newEndMonth = Number(e.target.value);
    if (newEndMonth >= this.state.startMonth) {
      this.setState({ endMonth: newEndMonth });
    }
  };

  render() {
    const { startMonth, endMonth, financialData, expensesData } = this.state;

    const monthOptions = [
      { value: 0, label: 'Janeiro' },
      { value: 1, label: 'Fevereiro' },
      { value: 2, label: 'Março' },
      { value: 3, label: 'Abril' },
      { value: 4, label: 'Maio' },
      { value: 5, label: 'Junho' },
      { value: 6, label: 'Julho' },
      { value: 7, label: 'Agosto' },
      { value: 8, label: 'Setembro' },
      { value: 9, label: 'Outubro' },
      { value: 10, label: 'Novembro' },
      { value: 11, label: 'Dezembro' }
    ];

    const filteredFinancialData = financialData.filter(
      item => item.monthIndex >= startMonth && item.monthIndex <= endMonth
    );
    
    const filteredExpensesData = expensesData.filter(
      item => item.monthIndex >= startMonth && item.monthIndex <= endMonth
    );
    
    // Garantir que 'ganho' e 'gasto' sejam convertidos para números
    const totalganho = filteredFinancialData.reduce((sum, item) => sum + parseFloat(item.ganho || 0), 0);
    const totalgasto = filteredExpensesData.reduce((sum, item) => sum + parseFloat(item.gasto || 0), 0);
    
    // Calcular o lucro líquido
    const netProfit = totalganho - totalgasto;
    

    return (
      <div className="financial-dashboard">
        <header className='financial-dashboard-header'>
          Relatórios financeiros
        </header>

        <div className="financial-date-filter">
          <h3>Selecione o período desejado</h3>
          <div className='financial-date-filter-div'>
            <div className="financial-date-filter-group">
              <label htmlFor="start-month">Mês Inicial</label>
              <select 
                id="start-month"
                value={startMonth}
                onChange={this.handleStartMonthChange}
              >
                {monthOptions.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="financial-date-filter-group">
              <label htmlFor="end-month">Mês Final</label>
              <select 
                id="end-month"
                value={endMonth}
                onChange={this.handleEndMonthChange}
              >
                {monthOptions.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="financial-summary">
          <div className="financial-card">
            <div className="financial-card-header">
              <div className="financial-card-icon financial-card-icon--green">
                <TrendingUp size={24} />
              </div>
              <h3 className="financial-card-title">Total Ganho</h3>
            </div>
            <p className="financial-card-value financial-card-value--positive">
              R$ {totalganho}
            </p>
          </div>

          <div className="financial-card">
            <div className="financial-card-header">
              <div className="financial-card-icon financial-card-icon--red">
                <TrendingDown size={24} />
              </div>
              <h3 className="financial-card-title">Total Gasto</h3>
            </div>
            <p className="financial-card-value financial-card-value--negative">
              R$ {totalgasto}
            </p>
          </div>

          <div className="financial-card">
            <div className={`financial-card-icon ${netProfit > 0 ? 'financial-card-icon--green' : 'financial-card-icon--red'}`}>
              <MdAttachMoney size={24} />
            </div>
            <h3 className="financial-card-title">Lucro Líquido</h3>
            <p className={`financial-card-value ${netProfit > 0 ? 'financial-card-value--positive' : 'financial-card-value--negative'}`}>
              R$ {netProfit.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="financial-charts">
          <div className="financial-chart">
            <h2 className="financial-chart-title">Relatório de Ganhos</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredFinancialData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ganho" stroke="#eab308" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="financial-chart">
            <h2 className="financial-chart-title">Relatório de Gastos</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredExpensesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="gasto" fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
}

export default RelatoriosFinanceiros;
