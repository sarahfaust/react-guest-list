import { useEffect, useState } from 'react';

export function Guest({ guest, updateAttending, deleteGuest, updateGuest }) {
  const [isInEdit, setIsInEdit] = useState(false);
  const [firstName, setFirstName] = useState(guest.firstName);
  const [lastName, setLastName] = useState(guest.lastName);
  const [updatedGuest, setUpdatedGuest] = useState(guest);

  useEffect(() => {
    setUpdatedGuest({ ...guest, firstName: firstName, lastName: lastName });
  }, [guest, firstName, lastName]);

  return (
    <div>
      {isInEdit ? (
        <li>
          <div>
            <input
              id="firstName"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.currentTarget.value);
              }}
            />
            <input
              id="lastName"
              value={lastName}
              onChange={(e) => {
                setLastName(e.currentTarget.value);
              }}
            />
          </div>
          <button
            onClick={() => {
              updateGuest(updatedGuest);
              setIsInEdit(false);
            }}
            style={{ backgroundColor: 'lightgreen' }}
          >
            Save
          </button>
        </li>
      ) : (
        <li key={guest.id}>
          <div className="bold">
            {guest.firstName} {guest.lastName}
          </div>
          <div>
            <label>
              Attending
              <input
                type="checkbox"
                checked={guest.attending}
                onChange={() => updateAttending(guest)}
              />
            </label>
          </div>
          <div>
            <button
              type="button"
              onClick={() => deleteGuest(guest.id)}
              style={{ backgroundColor: 'lightcoral' }}
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => {
                setIsInEdit(true);
              }}
              style={{ backgroundColor: 'lightblue' }}
            >
              Edit
            </button>
          </div>
        </li>
      )}
    </div>
  );
}
