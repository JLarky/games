import React from "react";
import { useImmerReducer } from "use-immer";

import "./FindPicture.css";

import { getRandomAnimal, Animal } from "../animals";
import { getRandomColor } from "../colors";
import useDebounce from "../useDebounce";

const Card = (props: {
  color: string;
  animal: Animal;
  isBack: boolean;
  isSolved: boolean;
  onClick: () => void;
}) => {
  const { color, animal, isBack, isSolved, onClick } = props;
  const icon = require("../assets/svg/" + animal + ".svg");
  // const [isBack, setIsBack] = React.useState(false);
  const toggle = () => {
    // setIsBack(!isBack);
    onClick();
  };
  const wasSolved = useDebounce(isSolved, 1000);
  if (wasSolved) {
    return <div />;
  }
  return (
    <div className="flip-card-wrapper" onTouchStart={toggle}>
      <div className={`flip-card ${isBack || isSolved ? "is-flipped" : ""}`}>
        <div className="flip-card-inner">
          <div className="flip-card-front"></div>
          <div className="flip-card-back" style={{ backgroundColor: color }}>
            <img src={icon} alt="Avatar" />
          </div>
        </div>
      </div>
    </div>
  );
};

function getInitialState() {
  const animals = [getRandomAnimal(), getRandomAnimal(), getRandomAnimal()];
  const cards = animals.flatMap(animal => {
    const color = getRandomColor();
    const card = { color, animal, i: 0, isBack: false, isSolved: false };
    return [{ ...card }, { ...card }];
  });
  // https://stackoverflow.com/a/12646864
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  cards.forEach((x, i) => (x.i = i));
  return { animals, cards };
}

const initalState = getInitialState();

type Action = { type: "tiggle"; i: number };

function reducer(draft: typeof initalState, action: Action) {
  if (action.type === "tiggle") {
    draft.cards[action.i].isBack = !draft.cards[action.i].isBack;
    let animals = [] as string[];
    draft.cards.forEach(x => {
      if (x.isBack) {
        animals.push(x.animal);
      }
    });
    if (animals.length > 2) {
      draft.cards.forEach(x => {
        x.isBack = false;
      });
      draft.cards[action.i].isBack = true;
    }
    if (animals.length === 2 && animals[0] === animals[1]) {
      draft.cards.forEach(x => {
        if (x.isBack) {
          x.isSolved = true;
          x.isBack = false;
        }
      });
    }
  }
  return draft;
}
const FindPicture: React.FC = () => {
  React.useEffect(() => {
    document.title = "Find Pictrure Game";
    window.addEventListener("beforeinstallprompt", e => {
      // Stash the event so it can be triggered later.
    });
  });
  const [state, dispatch] = useImmerReducer(reducer, initalState);
  console.log(JSON.stringify(state.cards), dispatch);
  const onClick = (i: number) => () => {
    dispatch({ type: "tiggle", i });
  };
  return (
    <div className="cards-grid">
      {state.cards.map(x => (
        <Card
          key={x.i}
          animal={x.animal}
          color={x.color}
          isBack={x.isBack}
          isSolved={x.isSolved}
          onClick={onClick(x.i)}
        />
      ))}
    </div>
  );
};

export default FindPicture;
