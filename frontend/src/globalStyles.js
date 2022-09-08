import styled, { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';

const GlobalStyle = createGlobalStyle`
  *{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    
    /* font-family: 'Montserrat', sans-serif; */
    font-family: 'Source Sans Pro', sans-serif;

  }
`;

export const Container = styled.div`
  z-index: 1;
  width: 100%;
  max-width: 1300px;
  margin: ${({ margin }) => (margin ? margin : '0 auto')};
  padding: ${({ padding }) => (padding ? padding : '0 50px')};

  @media screen and (max-width: 960px) {
    padding-right: 30px;
    padding-left: 30px;
  }
`;
export const MainHeading = styled.h1`
  font-size: clamp(2.3rem, 6vw, 4.5rem);
  margin-bottom: 2rem;
  color: ${({ inverse }) => (inverse ? '$403ae3' : '#fff')};
  width: 100%;
  text-align: center;
  letter-spacing: 4px;
`;

export const Heading = styled.h2`
  font-size: clamp(1.3rem, 6vw, 3.1rem);
  margin: ${({ margin }) => (margin ? margin : '')};
  margin-bottom: ${({ mb }) => (mb ? mb : '')};
  margin-top: ${({ mt }) => (mt ? mt : '')};
  color: ${({ inverse }) => (inverse ? '$403ae3' : '#fff')};
  letter-spacing: 0.4rem;
  text-align: center;
  width: ${({ width }) => (width ? width : '')};
`;
export const TextWrapper = styled.span`
  font-size: ${({ size }) => (size ? size : '')};
  font-weight: ${({ weight }) => (weight ? weight : '')};
  letter-spacing: ${({ spacing }) => (spacing ? spacing : '')};
  text-align: ${({ align }) => (align ? align : '')};
  padding: ${({ padding }) => (padding ? padding : '')};
  margin: ${({ margin }) => (margin ? margin : '')};
  margin-bottom: ${({ mb }) => (mb ? mb : '')};
  margin-top: ${({ mt }) => (mt ? mt : '')};
  width: ${({ width }) => (width ? width : 'auto')};
  min-width: ${({ minWidth }) => (minWidth ? minWidth : '')};
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : '')};
  height: ${({ height }) => (height ? height : '')};
  max-height: ${({ maxHeight }) => (maxHeight ? maxHeight : '')};
  min-height: ${({ minheight }) => (minheight ? minheight : '')};
  color: ${({ color }) => (color ? color : '')};
`;
export const Section = styled.section`
  padding: ${({ padding }) => (padding ? padding : '140px 0')};
  margin: ${({ margin }) => (margin ? margin : '')};
  background: ${({ inverse }) => (inverse ? '#101522' : 'white')};
  color: ${({ inverse }) => (inverse ? 'white' : 'black')};
  position: ${({ position }) => (position ? position : '')};
  width: ${({ width }) => (width ? width : 'auto')};
  min-width: ${({ minWidth }) => (minWidth ? minWidth : '')};
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : '')};
  height: ${({ height }) => (height ? height : '')};
  max-height: ${({ maxHeight }) => (maxHeight ? maxHeight : '')};
  min-height: ${({ minHeight }) => (minHeight ? minHeight : '')};

  @media screen and (max-width: 768px) {
    padding: ${({ smPadding }) => (smPadding ? smPadding : '70px 0')};
  }
`;

export const Row = styled.div`
  display: flex;
  justify-content: ${({ justify }) => (justify ? justify : '')};
  align-items: ${({ align }) => (align ? align : '')};
  gap: ${({ gap }) => (gap ? gap : '')};
  padding: ${({ padding }) => (padding ? padding : '')};
  margin: ${({ margin }) => (margin ? margin : '')};
  margin-bottom: ${({ mb }) => (mb ? mb : '')};
  margin-top: ${({ mt }) => (mt ? mt : '')};
  position: ${({ position }) => (position ? position : '')};
  width: ${({ width }) => (width ? width : '100%')};
  min-width: ${({ minWidth }) => (minWidth ? minWidth : '')};
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : '')};
  height: ${({ height }) => (height ? height : '')};
  max-height: ${({ maxHeight }) => (maxHeight ? maxHeight : '')};
  min-height: ${({ minHeight }) => (minHeight ? minHeight : '')};
  flex-wrap: ${({ wrap }) => (wrap ? wrap : '')};
  color: ${({ color }) => (color ? color : '')};
  text-align: ${({ textAlign }) => (textAlign ? textAlign : '')};
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${({ justify }) => (justify ? justify : '')};
  align-items: ${({ align }) => (align ? align : '')};
  gap: ${({ gap }) => (gap ? gap : '')};
  padding: ${({ padding }) => (padding ? padding : '')};
  margin: ${({ margin }) => (margin ? margin : '')};
  margin-bottom: ${({ mb }) => (mb ? mb : '')};
  margin-top: ${({ mt }) => (mt ? mt : '')};
  position: ${({ position }) => (position ? position : '')};
  width: ${({ width }) => (width ? width : '')};
  min-width: ${({ minWidth }) => (minWidth ? minWidth : '')};
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : '')};
  height: ${({ height }) => (height ? height : '')};
  max-height: ${({ maxHeight }) => (maxHeight ? maxHeight : '')};
  min-height: ${({ minHeight }) => (minHeight ? minHeight : '')};
  color: ${({ color }) => (color ? color : '')};
  text-align: ${({ textAlign }) => (textAlign ? textAlign : '')};
`;

export const Button = styled(motion.button)`
  border-radius: 4px;
  background: #d61eed;
  white-space: nowrap;
  padding: ${({ big }) => (big ? '12px 64px' : '10px 20px')};
  color: #fff;
  font-size: ${({ fontBig }) => (fontBig ? '20px' : '16px')};
  outline: none;
  border: none;
  cursor: pointer;

  /* overflow: hidden; */
  /* position: relative; */
  /* 
  &:before {
    transition: all 0.6s ease-out;
    color: black;
    background-color: #ebc214;
    background: #fff;
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    width: 100%;
    height: 0%;
    transform: translate(-50%, -50%) rotate(45deg);
  } */

  /* &:hover:before {
    height: 500%;
  } */

  &:hover {
    transition: all 0.3s ease-out;
    /* background: #fff; */
    color: black;
    background-color: #ebc214;
  }
`;

// export const Button = styled.button`
//   border-radius: 4px;
//   background: none;
//   white-space: nowrap;
//   padding: 10px 20px;
//   font-size: 16px;
//   color: #fff;
//   outline: none;
//   border: 2px solid #fff;
//   cursor: pointer;
//   overflow: hidden;
//   position: relative;
//   &:before {
//     background: #fff;
//     content: '';
//     position: absolute;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     z-index: -1;
//     transition: all 0.6s ease;
//     width: 100%;
//     height: 0%;
//     transform: translate(-50%, -50%) rotate(45deg);
//   }
//   &:hover:before {
//     height: 500%;
//   }
//   &:hover {
//     color: black;
//   }
// `;

export const lightTheme = {
  bg: 'rgb(255,255,255)',
  bgAlpha: 'rgba(250,250,250,.3)',
  bg2: 'rgb(245,245,245)',
  bg3: 'rgb(230,230,230)',
  text: 'rgb(45,45,45)',
  primary: 'rgb(52, 131, 235)',
};
export const darkTheme = {
  bg: 'rgb(15,15,15)',
  bgAlpha: 'rgba(0,0,0,.3)',
  bg2: 'rgb(30,30,30)',
  bg3: 'rgb(50,50,50)',
  text: 'rgb(210,210,210)',
  primary: 'rgb(52, 131, 235)',
};

export default GlobalStyle;
