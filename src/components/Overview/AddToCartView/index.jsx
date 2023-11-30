import React from 'react';
import styled from 'styled-components';
import useServerFetch from '../../../hooks/useServerFetch.js'; // eslint-disable-line
import ButtonWrapper from '../../UI/StyledButton.js' // eslint-disable-line
import AddToCartForm from './AddToCartForm.jsx'; // eslint-disable-line

function UnstyledAddToCartView({ currentStyle, view }) { // eslint-disable-line
  const [selectedSku, setSelectedSku] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [quantity, setQuantity] = React.useState(0);
  const [availableSkus, setAvailableSkus] = React.useState();
  const [message, setMessage] = React.useState(null);
  const [added, setAdded] = React.useState(false);

  React.useEffect(() => {
    if (currentStyle && currentStyle.skus) { // eslint-disable-line
      setAvailableSkus(Object.keys(currentStyle.skus).map((sku) => { // eslint-disable-line
        if (currentStyle.skus[sku] && currentStyle.skus[sku].quantity) { // eslint-disable-line
          return (sku);
        }
      }));
      setSelectedSku(null);
      setQuantity(0);
      setAdded(false);
      setSelectedItem('Select Size');
    }
  }, [currentStyle]);

  React.useEffect(() => {
    if (selectedSku && currentStyle && currentStyle.skus[selectedSku]) {
      setSelectedItem(currentStyle.skus[selectedSku].size);
      setAdded(false);
    }
  }, [selectedSku]);

  React.useEffect(() => {
  }, [selectedItem]);

  const dropDownStyle = {
    display: 'inline-block',
    margin: '20px',
    paddingLeft: '10px',
    paddingRight: '10px',
    marginLeft: '20px',
    marginRight: '20px',
    width: '10vw',
    height: '5vh',
    fontSize: '20px',
  };

  const AddButton = styled(ButtonWrapper)`
    display: block;
    width: 10vw;
    height: 5vh;
    overflow: hidden;
    margin: auto;
    margin-top: 1vh;
    font-size: 20px;
  `;

  return (
    <div style={{ marginRight: view === 'expanded' ? '30px' : '0px', marginTop: view === 'expanded' ? '50px' : '0px' }}>
      {currentStyle && currentStyle.skus ? ( // eslint-disable-line
        <AddToCartForm style={{}} onSubmit={(e) => { // eslint-disable-line
          e.preventDefault();
          const posts = [];
          const postObject = { sku_id: selectedSku };
          if (selectedSku) {
            setAdded(true);
            for (let i = 0; i < quantity; i++) { // eslint-disable-line
              posts.push(useServerFetch('post', 'cart', postObject));
            }
            Promise.all(posts)
              .then(() => {
                setMessage(null);
                setSelectedSku(null);
                setQuantity(0);
              })
              .catch(() => {
                setAdded(false);
                setMessage('ERROR');
              });
          } else {
            document.getElementById('selectSize').click();
            setMessage('Please select size');
          }
        }}
        >
          {(availableSkus) && (
            <>

              {message && <p style={{ margin: '1vh' }}>{message}</p>}
              <select
                key={currentStyle}
                defaultValue={selectedItem}
                id="selectSize"
                style={dropDownStyle}
                onChange={(e) => {
                  setSelectedSku(e.target.value);
                  setQuantity(quantity || 1);
                }}
              >
                <option value={null} hidden>Select Size</option>
                {availableSkus.map((sku) => { // eslint-disable-line
                  if (currentStyle.skus[sku]) { // eslint-disable-line
                    return <option value={sku} key={sku}>{currentStyle.skus[sku].size}</option>; // eslint-disable-line
                  }
                })}
              </select>

              <select defaultValue="-" style={dropDownStyle} disabled={!(selectedSku)} onChange={(e) => setQuantity(e.target.value)}>
                {selectedSku && currentStyle.skus[selectedSku] ? Array(currentStyle.skus[selectedSku].quantity).fill('').slice(0, 15).map( // eslint-disable-line
                  (x, num) =><option value={num + 1} key={num}>{num + 1}</option>) // eslint-disable-line
                  : <option value={null}>-</option>}
              </select>
              {!added && <AddButton type="submit">Add to Cart</AddButton>}
            </>
          )}
          {!availableSkus && <p>OUT OF STOCK</p>}
          {added && <p>ADDED</p>}
        </AddToCartForm>
      ) : <p>LOADING...</p>}
    </div>
  );
}

const AddToCartView = styled(UnstyledAddToCartView)`
`;

export default AddToCartView;
