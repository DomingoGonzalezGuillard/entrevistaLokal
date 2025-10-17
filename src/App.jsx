import * as React from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';

const App = () => {

  // URL 2 'https://somoslokal.cl/api/private/products/active';
  // URL 1 inicial 'https://somoslokal.com/api/internal/products/active'

  const API_ENDPOINT = 'https://somoslokal.com/api/internal/products/active';

  
  const [url, setUrl] = React.useState(API_ENDPOINT);

  const [products, setProducts] = React.useState([]);
  const [filteredProducts, setFilteredProducts] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedBrands, setSelectedBrands] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [query, setQuery] = React.useState("");



  const brands = [
    { name: "100 Aventuras", slug: "100-aventuras" },
    { name: "1109-Concept", slug: "1109-concept" },
    { name: "Abeja Dorada", slug: "abeja-dorada" },
    {name: "Newen Repu" ,slug: "newen-repu"},
  ];

  const handleFetchProducts = React.useCallback(async () => {


    try {
      setIsLoading(true);


      const fullUrl = `${url}${query}`;

      const result = await axios.get(fullUrl);
      console.log(fullUrl);
      console.log(result.data);
      console.log(result.data);
      setProducts(result.data.products);
      console.log(products)
      setFilteredProducts(products);
      setIsLoading(false);
      setIsError(false);

      console.log("Esto son los products " + products);

    } catch {
      setIsError(true);
    }
  }, [url, query]);

const handleBrandChange = (event) => {
  const { value, checked } = event.target;

  
  let updatedBrands;
  if (checked) {
    updatedBrands = [...selectedBrands, value];
  } else {
    updatedBrands = selectedBrands.filter((b) => b !== value);
  }

 
  setSelectedBrands(updatedBrands);

  
  if (updatedBrands.length > 0) {
    const makerIds = updatedBrands.join(",");
    const makerIdsURL = `?maker_ids=${makerIds}&page=1`;
    console.log(query);
    setQuery(makerIdsURL); 
  } else {
    
    setQuery("");
  }
};


  const productMargin = (unitaryPrice, wholesalePrice) => {
    return (
      ((unitaryPrice - wholesalePrice)/unitaryPrice).toFixed(2)

    )
  }


  const handleSearchInput = (event) => {
    event.preventDefault();

    setSearchTerm(event.target.value);
    const filterResults = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(filterResults);
  };

  
  React.useEffect(() => {
    
    handleFetchProducts();
    
  }, [handleFetchProducts])


  return (
    <div className="conatiner max-auto p-6">

      <h1 className="text-4xl font-bold text-center mb-8 text-black"> Lokal Home Page</h1>

      <div className="container mx-auto p-6 flex flex-col items-center">
        <div className="w-full max-w-sm">
          <label
            htmlFor="search"
            className="block mb-2 text-gray-700 font-medium text-center"
          >
            Buscar Producto
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            autoFocus
            onChange={handleSearchInput}
            placeholder="Escribe el nombre del producto..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-700"
          />
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Marcas</h2>
        {brands.map((brand) => (
          <div key={brand.slug} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={brand.slug}
              value={brand.slug}
              checked={selectedBrands.includes(brand.slug)}
              onChange={handleBrandChange}
              className="mr-2"
            />
            <label htmlFor={brand.slug} className="text-gray-700">
              {brand.name}
            </label>
          </div>
        ))}
      </div>


      {isLoading ? <p>Cargando Productos...</p> :
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
        <GridProducts products= {filteredProducts} productMargin={productMargin}/>
      </div>
    }
    </div>


  )
};

const GridProducts  = ({products, productMargin}) => {


  return (
          <>
          {products.map((item) => {
            return (
              <div key={item.id} className="bg-white shadow-lg rounder-lg overflow-hidden hover-shadow-2x1 transition-shadow duration-300">
              
                {item.images[0]?.derivatives?.jpg_md?.url ? 
                  <img 
                  src={item.images[0]?.derivatives?.jpg_md?.url} 
                  alt={item.name} 
                  width="500" 
                  height="600"
                  className="w-full h-64 object-cover"/>
                  :
                    <div className="w-full h-64 flex items-center justify-center bg-gray-200">
                      <span className="text-gray-700">No tiene imagen</span>
                    </div>
                }
                
           
                <div className="p-4">
                  <span className="text-base  mb-1">${item.unitary_price_cents}</span>
                  <span className="text-xs font-light md:text-sm pl-2">PVP ${item.wholesale_price_cents}</span>
                  <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                  <p className="text-gray-600 mb-1">ID: {item.id}</p>
                  <p className="text-green-600 font-bold">
                    Precio Margen: {productMargin(item.unitary_price_cents, item.wholesale_price_cents)}
                  </p>
                </div>
              </div>

            )
          })}
        </>
  )
};


export default App
