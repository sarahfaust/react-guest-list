import { useEffect, useState } from 'react/cjs/react.development';

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
          <button
            onClick={() => {
              updateGuest(updatedGuest);
              setIsInEdit(false);
            }}
          >
            Save
          </button>
        </div>
      ) : (
        <div>
          <li key={guest.id}>
            {guest.firstName} {guest.lastName}
          </li>
          <label htmlFor="attending">Attending</label>
          <input
            id="attending"
            type="checkbox"
            checked={guest.attending}
            onChange={() => updateAttending(guest)}
          />
          <button type="button" onClick={() => deleteGuest(guest.id)}>
            Delete guest
          </button>
          <button
            type="button"
            onClick={() => {
              setIsInEdit(true);
            }}
          >
            Edit guest
          </button>
        </div>
      )}
    </div>
  );
}
