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
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        // Fetch data or perform any other initial setup
    }, []);

    const applyFilter = (category) => {
        setSelectedCategory(category);
    };

    const renderProducts = () => {
        const filteredProducts = selectedCategory === 'All' ? products : products.filter(product => product.category === selectedCategory);
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
