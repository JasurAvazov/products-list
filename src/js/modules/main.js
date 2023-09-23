export async function init() {
	let apiUrl = "https://dummyjson.com/products";
	let productData = [];
	let itemsPerPage = 12;
	let currentPage = 1;
	let totalPages;

	async function dataTable() {
		await productTable();

		totalPages = Math.ceil(productData.length / itemsPerPage);
		document.querySelector(".length").innerHTML = totalPages;
		document.querySelector(".currentPage").innerHTML = currentPage;

		const pages = [];
		for (let i = 0; i <= totalPages; i++) {
			pages.push(i);
		}

		const indexOfLastPage = currentPage * itemsPerPage;
		const indexOfFirstPage = indexOfLastPage - itemsPerPage;
		const currentItems = productData.slice(
			indexOfFirstPage,
			indexOfLastPage
		);

		document.getElementById("products").innerHTML = currentItems
			.map((products) =>
				`
				<div class="productCard">
					<img src=${products.images[0]} draggable="false" />
					<h3 class="title">${products.title}</h3>
					<p class="rating">rating ${products.rating}</p>
				</div>
				`
			)
			.join("");
	}
	await dataTable();

	const prevBtn = () => {
		if ((currentPage - 1) * itemsPerPage) {
			currentPage--;
			dataTable();
		}
	};

	const nextBtn = () => {
		if ((currentPage * itemsPerPage) / productData.length) {
			if (currentPage < totalPages) {
				currentPage++;
				dataTable();
			}
		}
	};

	document
		.getElementById("prevBtn")
		.addEventListener("click", prevBtn, false);
	document
		.getElementById("nextBtn")
		.addEventListener("click", nextBtn, false);

	const numbsContainer = document.getElementById("numbs");
	numbsContainer.innerHTML = "";

	for (let i = 1; i <= totalPages; i++) {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "pagination-number";
		button.textContent = i;

		button.addEventListener("click", () => {
			currentPage = i;
			dataTable();
		});

		numbsContainer.appendChild(button);
	}

	async function productTable() {
		const data = await fetch(apiUrl);
		const res = await data.json();
		productData = res.products;
	}
}