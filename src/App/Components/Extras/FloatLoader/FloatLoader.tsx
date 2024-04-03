import { type FC, type CSSProperties } from 'react';
import '../../../styles/Flow/FloatLoader.css';
import { Button, Col, Row } from 'react-bootstrap';
import Atoms from '../../../Constants/Atoms';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { HiOutlinePlusCircle, HiOutlinePlay, HiOutlineCollection, HiSaveAs, HiSave } from "react-icons/hi";

const FloatLoader: FC<any> = ({ text, open, backgroundColor, textColor }) => {
  return (
    <>
      <div className={`float-text-container ${open ? 'show' : 'noShow'}`} style={{ backgroundColor: backgroundColor }}>
      <div className='loader'></div>
        <span style={{ color: textColor }}>{text}</span>
      </div>
    </>
  );
};

export default FloatLoader;
