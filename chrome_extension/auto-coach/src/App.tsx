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
          sex: "Male",
          email: "jimmysemail2222@gmail.com",
        },
        {
          preferredName: "eeeefasf",
          title: "Mr.",
          name: "bonkski ronkski",
          sex: "Male",
          email: "bonkskif2222@gmail.com",
        }
      ]
    },
    {
      teamName: "Watermelon",
      members: [
        {
          preferredName: "bing",
          title: "Mr.",
          name: "bing",
          sex: "Male",
          email: "bingbing@gmail.com",
        },
        {
          preferredName: "edge",
          title: "Mr.",
          name: "edge zing",
          sex: "Female",
          email: "edgeedge@gmail.com",
        }
      ]
    },
    {
      teamName: "Munchlax",
      members: [
        {
          preferredName: "Lizardon",
          title: "Mr.",
          name: "Lizardon Charizardion",
          sex: "Male",
          email: "lizerdrizzerd@gmail.com",
        },
        {
          preferredName: "Reprentles",
          title: "Mr.",
          name: "freprentles cremples",
          sex: "Male",
          email: "brentlesremples@gmail.com",
        }
      ]
    }
  ]);

  const handleClick = async () => {
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: async (teamList) => {

        const addTeamButton = document.querySelector(
          "#root > div > div > main > div > div:nth-child(2) > div > div > div:nth-child(1) > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-2 > span > button"
        ) as HTMLButtonElement;

        for (const team of teamList) {
          const nameInputs = document.querySelectorAll("#margin-none");
          const nameInput = nameInputs[nameInputs.length - 1] as HTMLInputElement;
          nameInput.value = team.teamName;
          nameInput.dispatchEvent(new Event('input', { bubbles: true }));
          const registerUserButtons = document.getElementsByClassName('MuiTypography-root MuiTypography-caption');

          for (const [index, member] of team.members.entries()) {

            const memberInputs = document.getElementsByClassName('MuiInputBase-input MuiInput-input');
            const memberInput = memberInputs[memberInputs.length - 1 - (2 - index)] as HTMLInputElement;

            memberInput.value = member.email;
            memberInput.dispatchEvent(new Event('input', { bubbles: true }));

            const currentRegisterUserButton = registerUserButtons[registerUserButtons.length - 1 - 5 - (2 - index)] as HTMLSpanElement;

            currentRegisterUserButton.addEventListener('click', async () => {

              const prevElementSize = document.getElementsByClassName('MuiInputBase-input MuiInput-input').length;
              const userRegInterval = setInterval(() => {

                const elements = document.getElementsByClassName('MuiInputBase-input MuiInput-input');
                if (elements.length !== prevElementSize + 5) {
                  return;
                }

                  const usernameInput = elements[elements.length - 5] as HTMLInputElement;
                  const firstNameInput = elements[elements.length - 3] as HTMLInputElement;
                  const lastNameInput = elements[elements.length - 2] as HTMLInputElement;
            
                  usernameInput.value = member.email;
                  usernameInput.dispatchEvent(new Event('input', { bubbles: true }));

                  const nameList = member.name.split(' ');
                  const firstName = nameList[0];
                  const lastName = nameList[nameList.length - 1];

                  firstNameInput.value = firstName;
                  firstNameInput.dispatchEvent(new Event('input', { bubbles: true }));

                  lastNameInput.value = lastName;
                  lastNameInput.dispatchEvent(new Event('input', { bubbles: true }));
              
                  clearInterval(userRegInterval);
              }, 100);

            })

          }
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
