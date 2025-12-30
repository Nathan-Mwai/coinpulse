import {fetcher} from "@/lib/coingecko.actions";
import DataTable from "@/components/DataTable";
import Image from "next/image";
import {cn, formatCurrency, formatPercentage} from "@/lib/utils";
import Link from "next/link";
import CoinsPagination from "@/components/CoinsPagination";

const Page = async ({searchParams}: NextPageProps) => {

    const { page } = await searchParams;
    const currentPage = Number(page) || 1
    const perPage = 10;
    let marketData : CoinMarketData[]
    try{
        marketData = await fetcher<CoinMarketData[]>(
            "/coins/markets", {
                vs_currency: "usd",
                order:"market_cap_desc",
                per_page: perPage,
                page: currentPage,
                sparkline:false,
                price_change_percentage: "24h"
            }
        )
    }catch (e) {
        console.error("Coin Markets Fetch error:", e)
    }

    const columns: DataTableColumn<CoinMarketData>[] = [
        {
            id:"rank",
            header: "Rank",
            cellClassName: "rank-cell",
            cell: (coin) => (
                <>
                    #{coin.market_cap_rank}
                    <Link href={`/coins/${coin.id}`} aria-label={"View Coin"}/>
                </>
            )
        },
        {
            id: "token",
            header: "Token",
            cellClassName: "token-cell",
            cell: (coin) => (
                <div className={"token-info"}>
                    <Image src={coin.image} alt={coin.name} width={36} height={36} />
                    <p>
                        {coin.name} {coin.symbol.toUpperCase()}
                    </p>
                </div>
            )
        },
        {
            id: "price",
            header: "Price",
            cellClassName: "price-cell",
            cell: (coin) => formatCurrency(coin.current_price)
        },
        {
            id: "24hr-change",
            header: "24hr Change",
            cellClassName: "change-cell",
            cell: (coin) => {
                const priceChange = coin.price_change_percentage_24h ?? 0
                const isTrendingUp = priceChange > 0;

                return (
                    <span
                        className={cn("change-value", {
                            "text-green-600": isTrendingUp,
                            "text-red-500": !isTrendingUp,
                        })}
                    >
            {isTrendingUp && "+"}
                        {formatPercentage(coin.price_change_percentage_24h)}
          </span>
                );
            },
        },
        {
            id: "market-cap",
            header: "Market Cap",
            cellClassName: "market-cap-cell",
            cell: (coin) => formatCurrency(coin.market_cap)
        },
    ]

    const hasMorePages = marketData.length === perPage

    const estimatedTotalPages = currentPage >= 100 ? Math.ceil(currentPage / 100) * 100 + 100 : 100

    return (
        <main id={"coins-page"}>
            <div className={"content"}>
            <h4>All Coins</h4>
            <DataTable
                columns={columns}
                data={marketData}
                rowKey={(coin) => coin.id}
                tableClassName={"coins-table"}
            />
                <CoinsPagination
                    currentPage={currentPage}
                    totalPages={estimatedTotalPages}
                    hasMorePages={hasMorePages}
                />
            </div>
        </main>
    )
}
export default Page
