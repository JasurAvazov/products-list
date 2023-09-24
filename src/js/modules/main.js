export async function init() {
	let apiUrl = "https://dummyjson.com/products";
	let productData = [];
	let itemsPerPage = 12;
	let currentPage = 1;
	let totalPages;

	const categorySelect = document.getElementById("categorySelect");

	async function dataTable(selectedCategory) {
		await productTable();

		if (selectedCategory === undefined) {
			selectedCategory = "all";
		}

		categorySelect.value = selectedCategory;

		const filteredData = filterByCategory(productData, selectedCategory);

		totalPages = Math.ceil(filteredData.length / itemsPerPage);
		document.querySelector(".length").innerHTML = totalPages;
		document.querySelector(".currentPage").innerHTML = currentPage;
		generatePagination();

		const indexOfLastPage = currentPage * itemsPerPage;
		const indexOfFirstPage = indexOfLastPage - itemsPerPage;
		const currentItems = filteredData.slice(
			indexOfFirstPage,
			indexOfLastPage
		);

		document.getElementById("products").innerHTML = currentItems
			.map(
				(product) =>
					`
                <div class="productCard">
                    <img src=${product.images[0]} draggable="false" />
                    <h3 class="title">${product.title}</h3>
                    <p class="rating">Rating: ${product.rating}</p>
                </div>
                `
			)
			.join("");
	}

	function filterByCategory(data, category) {
		if (category === "all") {
			return data;
		} else {
			return data.filter((product) => product.category === category);
		}
	}

	function generatePagination() {
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
	}

	async function generateCategoriesOptions() {
		categorySelect.innerHTML = "";
		const categories = [
			...new Set(productData.map((product) => product.category)),
		];
		const allOption = document.createElement("option");
		allOption.value = "all";
		allOption.textContent = "All Categories";
		categorySelect.appendChild(allOption);

		categories.forEach((category) => {
			const option = document.createElement("option");
			option.value = category;
			option.textContent = category;
			categorySelect.appendChild(option);
		});
	}

	categorySelect.addEventListener("change", (event) => {
		const selectedCategory = event.target.value;
		dataTable(selectedCategory);
	});

	const prevBtn = () => {
		if (currentPage > 1) {
			currentPage--;
			dataTable();
		}
	};

	const nextBtn = () => {
		if (currentPage < totalPages) {
			currentPage++;
			dataTable();
		}
	};

	document
		.getElementById("prevBtn")
		.addEventListener("click", prevBtn, false);
	document
		.getElementById("nextBtn")
		.addEventListener("click", nextBtn, false);

	async function productTable() {
		const data = await fetch(apiUrl);
		const res = await data.json();
		productData = res.products;

		generateCategoriesOptions();
	}

	await productTable();
	await dataTable();
}
