import React, { useState } from "react";
import useInterval from "../utils/useInterval";
import TimerControls from "./TimerControls";
import PlayPauseStop from "./PlayPauseStop";
import TimeDisplay from "./TimeDisplay";




function Pomodoro() {

  const initialState = {
    play: false,
    pause: true,
    typeOfSession: 'focus',
    timeInSession: 0,
    focus: 25,
    break: 5,
  };

  const ranges = {
    focus: [5, 60],
    break: [1, 15],
  }
  const [session, setSession] = useState(initialState);

  function timerControlsHandler(plusOrMinus, sessionType) {
    const initialTime = session[sessionType];
    const range = ranges[sessionType];
    const increment = sessionType === 'focus' ? 5 : 1;
    const adjustedTime = plusOrMinus === 'plus' ? Math.min(initialTime + increment, range[1])
      : Math.max(initialTime - increment, range[0]);
    setSession((session) => ({
      ...session,
        [sessionType]: adjustedTime,
      }));
  }

function timer() {
  setSession((session) => ({
    ...session,
      timeInSession: session.timeInSession + 1
    }));
}

function nextSession() {
  new Audio('https://bigsoundbank.com/UPLOAD/mp3/1830.mp3').play();
  const switchSession = session.typeOfSession === 'focus' ? 'break' : 'focus';
  setSession((session) => ({
    ...session,
      typeOfSession: switchSession,
      timeInSession: 0,
    }));
}


  function playPauseHandler() {
    setSession((session) => ({
      ...session,
        pause: !session.pause,
        play: true,
    }));
  }
  function stopHandler() {
    setSession((session) => ({
      ...initialState
    }));
  }

  function endSession() {
    return session.timeInSession === session[session.typeOfSession] * 60;
  }
    useInterval(() => {
    if (endSession()) nextSession();
      else timer();
    },
      session.pause ? null : 1000
  );

  return (
    <div className="pomodoro">

      <TimerControls 
      timerControlsHandler={timerControlsHandler}
      disabled={session.play}
      sessionType={['focus', 'break']}
      time={[session.focus, session.break]}
      />
      <PlayPauseStop 
      pause={session.pause}
      play={session.play}
      stopHandler={stopHandler}
      playPauseHandler={playPauseHandler}
      />
      <TimeDisplay 
      typeOfSession={session.typeOfSession}
      play={session.play}
      pause={session.pause}
      sessionTimes={[session.focus, session.break]}
      timeInSession={session.timeInSession}
      />        
    </div>
  );
}

export default Pomodoro;