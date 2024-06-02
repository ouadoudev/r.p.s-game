
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from './components/ui/form';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { gsap } from 'gsap';
import Loader from './components/Loader';

const getUserChoice = (userInput) => {
  userInput = userInput.toLowerCase();
  if (userInput === 'rock' || userInput === 'scissors' || userInput === 'paper') {
    return userInput;
  } else {
    return null; // Returning null for invalid choice
  }
};

const getComputerChoice = () => {
  const randomNumber = Math.floor(Math.random() * 3);
  switch (randomNumber) {
    case 0:
      return 'rock';
    case 1:
      return 'paper';
    case 2:
      return 'scissors';
    default:
      return;
  }
};

const determineWinner = (userChoice, computerChoice) => {
  if (userChoice === computerChoice) {
    return 'tie';
  }
  if (
    (userChoice === 'rock' && computerChoice === 'scissors') ||
    (userChoice === 'paper' && computerChoice === 'rock') ||
    (userChoice === 'scissors' && computerChoice === 'paper')
  ) {
    return 'user';
  } else {
    return 'computer';
  }
};

// Function to play notification sound
const playNotificationSound = (soundFile) => {
  const audio = new Audio(soundFile);
  audio.play();
  return audio; // Return the audio object for controlling playback
};

function App() {
  const [userName, setUserName] = useState('');
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);
  const [userChoice, setUserChoice] = useState('');
  const [computerChoice, setComputerChoice] = useState('');
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameResult, setGameResult] = useState('');
  const [notificationSound, setNotificationSound] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to(".loading", { duration: 5, opacity: 1, onComplete: () => setIsLoading(false) });
  }, []);

  useEffect(() => {
    // Cleanup function to stop sound when component unmounts
    return () => {
      if (notificationSound) {
        notificationSound.pause();
      }
    };
  }, [notificationSound]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    setIsNameSubmitted(true);
  };

  const playGame = (choice) => {
    const userChoice = getUserChoice(choice);
    if (!userChoice) return; // Exit if user choice is invalid

    const computerChoice = getComputerChoice();
    setUserChoice(userChoice);
    setComputerChoice(computerChoice);
    const result = determineWinner(userChoice, computerChoice);
    if (result === "user") {
      setUserScore(prevScore => prevScore + 1);
    } else if (result === "computer") {
      setComputerScore(prevScore => prevScore + 1);
    }
    setGameResult(result === "user" ? "Congratulations, you won!" : result === "computer" ? "Sorry, computer won!" : "This game is a tie");

    // Play sound based on the overall game result
    if ((userScore === 2 && result === "user") || (computerScore === 2 && result === "computer")) {
      const soundFile = result === "user" ? '/mp3/win.wav' : '/mp3/lose.wav';
      const sound = playNotificationSound(soundFile);
      setNotificationSound(sound);
    }
  };

  const resetGame = () => {
    setUserChoice('');
    setComputerChoice('');
    setNotificationSound(null); // Stop the sound
    const winner = userScore === 3 ? userName : "Computer";
    setGameResult(`${winner} is the overall winner!`);

    // Reset scores
    setUserScore(0);
    setComputerScore(0);
  };

  return (
    <div className='py-6'>
      {isLoading ? (
     <Loader/>
      ) : (
        <Card className="max-w-md mx-auto mt-10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Rock Paper Scissors</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {!isNameSubmitted ? (
              <Form>
                <form onSubmit={handleNameSubmit} className="text-center">
                  <Label className="block text-lg font-bold mb-2">Enter your name:</Label>
                  <Input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="border border-gray-300 py-2 px-4 rounded mb-4"
                    required
                  />
                  <Button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                    Submit
                  </Button>
                </form>
              </Form>
            ) : (
              <>
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold">Hello, {userName}! Let's play Rock Paper Scissors!</h2>
                </div>
                <div className="flex justify-around mb-4">
                  <Button
                    onClick={() => playGame('rock')}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                    disabled={userScore === 3 || computerScore === 3}
                  >
                    Rock
                  </Button>
                  <Button
                    onClick={() => playGame('paper')}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                    disabled={userScore === 3 || computerScore ===3 || computerScore === 3}
                    >
                      Paper
                    </Button>
                    <Button
                      onClick={() => playGame('scissors')}
                      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                      disabled={userScore === 3 || computerScore === 3}
                    >
                      Scissors
                    </Button>
                  </div>
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold">Scores</h2>
                    <p>{userName}: {userScore}</p>
                    <p>Computer: {computerScore}</p>
                  </div>
                  {userChoice && computerChoice && (
                    <div className="text-center">
                      <h2 className="text-xl font-bold mb-2">Game Result</h2>
                      <p className="mb-1">You threw: <span className="font-semibold">{userChoice}</span></p>
                      <p className="mb-1">The computer threw: <span className="font-semibold">{computerChoice}</span></p>
                      <p className="mt-4">{gameResult}</p>
                    </div>
                  )}
                  {(userScore === 3 || computerScore === 3) && (
                    <div className="text-center mt-4">
                      <h2 className="text-2xl font-bold">{gameResult}</h2>
                      <Button
                        onClick={resetGame}
                        className="bg-purple-500 text-white py-2 px-4 rounded mt-4 hover:bg-purple-700"
                      >
                        Play Again
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
  
  export default App;
   
