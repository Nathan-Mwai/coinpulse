import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import DataTable from "@/components/DataTable";
import { CategoriesFallback } from "@/components/home/fallback";
import { fetcher } from "@/lib/coingecko.actions";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";

const Categories = async () => {
	let topCategories: Category[];
	try {
		topCategories = await fetcher<Category[]>(
			"/coins/categories",
			undefined,
			300,
		);
	} catch (error) {
		console.error("Categories fetch error:", error);
		return <CategoriesFallback />;
	}

	const columns: DataTableColumn<Category>[] = [
		{
			id: "category",
			header: "Category",
			cellClassName: "category-cell",
			cell: (category) => category.name,
		},
		{
			id: "top-gainer",
			header: "Top Gainers",
			cellClassName: "top-gainers-cell",
			cell: (category) =>
				category.top_3_coins.map((coin, index) => (
					<Image
						key={coin}
						alt={`Top gainer ${index + 1}`}
						src={coin}
						width={28}
						height={28}
					/>
				)),
		},
		{
			id: "24h-change",
			header: "24hr Change",
			cellClassName: "change-header-cell",
			cell: (category) => {
				const priceChange = category.market_cap_change_24h ?? 0;
				const isTrendingUp = priceChange > 0;

				return (
					<div
						className={cn(
							"change-cell flex items-center gap-1",
							isTrendingUp ? "text-green-500" : "text-red-500",
						)}
					>
						{isTrendingUp ? (
							<TrendingUp width={16} height={16} />
						) : (
							<TrendingDown width={16} height={16} />
						)}
						<p>{formatPercentage(priceChange)}</p>
					</div>
				);
			},
		},
		{
			id: "market-cap",
			header: "Market Cap",
			cellClassName: "market-cap-cell",
			cell: (category) => formatCurrency(category.market_cap),
		},
		{
			id: "24hr-volume",
			header: "24hr Volume",
			cellClassName: "volume-cell",
			cell: (category) => formatCurrency(category.volume_24h),
		},
	];
	return (
		<div id={"categories"} className={"custom-scrollbar"}>
			<h4>Top Categories</h4>
			<DataTable
				columns={columns}
				data={topCategories?.slice(0, 10)}
				rowKey={(_, index) => index}
				tableClassName={"mt-3"}
			/>
		</div>
	);
};
export default Categories;
