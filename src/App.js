import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { PubSub } from '@aws-amplify/pubsub';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { Authenticator } from '@aws-amplify/ui-react';
import awsExports from './aws-exports';
import '@aws-amplify/ui-react/styles.css';

// Configure Amplify
Amplify.configure(awsExports);

// PubSub configuration
const pubsub = new PubSub({
  region: awsExports.aws_project_region,
  endpoint: `wss://${awsExports.aws_iot_endpoint}/mqtt`,
});

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function setupSubscription() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error("User not logged in");
  
        const session = await fetchAuthSession();
        console.log("✅ Authenticated Cognito ID:", session.identityId);
  
        const subscription = pubsub.subscribe('growTent/MKR1010_TempSensor_Alex/sensorData').subscribe({
          next: (data) => {
            console.log("📥 Incoming message:", data);
            // handle message...
          },
          error: (err) => console.error("❌ PubSub error:", err),
          complete: () => console.log("✅ PubSub subscription completed")
        });
  
        return () => subscription.unsubscribe();
  
      } catch (err) {
        console.error("❌ User not authenticated or error during PubSub setup:", err);
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
          {messages.length === 0 && <li>❌ No messages received</li>}
          {messages.map((msg, index) => (
            <li key={index}>
              🌡️ Temp C: {msg.temperature_C}, Temp F: {msg.temperature_F}
            </li>
          ))}
        </ul>
        
      </header>
    </div>
  )}
</Authenticator>

  );
}

export default App;
