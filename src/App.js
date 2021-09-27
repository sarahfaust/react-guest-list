import './App.css';
import { useEffect, useState } from 'react';
import { FilterButton } from './FilterButton';
import { Guest } from './Guest';

const FILTERS = {
  All: () => true,
  Coming: (guest) => guest.attending,
  'Not Coming': (guest) => !guest.attending,
};

const FILTER_NAMES = Object.keys(FILTERS);

function App() {
  const baseUrl = 'http://localhost:5000';
  const [isLoading, setIsLoading] = useState(false);
  const [guestList, setGuestList] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [filter, setFilter] = useState('All');

  // get all guests
  async function getAllGuests() {
    setIsLoading(true);
    const response = await fetch(`${baseUrl}/`);
    const allGuestsResponse = await response.json();

    setTimeout(() => {
      setGuestList(allGuestsResponse);
      setIsLoading(false);
    }, 500);
  }

  useEffect(() => {
    getAllGuests();
  }, []);

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

    logBefore(updatedList, updatedGuest);
    setGuestList(updatedList);
    logAfter();
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

    logBefore(updatedList, updatedGuest);
    setGuestList(updatedList);
    logAfter();
  }

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

  async function deleteGuest(id) {
    const response = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    const deletedGuest = await response.json();
    const remainingGuests = guestList.filter((guest) => guest.id !== id);
    logBefore(remainingGuests, deletedGuest);
    setGuestList(remainingGuests);
    logAfter();
  }

  async function deleteAllAttending() {
    for (let i = 0; i < guestList.lengh; i++) {
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

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
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
          type="submit"
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
        <div>Loading...</div>
      ) : (
        <ul>
          {guestList.filter(FILTERS[filter]).map((guest) => (
            <Guest
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
    </div>
  );
}

export default App;
