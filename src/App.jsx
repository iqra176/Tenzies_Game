import './App.css'
import { useState, useRef, useEffect } from "react"
import Die from './Die'
import { nanoid } from "nanoid" 
import Confetti from "react-confetti"

export default function App() {
    const [dice, setDice] = useState(() => generateAllNewDice())
    // Creates an array of 10 dice objects
    // Each die has: a random value (1-6), isHeld: false (not frozen,it will change its value when the user clicks the "Roll" button),a unique id
    const buttonRef = useRef(null)

    const gameWon = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)
        // Game is considered won if:All dice are held (frozen),And all dice have the same value

    useEffect(() => {
        if (gameWon) {
            buttonRef.current.focus()
        }
    }, [gameWon]) //When the game is won, the button is auto-focused

    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
            }))
    }  //Generates a fresh set of 10 dice each with:a random value from 1 to 6,isHeld = false,a unique ID.
    
    function rollDice() {
        if (!gameWon) {
            setDice(oldDice => oldDice.map(die =>
                die.isHeld ?
                    die :
                    { ...die, value: Math.ceil(Math.random() * 6) }
            ))
        } else {
            setDice(generateAllNewDice())
        }
    } // If the game is not won, it:Keeps the held dice as-is.Re-rolls the rest with new random values.
    // If the game is won, it:Resets the board with 10 new dice (new game).

    function hold(id) {
        setDice(oldDice => oldDice.map(die =>
            die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        ))
    } //When you click on a die, it toggles its isHeld value.This lets you freeze/unfreeze that die.

    const diceElements = dice.map(dieObj => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}
        />
    ))
//This maps over the dice array and renders a <Die /> component for each.Each die gets props for its value, held state, and the hold function.
    return (
        <main>
            {gameWon && <Confetti />}
            <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            </div>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
                {gameWon ? "New Game" : "Roll"}
            </button>
        </main>
    )
}