import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/inventory.css';

function Inventory() {
    const [userItems, setUserItems] = useState([]);                  // User items
    const [selectedCategory, setSelectedCategory] = useState('All'); // Current Category
    const [minPrice, setMinPrice] = useState('');                   // Minimum Price
    const [maxPrice, setMaxPrice] = useState('');                   // Maximum Price
    const [currentPage, setCurrentPage] = useState(1);               // Current page
    const itemsPerPage = 50;                                         // Items per page

    // For conversion from int in db to string labels 
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
            const userId = localStorage.getItem('id'); // Get user ID from localStorage
            if (!userId) {
                throw new Error('User ID not found');
            }

            // Get items
            const response = await fetch(`http://localhost:8081/user-items?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user items');
            }
            const userItems = await response.json();
            
            // Get item data for each
            const itemsPromises = userItems.map(async (item) => {
                const itemResponse = await fetch(`http://localhost:8081/items/${item.item_id}`);
                if (!itemResponse.ok) {
                    throw new Error(`Failed to fetch item with ID ${item.item_id}`);
                }
                const itemData = await itemResponse.json();
                return { ...item, ...itemData }; // Merge data
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
            // Category filtering
            filteredProducts = filteredProducts.filter(item => getCategoryName(item.category) === selectedCategory);
        }

        // Price filtering
        filteredProducts = filteredProducts.filter(item => {
            if (minPrice && maxPrice) {
                return item.cost >= minPrice && item.cost <= maxPrice;
            } else if (minPrice) {
                return item.cost >= minPrice;
            } else if (maxPrice) {
                return item.cost <= maxPrice;
            }
            return true;
        });

        // Pagination logic
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

        return currentItems.map(item => (
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

    const getCategoryName = (categoryId) => {
        if (categoryId === 0) return 'All';
        return categoryNames[categoryId];
    };

    const applyFilter = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset to first page when filter is applied
    };

    const applyPriceFilter = () => {
        setCurrentPage(1); // Reset to first page when filter is applied
    };

    const clearFilters = () => {
        setSelectedCategory('All');
        setMinPrice('');
        setMaxPrice('');
        setCurrentPage(1); 
    };

    const sortLowToHigh = () => {
        setUserItems([...userItems].sort((a, b) => a.cost - b.cost));
    };
    
    const sortHighToLow = () => {
        setUserItems([...userItems].sort((a, b) => b.cost - a.cost));
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    useEffect(() => {
        fetchUserItems();
    }, []);


    return (
        <div className='inventory-container'>
            <div className='header-bar'>
                <h1>My Items</h1>
                <div className='horizontal-stack'>
                    <Link to="/" className="link-btn btn btn-default border">Logout</Link>
                    <Link to="/swipepage" className="link-btn btn btn-default border">Back to Game</Link>
                </div>
                <div className='horizontal-stack'>
                    <h2>Filter</h2>
                    <div className='filter-buttons'>
                        <div className='price-filter'>
                            <input
                                type="number"
                                placeholder="Max Price"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Min Price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                        </div>
                        <button onClick={clearFilters}>Clear Filters</button>
                        <button onClick={sortLowToHigh}>Low to High</button>
                        <button onClick={sortHighToLow}>High to Low</button>
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
            <div className='pagination'>
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>Back</button>
                    <span>Page {currentPage}</span>
                    <button onClick={handleNextPage} disabled={userItems.length <= currentPage * itemsPerPage}>Next</button>
            </div>
        </div>
    );
}

export default Inventory;
