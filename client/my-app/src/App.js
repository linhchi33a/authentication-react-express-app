import './App.css';
import React from 'react';

function App() {
  const [phone, setPhone] = React.useState('');
  const [code, setCode] = React.useState('');
  const [verification, setVerification] = React.useState('');
  const host = 'http://localhost:3001';
  var [displayValidationStatus,setDisplay] = React.useState(''); 

  //Submit phone number
  const handleSubmitPhoneNumber = event => {
    event.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: phone }),
    };
    fetch(`${host}/accessCode`, requestOptions).then(response =>
      response.json()
    );
  };

  //SUBMIT ACCESSCODE
  const handleSubmitAccessCode = event => {
    setDisplay(true); 
    event.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: phone, accessCode: code }),
    };
    fetch(`${host}/accessCodeValidation`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log(`Validation Succeeded`);
        } else {
          console.log(`Validation Failed`);
        }
        setVerification(data.success);
      });
  };

  //console.log(`This is the AccessCode: ${data}
  return (
    <div className="App">
      <form onSubmit={handleSubmitPhoneNumber}>
        <label>
          Phone Number:
          <input
            name="phone"
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
        </label>
        <button>Submit PhoneNumber</button>
      </form>

      <form onSubmit={handleSubmitAccessCode}>
        <label>
          Access Code:
          <input
            name="code"
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
          />
        </label>
        <button>Submit AccessCode</button> 
      </form>
      {displayValidationStatus && <div className="VerificationStatus">
          Validation status:
          {verification
            ? ' Successfully verify your number'
            : ' Failed to verify your number'}
        </div>
      }
    </div>
  );
}
export default App;
