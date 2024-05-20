import axios from 'axios';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TinderCard from 'react-tinder-card';

function SwipePage() {
  const [db, setDb] = useState([]);                                 // db to store item stack
  const [rejectedItems, setRejectedItems] = useState([]);           // Rejected items list
  const [likedItems, setLikedItems] = useState([]);                 // Accepted items list
  const [stylesLoaded, setStylesLoaded] = useState(false);          // Style loading state

  const [currentIndex, setCurrentIndex] = useState(db.length - 1);  // Track current index of swiped card
  const [lastDirection, setLastDirection] = useState();             // Track last swipe direction
  const currentIndexRef = useRef(currentIndex);                     // Ref for current index, to maintain state across renders

  // Create refs for each card to manage swipe actions
  const childRefs = useMemo(
    () =>
      Array(db.length) 
        .fill(0) 
        .map((i) => React.createRef()),
    [db.length] 
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val); 
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < db.length - 1;
  const canSwipe = currentIndex >= 0;

  // Handle swipe action
  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction); 
    updateCurrentIndex(index - 1); 

    // Handle updates to lists
    if (direction === 'left') {
      setRejectedItems([...rejectedItems, db[index]]);
    } else if (direction === 'right') {
      const likedItem = db[index];
      setLikedItems([...likedItems, likedItem]);

      // Handle updates to checkouts table
      if (likedItem.id) {
        const token = localStorage.getItem('token');
        axios.post('http://localhost:8081/add-to-checkouts', { itemId: likedItem.id }, {
          headers: { 'access-token': token }
        })
          .then(res => {
            console.log('Item added to checkouts:', res.data);
          })
          .catch(err => {
            console.error('Error adding item to checkouts:', err);
          });
      } else {
        console.error('Liked item does not have an id:', likedItem);
      }
    }
  };

  // Declare when swipe is full/complete
  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };

  // Reject and Accept items button
  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  // Undo swipe button: remove from rejected list and remove from checkouts table
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();

    if (lastDirection === 'left') {
      setRejectedItems(rejectedItems.slice(0, -1));
    } else if (lastDirection === 'right') {
      const likedItem = likedItems[likedItems.length - 1];
      setLikedItems(likedItems.slice(0, -1));

      if (likedItem.id) {
        const token = localStorage.getItem('token');
        axios.post('http://localhost:8081/remove-from-checkouts', { itemId: likedItem.id }, {
          headers: { 'access-token': token }
        })
          .then(res => {
            console.log('Item removed from checkouts:', res.data);
          })
          .catch(err => {
            console.error('Error removing item from checkouts:', err);
          });
      } else {
        console.error('Liked item does not have an id:', likedItem);
      }
    }
  };

  // Get item stack and load styles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8081/items');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setDb(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const loadStyles = async () => {
      try {
        await import('./styles/swipeStyles.css');
        setStylesLoaded(true);
      } catch (error) {
        console.error('Error loading styles:', error);
      }
    };

    Promise.all([fetchData(), loadStyles()]);
  }, []);

  if (!stylesLoaded) {
    return null;
  }

  const id = localStorage.getItem('id');
  const username = localStorage.getItem('username');
  const gender = localStorage.getItem('gender');
  const birthday = localStorage.getItem('birthday');

  return (
    <div className='main-container'>
      <div className='header-bar'>
        <h1>My Items</h1>
        <div className='horizontal-stack'>
          <Link to="/" className="link-btn btn btn-default border">Home</Link>
          <Link to="/inventory" className="link-btn btn btn-default border">My Items</Link>
        </div>
      </div>
  
      <div className='app-container'>
        <h4>Hello, {username} {gender} {id} {birthday}</h4>
        <h1>Swipe Page</h1>
        <h1>Use Mouse to Drag Card Left or Right</h1>
        <br />
        <br />
        <br />
        <div className='advanced-container'>
          <div className='cardContainer'>
            {db.map((character, index) => (
              <TinderCard
                ref={childRefs[index]}
                className='swipe'
                key={character.id}
                onSwipe={(dir) => swiped(dir, character.name, index)}
                onCardLeftScreen={() => outOfFrame(character.name, index)}
              >
                <div
                  style={{ backgroundImage: 'url(' + character.url + ')' }}
                  className='card'
                >
                  <h3>{character.name}</h3>
                </div>
              </TinderCard>
            ))}
          </div>
          <div className='buttons'>
            <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('left')}>Skip</button>
            <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('right')}>Add</button>
          </div>
          <div className='undo-button'>
            <button style={{ backgroundColor: !canGoBack && '#c3c4d3' }} onClick={() => goBack()}>Undo swipe!</button>
          </div>
  
          {lastDirection ? (
            <h2 key={lastDirection} className='infoText'>
              {lastDirection === 'right' ? 'Good Choice!' : 'Keep trying!'}
            </h2>
          ) : <h1>Click a card to swipe!</h1>}
        </div>
      </div>
  
      <div className='horizontal-stack bottom-section'>
        <div className='left-container'>
          <h2>Rejected Items</h2>
          {rejectedItems.map(item => (
            <div key={item.name}>{item.name}</div>
          ))}
        </div>
        <div className='right-container'>
          <h2>Liked Items</h2>
          {likedItems.map(item => (
            <div key={item.name}>{item.name}</div>
          ))}
        </div>
      </div>
    </div>
  );  
}

export default SwipePage;
