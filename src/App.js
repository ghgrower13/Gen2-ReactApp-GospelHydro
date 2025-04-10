import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { PubSub } from '@aws-amplify/pubsub'; // ✅ correct import for v6+
import { Authenticator } from '@aws-amplify/ui-react';
import awsExports from './aws-exports';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsExports);


function App() {
  const [isReady, setIsReady] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Delay for smoother UI loading
    const timer = setTimeout(() => setIsReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const subscription = PubSub.subscribe('growTent/MKR1010_TempSensor_Alex/sensorData').subscribe({
      next: (data) => {
        console.log('📥 Incoming message:', data);
        setMessages(prev => [...prev, data.value]);
      },
      error: (error) => console.error('❌ PubSub error:', error),
      complete: () => console.log('✅ Subscription complete')
    });
  
    return () => subscription.unsubscribe();
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
              <h3>📡 IoT Messages from <code>growTent/sensorData</code>:</h3>
              <ul>
                {messages.map((msg, index) => (
                  <li key={index}>{JSON.stringify(msg)}</li>
                ))}
              </ul>
            </header>
          </div>
        )}
      </Authenticator>
    </Authenticator.Provider>
  );
}

export default App;
