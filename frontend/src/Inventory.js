import React, { useState, useEffect } from 'react';
import './styles/inventory.css';

const categoryNames = [
    'All',
    'Accessories',
    'Animations',
    'Audio',
    'Avatar Animations',
    'Badges',
    'Bottoms',
    'Bundles',
    'Classic Clothing',
    'Classic Heads',
    'Decals',
    'Emotes',
    'Faces',
    'Hair',
    'Heads',
    'Meshes',
    'Models & Packages',
    'Passes',
    'Places',
    'Plugins',
    'Private Servers',
    'Shoes',
    'Tops',
    'Video'
];

const dummyProducts = [
    { id: 1, name: 'Super Mario Plush Toy', category: 'Toys', price: 15 },
    { id: 2, name: 'Pokemon Trading Cards', category: 'Games', price: 10 },
    { id: 3, name: 'Lego Building Blocks', category: 'Toys', price: 20 },
    { id: 4, name: 'Roblox Action Figure', category: 'Toys', price: 12 },
    { id: 5, name: 'Minecraft Poster', category: 'Decor', price: 8 },
    { id: 6, name: 'Fortnite Backpack', category: 'Accessories', price: 25 },
];

function Inventory() {
    const [products] = useState(dummyProducts);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState('All');

    useEffect(() => {
        // Fetch data or perform any other initial setup
    }, []);

    const applyFilter = (category) => {
        setSelectedCategory(category);
    };

    const applyPriceFilter = (range) => {
        setPriceRange(range);
    };

    const clearFilters = () => {
        setSelectedCategory('All');
        setPriceRange('All');
    };

    const renderProducts = () => {
        let filteredProducts = products;
        
        if (selectedCategory !== 'All') {
            filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
        }

        if (priceRange === 'Below $10') {
            filteredProducts = filteredProducts.filter(product => product.price < 10);
        } else if (priceRange === '$10 - $20') {
            filteredProducts = filteredProducts.filter(product => product.price >= 10 && product.price <= 20);
        } else if (priceRange === 'Above $20') {
            filteredProducts = filteredProducts.filter(product => product.price > 20);
        }

        return filteredProducts.map(product => (
            <div key={product.id} className='product-item'>
                <h3>{product.name}</h3>
                <p>Category: {product.category}</p>
                <p>Price: ${product.price}</p>
                <button>See on Site</button>
            </div>
        ));
    };

    return (
        <div className='inventory-container'>
            <div className='header-bar'>
                <h1>Header Title</h1>
                <div className='horizontal-stack'>
                    <h2>Filter</h2>
                    <div className='filter-buttons'>
                        <button onClick={() => applyPriceFilter('All')}>All Prices</button>
                        <button onClick={() => applyPriceFilter('Below $10')}>Below $10</button>
                        <button onClick={() => applyPriceFilter('$10 - $20')}>$10 - $20</button>
                        <button onClick={() => applyPriceFilter('Above $20')}>Above $20</button>
                        <button onClick={clearFilters}>Clear Filters</button>
                    </div>
                </div>
            </div>
            <div className='main-content'>
                <div className='category-section'>
                    <h1>Categories</h1>
                    <div className='categories'>
                        {categoryNames.map(category => (
                            <button key={category} onClick={() => applyFilter(category)}>{category}</button>
                        ))}
                    </div>
                </div>
                <div className='product-list'>
                    {renderProducts()}
                </div>
            </div>
            <div className='bottom-text'>
                <p>Bottom Center Text</p>
            </div>
        </div>
    );
}

export default Inventory;
