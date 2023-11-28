import React from 'react';
import styled from 'styled-components';
import ProductStarRating from '../../ReviewStars/ProductStarRating.jsx'; // eslint-disable-line

function UnstyledProductDetailsView({ productInfo, currentStyle }) { // eslint-disable-line
  const onSale = React.useMemo(() => currentStyle ? !!currentStyle.sale_price : false, [currentStyle]) // eslint-disable-line
  const OriginalPrice = styled.p`
    ${onSale && (`
      color: red;
      text-decoration: line-through
    `)}
  `;

  const ProductRating = styled(ProductStarRating)`
    font-size: 1px;
    margin: 0px;
  `;

  const ProductCategory = styled.p`
    margin-top: 10px;
    margin-bottom: 10px;
  `;

  const ProductName = styled.h2`
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 30px;
  `;
  const ProductDescription = styled.p`
    margin-top: 10px;
    margin-bottom: 10px;
    max-height: 10.5vh;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  `;

  return (
    <div>
      {productInfo && (
        <>
          <ProductRating productId={productInfo.id} /> {/*eslint-disable-line*/}
          <ProductCategory>{productInfo.category.toUpperCase()}</ProductCategory> {/*eslint-disable-line*/}
          <ProductName>{productInfo.name}</ProductName> {/*eslint-disable-line*/}
          { currentStyle && (
            <>
              <OriginalPrice>{`$${currentStyle.original_price}`}</OriginalPrice> {/*eslint-disable-line*/}
              {onSale && <p>{`$${currentStyle.sale_price}`}</p>} {/*eslint-disable-line*/}
            </>
          )}
          <ProductDescription>{productInfo.description}</ProductDescription> {/*eslint-disable-line*/}
        </>
      )}
    </div>
  );
}

const ProductDetailsView = styled(UnstyledProductDetailsView)`

`;

export default ProductDetailsView;
