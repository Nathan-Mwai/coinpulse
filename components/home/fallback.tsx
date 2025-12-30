import DataTable from "@/components/DataTable";

export const CoinOverviewFallback = () => {
	return (
		<div id={"coin-overview-fallback"}>
			<div className={"header pt-2"}>
				<div className={"header-image skeleton"} />
				<div className={"info"}>
					<div className={"header-line-sm skeleton"} />
					<div className={"header-line-lg skeleton"} />
				</div>
			</div>
			<div className={"chart"}>
				<div className={"chart-skeleton skeleton"} />
			</div>
		</div>
	);
};

export const TrendingCoinsFallback = () => {
	const columns: DataTableColumn<number>[] = [
		{
			id: "name",
			header: "Name",
			cellClassName: "name-cell",
			cell: () => (
				<div className={"name-link"}>
					<div className={"name-image skeleton"} />
					<div className={"name-line skeleton"} />
				</div>
			),
		},
		{
			id: "24h-change",
			header: "24hr Change",
			cellClassName: "change-cell",
			cell: () => (
				<div className={"price-change"}>
					<div className={"change-icon skeleton"} />
					<div className={"change-line skeleton"} />
				</div>
			),
		},
		{
			id: "price",
			header: "Price",
			cellClassName: "price-cell",
			cell: () => <div className={"price-line skeleton"} />,
		},
	];

	return (
		<div id={"trending-coins-fallback"}>
			<h4>Trending Coins</h4>
			<DataTable
				columns={columns}
				data={[1, 2, 3, 4, 5, 6]}
				rowKey={(i) => i}
				tableClassName={"trending-coins-table"}
				headerCellClassName={"py-3!"}
				bodyCellClassName={"py-2!"}
			/>
		</div>
	);
};

export const CategoriesFallback = () => {
	const columns: DataTableColumn<number>[] = [
		{
			id: "category",
			header: "Category",
			cellClassName: "category-cell",
			cell: () => <div className={"category-skeleton skeleton"} />,
		},
		{
			id: "top-gainer",
			header: "Top Gainers",
			cellClassName: "top-gainers-cell",
			cell: () => (
				<div className={"flex gap-1"}>
					<div className={"coin-skeleton skeleton"} />
					<div className={"coin-skeleton skeleton"} />
					<div className={"coin-skeleton skeleton"} />
				</div>
			),
		},
		{
			id: "24h-change",
			header: "24hr Change",
			cellClassName: "change-header-cell",
			cell: () => (
				<div className={"change-cell"}>
					<div className={"change-icon skeleton"} />
					<div className={"value-skeleton-sm skeleton"} />
				</div>
			),
		},
		{
			id: "market-cap",
			header: "Market Cap",
			cellClassName: "market-cap-cell",
			cell: () => <div className={"value-skeleton-md skeleton"} />,
		},
		{
			id: "24hr-volume",
			header: "24hr Volume",
			cellClassName: "volume-cell",
			cell: () => <div className={"value-skeleton-lg skeleton"} />,
		},
	];

	return (
		<div id={"categories-fallback"}>
			<h4>Top Categories</h4>
			<DataTable
				columns={columns}
				data={[1, 2, 3, 4, 5]}
				rowKey={(i) => i}
				tableClassName={"mt-3"}
			/>
		</div>
	);
};

export const CoinsPaginationFallback = () => {
	return (
		<div id={"coins-pagination-fallback"}>
			<div className={"control-skeleton skeleton"} />
			<div className={"pages-skeleton"}>
				{[1, 2, 3, 4, 5].map((i) => (
					<div key={i} className={"page-skeleton skeleton"} />
				))}
			</div>
			<div className={"control-skeleton skeleton"} />
		</div>
	);
};

export const CoinsFallback = () => {
	const columns: DataTableColumn<number>[] = [
		{
			id: "rank",
			header: "Rank",
			cellClassName: "rank-cell",
			cell: () => <div className={"rank-skeleton skeleton"} />,
		},
		{
			id: "token",
			header: "Token",
			cellClassName: "token-cell",
			cell: () => (
				<div className={"token-skeleton"}>
					<div className={"image skeleton"} />
					<div className={"line skeleton"} />
				</div>
			),
		},
		{
			id: "price",
			header: "Price",
			cellClassName: "price-cell",
			cell: () => <div className={"price-skeleton skeleton"} />,
		},
		{
			id: "24hr-change",
			header: "24hr Change",
			cellClassName: "change-cell",
			cell: () => <div className={"change-skeleton skeleton"} />,
		},
		{
			id: "market-cap",
			header: "Market Cap",
			cellClassName: "market-cap-cell",
			cell: () => <div className={"market-cap-skeleton skeleton"} />,
		},
	];

	return (
		<main id={"coins-fallback"}>
			<div className={"content"}>
				<h4>All Coins</h4>
				<DataTable
					columns={columns}
					data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
					rowKey={(i) => i}
					tableClassName={"coins-table"}
				/>
				<CoinsPaginationFallback />
			</div>
		</main>
	);
};
