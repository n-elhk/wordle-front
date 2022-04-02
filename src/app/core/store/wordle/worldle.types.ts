/**
 * Represents each action of brady tachy in store.
 */
export enum WordleActionTypes {
  Hydrate = '[Game Board] Hydrate',
  HydrateSuccess = '[Game Board] Hydrate success',
  HydrateFailure = '[Game Board] Hydrate  failure',

  GetWord = '[Game Board] Get current word',
  GetWordSuccess = '[Game Board] Get current words success',
  GetWordFailure = '[Game Board] Get current word failure',

  ChooseLetter = '[Game Board] Choose letter',
  ChooseLetterSuccess = '[Game Board] Choose letter success',
  ChooseLetterFailure = '[Game Board] Choose failure',

  DeleteLetter = '[Game Board] Delete letter',
  DeleteLetterSuccess = '[Game Board] Delete letter success',
  DeleteLetterFailure = '[Game Board] Delete failure',

  EnterWord = '[Game Board] Enter word',
  EnterWordSuccess = '[Game Board] Enter word success',
  EnterWordFailure = '[Game Board] Enter word failure',


  RowNotGuessed = '[Game Board] Row not guessed',
  RowNotGuessedSuccess = '[Game Board] Row not guessed success',

  GetNewWord = '[Game Board] Get new word',
}
