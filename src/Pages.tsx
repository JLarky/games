import React from "react";

import FindPicture from "./findPicture/FindPicture";

export const Pages: React.FC = () => {
  const [game, setGame] = React.useState<"picture">();
  if (game === "picture") {
    return <FindPicture />;
  }

  return (
    <div className="grid gap-10 py-10 container mx-auto text-3xl">
      {([["picture", "Pictures", "#37B6F6"]] as const).map(
        ([section, label, color]) => (
          <button
            className="h-48 w-1/3"
            style={{ backgroundColor: color }}
            onClick={() => setGame(section)}
          >
            {label}
          </button>
        )
      )}
    </div>
  );
};
