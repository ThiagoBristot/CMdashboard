import React, { useState, useMemo } from 'react';
import "./relatoriosfinanceiros.css"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MdAttachMoney } from "react-icons/md";

const mockFinancialData = [
  { month: 'Jan', monthIndex: 0, ganho: 15000, gasto: 10000 },
  { month: 'Fev', monthIndex: 1, ganho: 18000, gasto: 12000 },
  { month: 'Mar', monthIndex: 2, ganho: 22000, gasto: 15000 },
  { month: 'Abr', monthIndex: 3, ganho: 20000, gasto: 13500 },
  { month: 'Mai', monthIndex: 4, ganho: 25000, gasto: 16000 },
  { month: 'Jun', monthIndex: 5, ganho: 30000, gasto: 20000 },
  { month: 'Jul', monthIndex: 6, ganho: 28000, gasto: 18500 },
  { month: 'Ago', monthIndex: 7, ganho: 32000, gasto: 22000 },
  { month: 'Set', monthIndex: 8, ganho: 35000, gasto: 24000 },
  { month: 'Out', monthIndex: 9, ganho: 33000, gasto: 21500 },
  { month: 'Nov', monthIndex: 10, ganho: 37000, gasto: 25000 },
  { month: 'Dez', monthIndex: 11, ganho: 40000, gasto: 27000 }
];

const RelatoriosFinanceiros = () => {
  const [startMonth, setStartMonth] = useState(0);
  const [endMonth, setEndMonth] = useState(11);

  const filteredFinancialData = useMemo(() => {
    return mockFinancialData.filter(
      item => item.monthIndex >= startMonth && item.monthIndex <= endMonth
    );
  }, [startMonth, endMonth]);

  const totalganho = filteredFinancialData.reduce((sum, item) => sum + item.ganho, 0);
  const totalgasto = filteredFinancialData.reduce((sum, item) => sum + item.gasto, 0);
  const netProfit = totalganho - totalgasto;

  const monthOptions = mockFinancialData.map(item => ({
    value: item.monthIndex,
    label: item.month
  }));

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
              onChange={(e) => {
                const newStartMonth = Number(e.target.value);
                if (newStartMonth <= endMonth) {
                  setStartMonth(newStartMonth);
                }
              }}
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
              onChange={(e) => {
                const newEndMonth = Number(e.target.value);
                if (newEndMonth >= startMonth) {
                  setEndMonth(newEndMonth);
                }
              }}
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
            R$ {totalganho.toLocaleString()}
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
            R$ {totalgasto.toLocaleString()}
          </p>
        </div>

        <div className="financial-card">
          <div className="financial-card-header">
            <div className={`financial-card-icon ${netProfit > 0 ? 'financial-card-icon--green' : 'financial-card-icon--red'}`}>
              <MdAttachMoney size={24} />
            </div>
            <h3 className="financial-card-title">Lucro Líquido</h3>
          </div>
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
            <BarChart data={filteredFinancialData}>
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
};

export default RelatoriosFinanceiros;