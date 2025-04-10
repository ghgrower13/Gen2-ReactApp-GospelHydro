import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import awsExports from './aws-exports';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsExports);

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to prevent UI flickering
    const timer = setTimeout(() => setIsReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) return <div>Loading...</div>;

  return (
    <Authenticator.Provider>
      <Authenticator>
        {({ signOut, user }) => (
          <div className="App">
            <header className="App-header">
              <h2>Welcome, {user?.username}</h2>
              <button onClick={signOut}>Sign Out</button>
            </header>
          </div>
        )}
      </Authenticator>
    </Authenticator.Provider>
  );
}

export default App;
