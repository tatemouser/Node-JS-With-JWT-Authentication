import React, { useState, useEffect } from 'react';
import './styles/inventory.css';

function Inventory() {
    const [userItems, setUserItems] = useState([]); // State to hold user items
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState('All');

    const categoryNames = [
        'All',
        'Accessories',          // 1
        'Animations',           // 2
        'Audio',                // 3
        'Avatar Animations',    // 4
        'Badges',               // 5
        'Bottoms',              // 6
        'Bundles',              // 7
        'Classic Clothing',     // 8
        'Classic Heads',        // 9
        'Decals',               // 10
        'Emotes',               // 11
        'Faces',                // 12
        'Hair',                 // 13
        'Heads',                // 14
        'Meshes',               // 15 
        'Models & Packages',    // 16
        'Passes',               // 17
        'Places',               // 18
        'Plugins',              // 19
        'Private Servers',      // 20
        'Shoes',                // 21
        'Tops',                 // 22
        'Video'                 // 23
    ];

    /*------------------------------------
     Fetch user items from checkout table
    -------------------------------------*/
    const fetchUserItems = async () => {
        try {
            const response = await fetch('http://localhost:8081/user-items');
            if (!response.ok) {
                throw new Error('Failed to fetch user items');
            }
            const userItems = await response.json();
            
            // Fetch additional information for each item from the items table
            const itemsPromises = userItems.map(async (item) => {
                const itemResponse = await fetch(`http://localhost:8081/items/${item.item_id}`);
                if (!itemResponse.ok) {
                    throw new Error(`Failed to fetch item with ID ${item.item_id}`);
                }
                const itemData = await itemResponse.json();
                return { ...item, ...itemData }; // Merge user item data with item data from items table
            });

            const items = await Promise.all(itemsPromises);
            setUserItems(items);
        } catch (error) {
            console.error('Error fetching user items:', error);
        }
    };

    /*------------------------------------
     Filter and render user items
    -------------------------------------*/
        const renderProducts = () => {
        let filteredProducts = userItems;

        if (selectedCategory !== 'All') {
            // Filter user items by selected category
            filteredProducts = filteredProducts.filter(item => getCategoryName(item.category) === selectedCategory);
        }

        if (priceRange === 'Below $10') {
            filteredProducts = filteredProducts.filter(item => item.cost < 10);
        } else if (priceRange === '$10 - $20') {
            filteredProducts = filteredProducts.filter(item => item.cost >= 10 && item.cost <= 20);
        } else if (priceRange === 'Above $20') {
            filteredProducts = filteredProducts.filter(item => item.cost > 20);
        }

        return filteredProducts.map(item => (
            <div key={item.id} className='product-item'>
                <h3>{item.name}</h3>
                <p>Category: {getCategoryName(item.category)}</p>
                <p>Price: ${item.cost}</p>
                {/* <p>{item.description}</p> */}
                {/* <p>{item.url}</p> */}
                <button>See on Site</button>
            </div>
        ));
    };

    // Function to get category name based on the category ID
    const getCategoryName = (categoryId) => {
        if (categoryId === 0) return 'All';
        return categoryNames[categoryId];
    };

    // Function to handle category filter
    const applyFilter = (category) => {
        setSelectedCategory(category);
    };

    // Function to handle price range filter
    const applyPriceFilter = (range) => {
        setPriceRange(range);
    };

    // Function to clear filters
    const clearFilters = () => {
        setSelectedCategory('All');
        setPriceRange('All');
    };

    useEffect(() => {
        fetchUserItems();
    }, []);


    
    return (
        <div className='inventory-container'>
            <div className='header-bar'>
                <h1>My Items</h1>
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
                        {categoryNames.map((category, index) => (
                            <button key={index} onClick={() => applyFilter(category)}>{category}</button>
                        ))}
                    </div>
                </div>
                <div className='product-list'>
                    {renderProducts()}
                </div>
            </div>
        </div>
    );
}

export default Inventory;
