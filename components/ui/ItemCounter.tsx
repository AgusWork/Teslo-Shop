import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import React, { FC } from "react";

interface Props {
 updatedQuantity: (value: number) => void;
  currentValue: number;
  maxValue:number;
}

export const ItemCounter: FC<Props> = ({
 updatedQuantity,
  currentValue,
  maxValue
}) => {

  const addOrRemove = (value: number) => {
    if (value === -1) {
      if (currentValue == 1) return ; 
      return updatedQuantity( currentValue - 1 )
    }
    if (currentValue == maxValue) return;
    updatedQuantity(currentValue + 1)
  }


  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={() =>addOrRemove(-1)}>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: "40px", textAlign: "center" }}>
        {currentValue}
      </Typography>
      <IconButton onClick={() =>addOrRemove(+1)}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
