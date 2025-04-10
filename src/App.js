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
      console.log("⚙️ Setting up PubSub subscription...");
      try {
        const user = await getCurrentUser();
        console.log("👤 Current user:", user);
  
        const session = await fetchAuthSession();
        console.log("✅ Authenticated Cognito ID:", session.identityId);
  
        console.log("📡 Subscribing to topic: growTent/MKR1010_TempSensor_Alex/sensorData");
  
        const subscription = pubsub.subscribe({ topics: 'growTent/MKR1010_TempSensor_Alex/sensorData'}).subscribe({
          next: (data) => {
            console.log('Message recieved', data);
            try {
              const raw = data?.value;
              const message = typeof raw === "string" ? JSON.parse(raw) : raw;
              console.log("🌡️ Parsed message:", message);
              setMessages(prev => [...prev, message]);
            } catch (err) {
              console.error("❌ Error parsing message:", err);
            }
          },
          error: (error) => console.error("❌ PubSub error:", error),
          complete: () => console.log("✅ PubSub subscription completed")
        });
  
        return () => {
          console.log("🛑 Unsubscribing from PubSub");
          subscription.unsubscribe();
        };
  
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
