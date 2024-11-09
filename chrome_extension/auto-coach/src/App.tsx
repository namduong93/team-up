import './App.css'
import { useState } from 'react'

function App() {

  const [teamList, _] = useState([
    {
      teamName: "Charizard",
      members: [
        {
          preferredName: "this_username",
          title: "Mr.",
          name: "Jimmy Johnson",
          sex: "Male"
        }
      ]
    }
  ]);

  const handleClick = async () => {
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: (teamList) => {

        const addTeamButton = document.querySelector(
          "#root > div > div > main > div > div:nth-child(2) > div > div > div:nth-child(1) > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-2 > span > button") as HTMLButtonElement;
        
        for (const team of teamList) {
          const nameInputs = document.querySelectorAll("#margin-none");
          const nameInput = nameInputs[nameInputs.length - 1] as HTMLInputElement;
          nameInput.value = team.teamName;
          addTeamButton.click();
        }
        
      },
      args: [teamList]
    })
  }

  return (
    <>
      <h1>Auto Coach</h1>
      <div className="card">
        <button onClick={handleClick}>
          Submit Teams
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
