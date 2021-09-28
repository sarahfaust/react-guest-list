import './App.css';
import { useEffect, useState } from 'react';
import { FilterButton } from './FilterButton';
import { Guest } from './Guest';
import { initDataList } from './InitData';

const filterMap = {
  all: () => true,
  coming: (guest) => guest.attending,
  notComing: (guest) => !guest.attending,
};

const filterNames = Object.keys(filterMap);

function App() {
  const baseUrl = 'https://express-guest-list-backend.herokuapp.com';
  const [isLoading, setIsLoading] = useState(false);
  const [guestList, setGuestList] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [filterShow, setFilterShow] = useState('all');

  async function setDataInit() {
    for (let i = 0; i < initDataList.length; i++) {
      await fetch(`${baseUrl}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: initDataList[i].firstName,
          lastName: initDataList[i].lastName,
          attending: false,
        }),
      });
    }

    const initResponse = await fetch(`${baseUrl}/`);
    const initAllGuestsResponse = await initResponse.json();
    setGuestList(initAllGuestsResponse);
  }

  // get all guests
  async function getAllGuests() {
    setIsLoading(true);
    const response = await fetch(`${baseUrl}/`);
    const allGuestsResponse = await response.json();

    if (allGuestsResponse.length === 0) {
      setIsLoading(false);
    } else {
      setTimeout(() => {
        setGuestList(allGuestsResponse);
        console.log(allGuestsResponse);
        setIsLoading(false);
      }, 500);
    }
  }

  useEffect(() => {
    getAllGuests();
  }, []);

  // this confirms that state is not set synchronously ;)
  function logBefore(listBefore, item) {
    console.log('list before');
    console.log(listBefore);
    console.log('item');
    console.log(item);
  }

  function logAfter() {
    console.log('list after');
    console.log(guestList);
  }

  // save new guest to backend
  async function createGuest() {
    const response = await fetch(`${baseUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        attending: false,
      }),
    });

    const createdGuest = await response.json();
    const updatedList = [...guestList, createdGuest];

    logBefore(updatedList, createdGuest);
    setGuestList(updatedList);
    logAfter();

    setFirstName('');
    setLastName('');
  }

  // handle change in attending status
  async function updateAttending(guest) {
    const response = await fetch(`${baseUrl}/${guest.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !guest.attending }),
    });

    const updatedGuest = await response.json();
    console.log(updatedGuest);

    const updatedList = guestList.map((guestOnList) => {
      if (guestOnList.id === guest.id) {
        const guestInUpdate = {
          ...guestOnList,
          attending: !guest.attending,
        };
        return guestInUpdate;
      }
      return guestOnList;
    });

    setGuestList(updatedList);
  }

  // update guest
  async function updateGuest(guest) {
    console.log('update function guest');
    console.log(guest);
    const response = await fetch(`${baseUrl}/${guest.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: guest.firstName,
        lastName: guest.lastName,
      }),
    });

    const updatedGuest = await response.json();
    console.log(updatedGuest);

    const updatedList = guestList.map((guestOnList) => {
      if (guestOnList.id === guest.id) {
        const guestInUpdate = {
          ...guestOnList,
          firstName: guest.firstName,
          lastName: guest.lastName,
        };
        return guestInUpdate;
      }
      return guestOnList;
    });

    setGuestList(updatedList);
  }

  async function deleteGuest(id) {
    const response = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    const deletedGuest = await response.json();
    console.log(deletedGuest);
    const remainingGuests = guestList.filter((guest) => guest.id !== id);
    setGuestList(remainingGuests);
  }

  async function deleteAllAttending() {
    for (let i = 0; i < guestList.length; i++) {
      if (guestList[i].attending) {
        const response = await fetch(`${baseUrl}/${guestList[i].id}`, {
          method: 'DELETE',
        });

        const deletedGuest = await response.json();
        console.log(deletedGuest);
      }
    }
    const remainingGuests = guestList.filter((guest) => !guest.attending);
    setGuestList(remainingGuests);
  }

  const filterList = filterNames.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filterShow}
      setFilterShow={setFilterShow}
    />
  ));

  return (
    <div className="App">
      <h1>Guest List</h1>
      <h2>Add guest</h2>
      <form>
        <label htmlFor="firstName">First name: </label>
        <input
          id="firstName"
          value={firstName}
          onChange={(event) => setFirstName(event.currentTarget.value)}
          disabled={isLoading}
        />
        <label htmlFor="lastName">Last name: </label>
        <input
          id="lastName"
          value={lastName}
          onChange={(event) => setLastName(event.currentTarget.value)}
          disabled={isLoading}
        />
        <button
          onClick={(event) => {
            event.preventDefault();
            createGuest();
          }}
          disabled={isLoading}
        >
          Add guest
        </button>
      </form>
      <h2>Guests</h2>
      <button onClick={deleteAllAttending}>Delete attending</button>
      {filterList}
      {isLoading ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : (
        <ul>
          {guestList.filter(filterMap[filterShow]).map((guest) => (
            <Guest
              key={guest.id}
              guest={guest}
              updateAttending={updateAttending}
              updateGuest={updateGuest}
              deleteGuest={deleteGuest}
              setFirstName={setFirstName}
              setLastName={setLastName}
            />
          ))}
        </ul>
      )}
      <button onClick={() => setDataInit()}>Initialize Data</button>
    </div>
  );
}

export default App;
