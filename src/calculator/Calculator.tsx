import React, { useState } from "react";

import style from "./Calculator.module.css";

export const Calculator: React.FC = () => {
  const [value, setValue] = useState<number | undefined>(undefined);
  return (
    <Layout
      left={[7, 4, 1, 0, 8, 5, 2, ".", 9, 6, 3]}
      right={["/", "x", "-", "+"]}
      onClick={(button) => {
        if (typeof button === "number") {
          setValue(button);
        }
      }}
    >
      {value !== undefined && (
        <>
          1+{value}={1 + value}
        </>
      )}
    </Layout>
  );
};

const Layout: React.FC<{
  left: (string | number)[];
  right: string[];
  onClick: (button: string | number) => void;
}> = ({ left, right, onClick, children }) => {
  return (
    <div className={`${style.calc} h-screen flex flex-col`}>
      <div className="flex-1 text-right py-4 px-4 flex-none bg-white">
        <div className="text-5xl flex-none h-32">{children}</div>
      </div>
      <div className="flex-1 flex">
        <div className="w-9/12 flex-none grid place-items-center grid-rows-4 grid-flow-col">
          {left.map((x) => {
            return (
              <button
                key={x}
                className={`${style.button} ${style.wavesEffect} rounded-full`}
                onClick={() => onClick(x)}
              >
                {x}
              </button>
            );
          })}
        </div>
        <div className={`${style.divider} border-l-2`} />
        <div className="w-3/12 flex-1 grid place-items-center grid-rows-4 grid-flow-col">
          {right.map((x) => {
            return (
              <button
                key={x}
                className={`${style.button} ${style.blue} focus:bg-blue-500 hover:bg-blue-500 active:bg-blue-500 rounded-full`}
              >
                {x}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
