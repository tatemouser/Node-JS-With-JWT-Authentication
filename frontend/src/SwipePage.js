import React, { useState, useMemo, useRef, useEffect } from 'react';
import TinderCard from 'react-tinder-card';


function SwipePage() {
  const [db, setDb] = useState([]);  // Initialize db state
  const [stylesLoaded, setStylesLoaded] = useState(false); // Track if styles are loaded

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
      <div className='app-container'>
        <div className='advanced-container'>
          <h1>Use Mouse to Drag Card Left or Right</h1>
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
          ) : (
            <h2 className='infoText'>
              Swipe a card or press a button to get Restore Card button visible!
            </h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default SwipePage;
