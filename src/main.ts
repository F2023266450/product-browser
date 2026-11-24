
interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    category: string;
  }
  
  interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
  }
  
  // Get products from API with proper types
  async function getProducts(): Promise<Product[]> {
    const response = await fetch(
      "https://dummyjson.com/products?limit=12"
    );
  
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
  
    const data: ProductResponse = await response.json();
  
    return data.products;
  }
  
  // Get HTML elements
  const productContainer = document.getElementById(
    "products"
  ) as HTMLDivElement;
  
  const categorySelect = document.getElementById(
    "category"
  ) as HTMLSelectElement;
  
  const message = document.getElementById(
    "message"
  ) as HTMLParagraphElement;
  
  // Store products
  let allProducts: Product[] = [];
  
  // Display products
  function renderProducts(products: Product[]): void {
    productContainer.innerHTML = "";
  
    if (products.length === 0) {
      message.textContent = "No products found.";
      return;
    }
  
    message.textContent = "";
  
    products.forEach((product: Product) => {
      const card = document.createElement("div");
      card.className = "product-card";
  
      const image = document.createElement("img");
      image.src = product.thumbnail;
      image.alt = product.title;
  
      const title = document.createElement("h3");
      title.textContent = product.title;
  
      const description = document.createElement("p");
      description.textContent = product.description;
  
      const price = document.createElement("strong");
      price.textContent = `$${product.price}`;
  
      card.append(image, title, description, price);
  
      productContainer.appendChild(card);
    });
  }
  
  // Create category dropdown
  function createCategories(products: Product[]): void {
    const categories = [
      ...new Set(products.map(p => p.category))
    ];
  
    categorySelect.innerHTML = "";
  
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Categories";
  
    categorySelect.appendChild(allOption);
  
    categories.forEach(category => {
      const option = document.createElement("option");
  
      option.value = category;
      option.textContent = category;
  
      categorySelect.appendChild(option);
    });
  }
  
  // Filter products by category
  categorySelect.addEventListener("change", () => {
    const selectedCategory = categorySelect.value;
  
    if (selectedCategory === "all") {
      renderProducts(allProducts);
    } else {
      const filteredProducts = allProducts.filter(
        product => product.category === selectedCategory
      );
  
      renderProducts(filteredProducts);
    }
  });
  
  // Load products
  async function loadProducts(): Promise<void> {
    try {
      message.textContent = "Loading…";
  
      allProducts = await getProducts();
  
      createCategories(allProducts);
      renderProducts(allProducts);
  
    } catch (error: unknown) {
      productContainer.innerHTML = "";
  
      message.textContent =
        error instanceof Error
          ? `Error: ${error.message}`
          : "Something went wrong.";
    }
  }
  
  // Start application
  loadProducts();
  