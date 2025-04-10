import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { PubSub } from '@aws-amplify/pubsub';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { Authenticator } from '@aws-amplify/ui-react';
import awsExports from './aws-exports';
import '@aws-amplify/ui-react/styles.css';

// Configure Amplify
Amplify.configure(awsExports);

// PubSub configuration (authenticated users only)
const pubsub = new PubSub({
  region: awsExports.aws_project_region,
  endpoint: `wss://${awsExports.aws_iot_endpoint}/mqtt`,
});

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function setupSubscription() {
      try {
        const user = await getCurrentUser();
        if (user) {
          const session = await fetchAuthSession();
          console.log("✅ Authenticated Cognito ID:", session.identityId);

          const subscription = pubsub.subscribe('growTent/MKR1010_TempSensor_Alex/sensorData').subscribe({
            next: (data) => {
              console.log('📥 Message:', data);
              setMessages(prev => [...prev, data.value]);
            },
            error: (error) => console.error('❌ Error:', error),
            complete: () => console.log('✅ Subscription complete')
          });

          return () => subscription.unsubscribe();
        }
      } catch (error) {
        console.error("❌ User not authenticated yet:", error);
      }
    }

    setupSubscription();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="App">
          <header className="App-header">
            <h2>Welcome, {user?.username}</h2>
            <button onClick={signOut}>Sign Out</button>
            <h3>📡 IoT Messages:</h3>
            <ul>
              {messages.map((msg, index) => (
                <li key={index}>{JSON.stringify(msg)}</li>
              ))}
            </ul>
          </header>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
