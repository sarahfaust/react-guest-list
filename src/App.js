import './App.css';
import { useState } from 'react';

function App() {
  const guestInit = [
    { id: 1, firstName: 'sarah', lastName: 'faustmann', isAttending: false },
    { id: 2, firstName: 'jimmy', lastName: 'hodza', isAttending: false },
    { id: 3, firstName: 'thomas', lastName: 'teufel', isAttending: false },
    { id: 4, firstName: 'iris', lastName: 'eibensteiner', isAttending: false },
  ];

  const [id, setId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isAttending, setIsAttending] = useState(false);
  const [guestList, setGuestList] = useState(guestInit);

  function handleClick(event) {
    const newList = [
      ...guestList,
      {
        id: id,
        firstName: firstName,
        lastName: lastName,
        isAttending: isAttending,
      },
    ];

    event.preventDefault();
    setGuestList(newList);
    setId('');
    setFirstName('');
    setLastName('');
  }

  function handleCheck(id) {
    const newList = guestList.map((guest) => {
      if (guest.id === id) {
        const updatedGuest = {
          ...guest,
          isAttending: !guest.isAttending,
        };
        return updatedGuest;
      }
      return guest;
    });
    setGuestList(newList);
  }

  function handleDelete(id) {
    const newList = guestList.filter((guest) => guest.id !== id);
    setGuestList(newList);
  }

  function deleteAllAttending() {
    const newList = guestList.filter((guest) => !guest.isAttending);
    setGuestList(newList);
  }

  function showAttending() {
    const newList = guestList.filter((guest) => guest.isAttending);
    setGuestList(newList);
  }
  function showNotAttending() {}

  return (
    <div className="App">
      <h1>Guest List</h1>
      <h2>Add guest</h2>
      <form>
        <label htmlFor="id">ID:</label>
        <input
          id="id"
          value={id}
          onChange={(event) => setId(event.currentTarget.value)}
        />
        <label htmlFor="firstName">First name:</label>
        <input
          id="firstName"
          value={firstName}
          onChange={(event) => setFirstName(event.currentTarget.value)}
        />
        <label htmlFor="lastName">Last name:</label>
        <input
          id="lastName"
          value={lastName}
          onChange={(event) => setLastName(event.currentTarget.value)}
        />
        <button type="submit" onClick={(event) => handleClick(event)}>
          Add guest
        </button>
      </form>
      <h2>Guests</h2>
      <button onClick={() => deleteAllAttending()}>Delete attending</button>
      <button onClick={() => showAttending()}>Who's coming</button>
      <button onClick={() => showNotAttending()}>Who's not</button>
      <ul>
        {guestList.map((guest) => (
          <>
            <li key={guest.id}>
              {guest.id} {guest.firstName} {guest.lastName}
            </li>
            <label htmlFor="attending">Attending</label>
            <input
              id="attending"
              type="checkbox"
              checked={guest.isAttending}
              onChange={() => handleCheck(guest.id)}
            />
            <button type="button" onClick={() => handleDelete(guest.id)}>
              Delete guest
            </button>
          </>
        ))}
      </ul>
    </div>
  );
}

export default App;
