import { useEffect, useRef, useState } from "react";

// --- Types ---

interface UseBinanceWebSocketProps {
    symbol: string; // From CoinGecko (e.g., "btc", "eth")
}

interface UseBinanceWebSocketReturn {
    price: CurrentPriceData | null;
    trades: Trade[];
    ohlcv: OHLCData | null;
    isConnected: boolean;
}

interface CurrentPriceData {
    price: number;
    change24h?: number; // Percent change
    high24h?: number;
    low24h?: number;
    volume24h?: number;
}

interface Trade {
    price: number;
    amount: number;
    timestamp: number;
    isBuyerMaker: boolean; // true = Sell order, false = Buy order
}

type OHLCData = {
    t: number; // Open Time
    o: number; // Open
    h: number; // High
    l: number; // Low
    c: number; // Close
    v: number; // Volume
    isClosed: boolean; // Is the candle finished?
};

// --- Hook ---

export const useBinanceWebSocket = ({ symbol }: UseBinanceWebSocketProps): UseBinanceWebSocketReturn => {
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // State
    const [price, setPrice] = useState<CurrentPriceData | null>(null);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);

    useEffect(() => {
        if (!symbol) return;

        // 1. Prepare the Binance Symbol (e.g., "btcusdt")
        const binanceSymbol = `${symbol.toLowerCase()}usdt`;

        // 2. Construct Combined Stream URL
        // Streams:
        // - miniTicker: 1s updates for the main price display
        // - kline_1m: 1m updates for the chart
        // - aggTrade: Real-time trade history
        const streams = [
            `${binanceSymbol}@miniTicker`,
            `${binanceSymbol}@kline_1m`,
            `${binanceSymbol}@aggTrade`
        ].join("/");

        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_BINANCE_WEBSOCKET_URL}/stream?streams=${streams}`);
        wsRef.current = ws;

        ws.onopen = () => setIsConnected(true);
        ws.onclose = () => setIsConnected(false);

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const streamType = message.stream.split("@")[1]; // Extract stream type (miniTicker, kline_1m, etc.)
            const data = message.data;

            // --- Handle 1s Price Updates (miniTicker) ---
            if (streamType === "miniTicker") {
                setPrice({
                    price: parseFloat(data.c),      // Current Close Price
                    change24h: parseFloat(data.P),  // 24h % Change
                    high24h: parseFloat(data.h),    // High
                    low24h: parseFloat(data.l),     // Low
                    volume24h: parseFloat(data.v),  // Volume
                });
            }

            // --- Handle Chart Data (kline_1m) ---
            if (streamType === "kline_1m") {
                const k = data.k;
                setOhlcv({
                    t: k.t,
                    o: parseFloat(k.o),
                    h: parseFloat(k.h),
                    l: parseFloat(k.l),
                    c: parseFloat(k.c),
                    v: parseFloat(k.v),
                    isClosed: k.x // Binance flag: true if candle is closed
                });
            }

            // --- Handle Live Trades (aggTrade) ---
            if (streamType === "aggTrade") {
                const newTrade: Trade = {
                    price: parseFloat(data.p),
                    amount: parseFloat(data.q),
                    timestamp: data.T,
                    isBuyerMaker: data.m // Maker = Seller
                };

                // Keep only last 20 trades to prevent memory leaks
                setTrades((prev) => [newTrade, ...prev].slice(0, 20));
            }
        };

        return () => {
            ws.close();
        };
    }, [symbol]);

    return { price, trades, ohlcv, isConnected };
};