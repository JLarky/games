import React from "react";
import { useImmerReducer } from "use-immer";

import "./FindPicture.css";

import { getRandomAnimal, type Animal } from "../animals";
import { getRandomColor } from "../colors";
import useDebounce from "../useDebounce";

import checkmark from "../assets/checkmark.svg?url";

const Card = (props: {
  color: string;
  animal: Animal;
  isBack: boolean;
  isSolved: boolean;
  onClick: () => void;
}) => {
  const { color, animal, isBack, isSolved, onClick } = props;
  const icon = "/assets/svg/" + animal + ".svg";
  const title = String(animal).replace("_", " ");
  // const [isBack, setIsBack] = React.useState(false);
  const toggle = () => {
    document.title = `find another ${animal}`;
    // setIsBack(!isBack);
    onClick();
  };
  const wasSolved = useDebounce(isSolved, 1000);
  if (wasSolved) {
    return <div />;
  }
  return (
    <div className="flip-card-wrapper" onPointerDown={toggle}>
      <div className={`flip-card ${isBack || isSolved ? "is-flipped" : ""}`}>
        <div className="flip-card-inner">
          <div className="flip-card-front"></div>
          <div className="flip-card-back" style={{ backgroundColor: color }}>
            <img src={icon} alt={title} />
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
    getRandomAnimal(),
  ];
  const cards = animals.flatMap((animal) => {
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
    const openCardIndexes = draft.cards.reduce((acc, card, i) => {
      if (card.isBack) {
        acc.push(i);
      }
      return acc;
    }, [] as number[]);
    const compare = ([i, j]: [number, number]) => {
      return draft.cards[i].animal === draft.cards[j].animal;
    };
    const solve = (indexes: number[]) => {
      indexes.forEach((i) => {
        draft.cards[i].isBack = false;
        draft.cards[i].isSolved = true;
      });
    };
    if (openCardIndexes.length === 2) {
      const [i1, i2] = openCardIndexes;
      if (compare([i1, i2])) {
        solve([i1, i2]);
      }
    }
    if (openCardIndexes.length === 3) {
      const [i1, i2, i3] = openCardIndexes;
      if (compare([i1, i2])) {
        solve([i1, i2]);
      } else if (compare([i2, i3])) {
        solve([i2, i3]);
      } else if (compare([i1, i3])) {
        solve([i1, i3]);
      } else {
        draft.cards[i1].isBack = false;
        draft.cards[i2].isBack = false;
        draft.cards[i3].isBack = false;
        draft.cards[action.i].isBack = true;
      }
    }
    draft.isSolved = draft.cards.every((x) => x.isSolved);
  } else if (action.type === "restart") {
    draft = { ...draft, ...getInitialState() };
  }
  return draft;
}
const FindPicture: React.FC = () => {
  const firstState = loadCardsState();
  React.useEffect(() => {
    document.title = "Find Pictrure Game";
    window.addEventListener("beforeinstallprompt", () => {
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
        <div className="restart" onPointerDown={onRestart}>
          <div className="checkmark">
            <img src={checkmark} alt="Great job" width="100%" />
          </div>
        </div>
      ) : (
        state.cards.map((x) => (
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
    state.isSolved = state.cards.every((x) => x.isSolved);
    return state;
  }
  return initalState;
}

export default FindPicture;
