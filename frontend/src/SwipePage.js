import React, { useState, useMemo, useRef, useEffect } from 'react';
import TinderCard from 'react-tinder-card';

function SwipePage() {
  const [db, setDb] = useState([]);                         // Initialize db state
  const [rejectedItems, setRejectedItems] = useState([]);   // Initialize rejected items state
  const [likedItems, setLikedItems] = useState([]);         // Initialize liked items state
  const [stylesLoaded, setStylesLoaded] = useState(false);  // Track if styles are loaded

  const [currentIndex, setCurrentIndex] = useState(db.length - 1);
  const [lastDirection, setLastDirection] = useState();
  const currentIndexRef = useRef(currentIndex);

  // Hook linking refs to db
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

  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);

    // Add the swiped item to either the rejected or liked list based on direction
    if (direction === 'left') {
      setRejectedItems([...rejectedItems, db[index]]);
    } else if (direction === 'right') {
      setLikedItems([...likedItems, db[index]]);
    }
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();

    // Remove the last swiped item from the rejected or liked list
    if (lastDirection === 'left') {
      setRejectedItems(rejectedItems.slice(0, -1));
    } else if (lastDirection === 'right') {
      setLikedItems(likedItems.slice(0, -1));
    }
  };

  // Fetch data from the backend server when the component mounts
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

    // Dynamically import CSS file and mark styles as loaded
    const loadStyles = async () => {
      try {
        await import('./styles/swipeStyles.css');
        setStylesLoaded(true);
      } catch (error) {
        console.error('Error loading styles:', error);
      }
    };

    // CRUCIAL: Load data and styles simultaneously
    Promise.all([fetchData(), loadStyles()]);
  }, []);

  // Render component only after styles are loaded
  if (!stylesLoaded) {
    return null; 
  }

  return (
    <div className='main-container'>
      <div className='left-container'>
        <h2>Rejected Items</h2>
        {rejectedItems.map(item => (
          <div key={item.name}>{item.name}</div>
        ))}
      </div>

      <div className='app-container'>
        <h1>Swipe Page</h1>
        <h1>Use Mouse to Drag Card Left or Right</h1>
        <br></br>
        <br></br>
        <br></br>
        <div className='advanced-container'>
          <div className='cardContainer'>
            {db.map((character, index) => (
              <TinderCard
                ref={childRefs[index]}
                className='swipe'
                key={character.name}
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

      <div className='right-container'>
        <h2>Liked Items</h2>
        {likedItems.map(item => (
          <div key={item.name}>{item.name}</div>
        ))}
      </div>
    </div>
  );
}

export default SwipePage;
