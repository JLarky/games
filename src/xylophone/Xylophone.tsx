import React from "react";
import { tw } from "twind";

const notes = {
  do: "bg-blue-800",
  re: "bg-green-500",
  mi: "bg-yellow-500",
  fa: "bg-orange-500",
  sol: "bg-red-500",
  la: "bg-purple-500",
  si: "bg-white",
  do2: "bg-blue-300",
};

const songs = {
  Чебурашка: `
    sol,la,sol,mi,do,mi,re
    fa,sol,fa,re,fa,la,sol
    si,do2,si,sol,mi,sol,fa,fa,sol,fa,sol,la,si
    sol,do2,do2,sol,si,la,la
    fa,si,si,fa,la,sol,sol,si,la,fa
    sol,mi,sol,fa,re,mi,do
  `,
  "Два весёлых гуся": `
    la,sol,fa,mi,si,si
    la,sol,fa,mi,si,si
    la,do2,do2,la,sol,si,si,sol
    fa,sol,la,fa,mi,mi
    la,do2,do2,la,sol,si,si,sol
    fa,sol,la,fa,mi,mi
  `,
};

export const Xylophone: React.FC = () => {
  const [songName, setSong] = React.useState<keyof typeof songs>();
  const song = songName && songs[songName];
  if (!song) {
    return (
      <div className={tw`grid gap-10 py-10 container mx-auto text-3xl`}>
        {Object.keys(songs).map((name) => {
          return (
            <button
              key={name}
              className={tw`h-48 w-1/3 bg-blue-500`}
              onClick={() => setSong(name as unknown as keyof typeof songs)}
            >
              {name}
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div className={tw`p-2 flex-wrap bg-indigo-50`}>
      {songName}
      {song
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => !!line)
        .map((notes, i) => {
          return (
            <div key={i} className={tw`flex p-2 flex-wrap`}>
              {notes.split(",").map((note, i) => {
                if (!isValidNote(note)) {
                  throw new Error(`wrong note ${note} in ${notes}`);
                }
                return <Note key={i} kind={note} />;
              })}
            </div>
          );
        })}
    </div>
  );
};

export const Note: React.FC<{ kind: keyof typeof notes }> = ({ kind }) => {
  return <div title={kind} className={tw(notes[kind], "w-6 h-20 m-1")} />;
};

function isValidNote(note: string): note is keyof typeof notes {
  return note in notes;
}
