import React from "react";
import { useImmerReducer } from "use-immer";

import "./FindPicture.css";

import { getRandomAnimal, Animal } from "../animals";
import { getRandomColor } from "../colors";
import useDebounce from "../useDebounce";

const checkmark = require("../assets/checkmark.svg");

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
  const animals = [
    getRandomAnimal(),
    getRandomAnimal(),
    getRandomAnimal(),
    getRandomAnimal(),
    getRandomAnimal(),
    getRandomAnimal()
  ];
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
  return { animals, cards, isSolved: false };
}

const initalState = getInitialState();

type Action = { type: "tiggle"; i: number } | { type: "restart" };

function reducer(draft: typeof initalState, action: Action) {
  if (action.type === "tiggle") {
    draft.cards[action.i].isBack = !draft.cards[action.i].isBack;
    let animals = [] as string[];
    let hasUnsolved = false;
    draft.cards.forEach(x => {
      if (x.isBack) {
        animals.push(x.animal);
      } else if (!x.isBack && !x.isSolved) {
        hasUnsolved = true;
      }
    });
    if (animals.length === 2 && animals[0] === animals[1]) {
      draft.cards.forEach(x => {
        if (x.isBack) {
          x.isSolved = true;
          x.isBack = false;
        }
      });
    }
    if (animals.length > 2) {
      draft.cards.forEach(x => {
        x.isBack = false;
      });
      draft.cards[action.i].isBack = true;
    }
    draft.isSolved = !hasUnsolved;
  } else if (action.type === "restart") {
    draft = { ...draft, ...getInitialState() };
  }
  return draft;
}
const FindPicture: React.FC = () => {
  const firstState = loadCardsState();
  React.useEffect(() => {
    document.title = "Find Pictrure Game";
    window.addEventListener("beforeinstallprompt", e => {
      // Stash the event so it can be triggered later.
    });
    window.oncontextmenu = () => false;
  }, []);
  const [state, dispatch] = useImmerReducer(reducer, firstState);
  React.useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(state.cards));
  }, [state.cards]);
  const onClick = (i: number) => () => {
    dispatch({ type: "tiggle", i });
  };
  const onRestart = () => {
    dispatch({ type: "restart" });
  };
  const wasSolved = useDebounce(state.isSolved, 1000);
  return (
    <div className="cards-grid">
      {wasSolved && state.isSolved ? (
        <div className="restart" onTouchStart={onRestart}>
          <div className="checkmark">
            <img src={checkmark} alt="Great job" width="100%" />
          </div>
        </div>
      ) : (
        state.cards.map(x => (
          <Card
            key={x.i}
            animal={x.animal}
            color={x.color}
            isBack={x.isBack}
            isSolved={x.isSolved}
            onClick={onClick(x.i)}
          />
        ))
      )}
    </div>
  );
};

function loadCardsState() {
  const cardsJS = localStorage.getItem("cards");
  if (cardsJS) {
    const cards = JSON.parse(cardsJS);
    const state = { ...initalState };
    state.cards = cards;
    return state;
  }
  return initalState;
}

export default FindPicture;
