// Mock API helpers for finance data
// In production, these would connect to real APIs like AlphaVantage, Finnhub, etc.

export interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
  timestamp: string
}

export interface ChartDataPoint {
  date: string
  close: number
  volume?: number
}

// Mock data generators for demo purposes
const SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NFLX', 'NVDA']

function generatePrice(symbol: string, basePrice: number = 150): number {
  const hash = symbol.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const variation = Math.sin(Date.now() / 10000 + hash) * 0.1 + Math.random() * 0.05 - 0.025
  return basePrice + (basePrice * variation)
}

export async function getAlphaDaily(symbol: string = 'AAPL'): Promise<any> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500))
  
  const points: ChartDataPoint[] = []
  const basePrice = generatePrice(symbol, 150)
  
  for (let i = 120; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dailyVariation = (Math.random() - 0.5) * 0.1
    points.push({
      date: date.toISOString().split('T')[0],
      close: basePrice + (basePrice * dailyVariation * (i / 120)),
      volume: Math.floor(Math.random() * 1000000) + 500000
    })
  }
  
  return {
    'Meta Data': {
      '1. Information': 'Daily Prices',
      '2. Symbol': symbol,
      '3. Last Refreshed': new Date().toISOString().split('T')[0]
    },
    'Time Series (Daily)': points.reduce((acc, point) => {
      acc[point.date] = {
        '1. open': (point.close * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2),
        '2. high': (point.close * (1 + Math.random() * 0.03)).toFixed(2),
        '3. low': (point.close * (1 - Math.random() * 0.03)).toFixed(2),
        '4. close': point.close.toFixed(2),
        '5. volume': point.volume?.toString() || '0'
      }
      return acc
    }, {} as any)
  }
}

export async function getFinnhubQuote(symbol: string = 'AAPL'): Promise<StockData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
  
  const currentPrice = generatePrice(symbol, 150)
  const previousClose = currentPrice * (1 + (Math.random() - 0.5) * 0.1)
  const change = currentPrice - previousClose
  const changePercent = (change / previousClose) * 100
  
  return {
    symbol,
    price: Number(currentPrice.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    timestamp: new Date().toISOString()
  }
}

export async function getMultipleQuotes(symbols: string[] = SYMBOLS): Promise<StockData[]> {
  const quotes = await Promise.all(symbols.map(symbol => getFinnhubQuote(symbol)))
  return quotes
}

export function getDefaultSymbols(): string[] {
  return [...SYMBOLS]
}