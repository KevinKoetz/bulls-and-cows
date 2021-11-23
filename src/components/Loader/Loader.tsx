import React, { FC, ReactElement, useEffect, useState } from "react";
import "./Loader.css";

const Loader: FC = (): ReactElement => {
  const [dots, setDots] = useState("")
  useEffect(()=>{
    const interval = setInterval(()=>{
      const newDots = Array((dots.length + 1)%4).fill(".").join("")
      setDots(newDots)
    },500)
    return () => {
      clearInterval(interval)
    }
  })
  return (
    <div className="Loader">
      {`Evaluating your Function${dots}`}
    </div>
  );
};

export default Loader;
