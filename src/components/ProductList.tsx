import { useEffect, useState } from 'react';
import api from '../api';
import ReactPaginate from 'react-paginate';
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
}

type SortBy = 'name' | 'price';
type SortDirection = 'asc' | 'desc';

function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [sortBy, setSortBy] = useState<SortBy>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [pageNumber, setPageNumber] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('');
    const productsPerPage = 8;
    const pagesVisited = pageNumber * productsPerPage;

    useEffect(() => {
        async function fetchProducts() {
            try {
            const response = await api.get('/products');
            setProducts(response.data);
            } catch (error) {
            console.log(error);
            }
        }
    fetchProducts();
    }, []);

    const handlePageChange = ({ selected }: { selected: number }) => {
        setPageNumber(selected);
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
        setPageNumber(0);
    };

    const handleSortByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(event.target.value as SortBy);
        setPageNumber(0);
    };

    const handleSortDirectionChange = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        setPageNumber(0);
    };

    const filteredProducts = selectedCategory === ''
    ? products
    : products.filter(product => product.category === selectedCategory);

    const sortedProducts = filteredProducts.sort((a, b) => {
        if (sortBy === 'name') {
            return sortDirection === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else {
            return sortDirection === 'asc'
            ? a.price - b.price
            : b.price - a.price;
        }
    });

    const pageCount = Math.ceil(sortedProducts.length / productsPerPage);

    return (
        <div className="flex flex-col items-center bg-slate-200">
            <div className="w-full max-w-screen-lg py-2">
                <div className="flex justify-between items-center mb-8">
                    <div className="w-1/2 border-indigo-600 border-2 border rounded">
                        <select id="category-filter" className="block appearance-none w-full border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" value={selectedCategory} onChange={handleCategoryChange}>
                            <option value="">All categories</option>
                            <option value="electronics">Electronics</option>
                            <option value="jewelery">Jewelery</option>
                            <option value="men's clothing">Men's Clothing</option>
                            <option value="women's clothing">Women's Clothing</option>
                        </select>
                    </div>
                    <div className="w-1/2 flex justify-end">
                        <span className="mr-4">Sort by:</span>
                        <select id="sort-by" className="w-30 ml-4 py-2 px-3 bg-indigo-600 text-white py-px-4 border-indigo-600 border rounded focus:outline-none focus:shadow-outline" value={sortBy} onChange={handleSortByChange}>
                            <option value="name">Name</option>
                            <option value="price">Price</option>
                        </select>
                        <button className="w-20 ml-4 bg-indigo-600 text-white py-2 px-3 border-indigo-600 border rounded focus:outline-none focus:shadow-outline" onClick={handleSortDirectionChange}>
                            {sortDirection === 'asc' ? 'Asc' : 'Desc'}
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedProducts.slice(pagesVisited, pagesVisited + productsPerPage).map(product => (
                        <div key={product.id} className="bg-white border-indigo-600 border-2 rounded-lg shadow-md  overflow-hidden shadow-md hover:shadow-gray-950">
                            <img src={product.image} alt={product.title} className="w-full h-64 object-cover" />
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                                <p className="text-gray-700">${product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-8">
                    <ReactPaginate
                    nextLabel={
                        <span className="w-10 h-10 flex items-center justify-center bg-lightGray rounded-md mr-4">
                            <BsChevronRight />
                        </span>
                    }
                    onPageChange={handlePageChange}
                    pageRangeDisplayed={3}
                    pageCount={pageCount}
                    previousLabel={
                        <span className="w-10 h-10 flex items-center justify-center bg-lightGray rounded-md mr-4">
                            <BsChevronLeft />
                        </span>
                    }
                    containerClassName="flex items-center justify-center mt-8 mb-4"
                    pageClassName="block border- border-solid border-lightGray hover:bg-lightGray w-10 h-10 flex items-center justify-center rounded-md mr-4"
                    activeClassName="bg-indigo-600 text-white"
                    />
                </div>
            </div>
        </div>
    );
}
export default ProductList;