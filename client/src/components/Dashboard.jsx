import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Sidebar from './Sidebar';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import './styling/dashboard.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [btcPrices, setBTCprices] = useState([]);
  const [liveMarketData, setLiveMarketData] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const getBTCPrice = await fetch('http://localhost:5000/api/getBTCprices', { method: 'GET' });
      const BTCPriceGraph = await getBTCPrice.json();
      if (BTCPriceGraph && BTCPriceGraph.prices) setBTCprices(BTCPriceGraph.prices);

      const liveMarketResponse = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=40&page=1&sparkline=true'
      );
      const liveMarketData = await liveMarketResponse.json();
      setLiveMarketData(liveMarketData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const btcChartData = {
    labels: btcPrices.map((data) => new Date(data[0]).toLocaleDateString()),
    datasets: [
      {
        label: 'BTC Price (USD)',
        data: btcPrices.map((data) => data[1]),
        fill: false,
        borderColor: '#3f51b5',
        tension: 0.1,
      },
    ],
  };

  const filteredCoins = liveMarketData.filter(
    (coin) => coin.id === 'bitcoin' || coin.id === 'ethereum' || coin.id === 'litecoin' || coin.id === 'cardano'
  );

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="dashboard-content">
        {/* Top cards for Bitcoin, Ethereum, Litecoin, and Cardano */}
        <div className="top-cards-container">
          {filteredCoins.map((coin) => (
            <div className="crypto-card" key={coin.id}>
              <div className="card-content">
                <h3>{coin.name}</h3>
                <h2>${coin.current_price.toLocaleString()}</h2>
                <p className={`percentage ${coin.price_change_percentage_24h > 0 ? 'positive' : 'negative'}`}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* BTC price graph */}
        <div className="btc-chart-container">
          <h2>BTC Price Chart</h2>
          {btcPrices.length > 0 ? <Line data={btcChartData} /> : <p>Loading...</p>}
        </div>

        {/* Live market section with sparklines */}
        <div className="live-market">
          <h3>Live Market</h3>
          <div className="live-market-grid">
            {filteredCoins.map((coin) => (
              <div className="live-market-item" key={coin.id}>
                <div className="live-market-info">
                  <h4>{coin.name}</h4>
                  <p>Price: ${coin.current_price.toLocaleString()}</p>
                  <p className={`percentage ${coin.price_change_percentage_24h > 0 ? 'positive' : 'negative'}`}>
                    Change: {coin.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
                <div className="sparkline-chart">
                  <Sparklines data={coin.sparkline_in_7d.price}>
                    <SparklinesLine color={coin.price_change_percentage_24h > 0 ? 'green' : 'red'} />
                  </Sparklines>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
