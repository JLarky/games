import React from "react";
import { tw } from "twind";

import { Calculator } from "./calculator/Calculator";
import { Xylophone } from "./calculator/Xylophone";
import FindPicture from "./findPicture/FindPicture";

export const Pages: React.FC = () => {
  const [game, setGame] = React.useState<
    "picture" | "calculator" | "keyboard" | "clock" | "allogator" | "xylophone"
  >();
  React.useEffect(() => {
    if (game === "keyboard") {
      window.location.href = "https://typing-for-kids.vercel.app/?dictionary=numbers";
    } else if (game === "clock") {
      window.location.href = "https://h2bcq.csb.app/";
    } else if (game === "allogator") {
      window.location.href = "http://tibordp.github.io/gator-calculus/";
    }
  });

  if (game === "picture") {
    return <FindPicture />;
  } else if (game === "calculator") {
    return <Calculator />;
  } else if (game === "xylophone") {
    return <Xylophone />;
  } else if (game === "keyboard" || game === "clock") {
    return null;
  }

  return (
    <div className={tw`grid gap-10 py-10 container mx-auto text-3xl`}>
      {([
        ["picture", "Pictures", "#37B6F6"],
        ["keyboard", "Typing practice", "#37B6F6"],
        ["calculator", "Calc", "#37B6F6"],
        ["clock", "Clock", "#37B6F6"],
        ["allogator", "Alligator", "#37B6F6"],
        ["xylophone", "Xylophone", "#37B6F6"],
      ] as const).map(([section, label, color]) => (
        <button
          key={section}
          className={tw`h-48 w-1/3`}
          style={{ backgroundColor: color }}
          onClick={() => setGame(section)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
