import React from 'react';
import useReviewRating, {
  StatusEnum,
} from '../../hooks/ReviewStars/useReviewsRating.js'; // eslint-disable-line
import StarsRating from './StarsRating.jsx'; // eslint-disable-line

export function calculateAverageRating(ratings) {
  // FIXME: move to a util folder.
  const totalScore =
    (1 * Number(ratings[1]) || 0) +
    (2 * Number(ratings[2]) || 0) +
    (3 * Number(ratings[3]) || 0) +
    (4 * Number(ratings[4]) || 0) +
    (5 * Number(ratings[5]) || 0);

  const totalCount =
    (Number(ratings[1]) || 0) +
    (Number(ratings[2]) || 0) +
    (Number(ratings[3]) || 0) +
    (Number(ratings[4]) || 0) +
    (Number(ratings[5]) || 0);

  return totalCount === 0 ? 0 : totalScore / totalCount;
}

function ProductStarRating({ productId }) { // eslint-disable-line
  const { productReview, status, error } = useReviewRating(productId);
  if (status === StatusEnum.pending) {
    return <div>Pending...</div>; // FIXME: Fancier pending state.
  }
  if (status === StatusEnum.error) {
    return <div>{error}</div>;
  }
  if (status === StatusEnum.success) {
    return (
      <StarsRating stars={calculateAverageRating(productReview.ratings)} />
    );
  }
}

export default React.memo(ProductStarRating);
