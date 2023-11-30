/* eslint-disable no-restricted-syntax */
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import FormHeading from './ReviewForm/FormHeading.jsx'; // eslint-disable-line
import OverallRating from './ReviewForm/OverallRating.jsx'; // eslint-disable-line
import Recomended from './ReviewForm/Recomended.jsx'; // eslint-disable-line
import Characteristics from './ReviewForm/Characteristics.jsx'; // eslint-disable-line
import UploadPhoto from './ReviewForm/UploadPhoto.jsx'; // eslint-disable-line
import ButtonWrapper from '../UI/StyledButton.js'; // eslint-disable-line

const Wrapper = styled.form`
  background: white;
  max-width: 680px;
  padding: 0 36px 24px;
  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  overflow-y: scroll;

  textarea {
    resize: none;
    margin-bottom: 12px;
  }
`;

const ReviewSummary = styled.textarea``;
const ReviewBody = styled.textarea``;
const InfoInput = styled.input``;
const ButtonWrapperWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

function ReviewForm({ productName, productId, currentCharacteristics }) { // eslint-disable-line

  const initialCharacteristics = useMemo(() => {
    const result = {};
    for (const [k, v] of Object.entries(currentCharacteristics)) {
      result[k.toLowerCase()] = { ...v, value: null };
    }
    return result;
  }, [currentCharacteristics]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [recommend, setRecommend] = useState('yes');
  const [characteristics, setCharacteristics] = useState(
    initialCharacteristics,
  );
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [images, setImages] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleChangeRating = (val) => {
    setRating(val);
  };
  const handleImageChange = (newImgs) => {
    setImages((curImgs) => [...curImgs, ...newImgs]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setRating(5);
    setRecommend('yes');
    setCharacteristics(initialCharacteristics);
    setSummary('');
    setBody('');
    setImages([]);
    setName('');
    setEmail('');
    const postCharacteristics = {};
    for (const v of Object.values(characteristics)) {
      postCharacteristics[v.id] = Number(v.value);
    }
    const objToPost = {
      product_id: Number(productId),
      rating,
      summary,
      body,
      recommend: recommend === 'yes',
      name,
      email,
      photos: images,
      characteristics: postCharacteristics,
    };

    axios
      .post(
        'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/reviews',
        objToPost,
        {
          headers: {
            Authorization: process.env.AUTH_TOKEN,
          },
        },
      )
      .then(() => {
        setIsSubmitting(false);
        toast.success('Your form is successfully submitted');
      })
      .catch((err) => {
        setIsSubmitting(false);
        toast.error(err.message);
      });
  };

  return (
    <Wrapper onSubmit={handleSubmit}>
      {isSubmitting ? (
        <div>Loading...</div>
      ) : (
        <>
          <FormHeading productName={productName} />
          <OverallRating
            rating={rating}
            handleChangeRating={handleChangeRating}
          />
          <Recomended recommend={recommend} setRecommend={setRecommend} />
          <Characteristics
            characteristics={characteristics}
            setCharacteristics={setCharacteristics}
          />
          <ReviewSummary
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Review Summary. Up to 60 characters"
            maxLength={60}
            rows="2"
            required
          />
          <ReviewBody
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Review Body. Up to 1000 characters"
            maxLength={1000}
            rows="5"
            required
          />
          <UploadPhoto images={images} handleImageChange={handleImageChange} />
          <InfoInput
            type="text"
            value={name}
            placeholder="Your Nickname"
            required
            onChange={(e) => setName(e.target.value)}
          />
          <InfoInput
            type="email"
            value={email}
            placeholder="Your email: example@mail.com"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </>
      )}
      <ButtonWrapperWrapper>
        <ButtonWrapper
          as="input"
          type="submit"
          width="120px"
          value={isSubmitting ? 'Submitting...' : 'Submit'}
          disabled={isSubmitting}
        />
      </ButtonWrapperWrapper>
    </Wrapper>
  );
}

export default ReviewForm;
