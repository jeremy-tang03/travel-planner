import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";

const ContextMenu = styled.div`
  position: absolute;
  width: 175px;
  background-color: #08131d;
  color: white;
  border-radius: 5px;
  box-sizing: border-box;
  z-index: 999;
  ${({ bottom, left }) => css`
    top: ${bottom}px;
    left: ${left}px;
  `}
  ul {
    box-sizing: border-box;
    padding: 10px;
    margin: 0;
    list-style: none;
  }
  ul li {
    padding: 10px 7px;
  }
  ul li:hover {
    cursor: pointer;
    background-color: #0d1e2e;
  }
`;

const MenuContext = ({ clicked, mousePos, handleView, handleEdit, handleDelete }) => {
  return (
    <>
      {clicked && (
        <ContextMenu bottom={mousePos.y-15} left={mousePos.x+5}>
          <ul>
            <li onClick={handleView}>View</li>
            <li onClick={handleEdit}>Edit</li>
            <li onClick={handleDelete}>Delete</li>
          </ul>
        </ContextMenu>
      )}
    </>
  );
};
export default MenuContext;