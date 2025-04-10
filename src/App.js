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
    console.log("🚩 Setting up PubSub subscription...");

    async function setupSubscription() {
      try {
        const user = await getCurrentUser();
        console.log("👤 Current user:", user);

        if (user) {
          const session = await fetchAuthSession();
          console.log("✅ Authenticated Cognito ID:", session.identityId);
        
          console.log("📡 Subscribing to topic: growTent/MKR1010_TempSensor_Alex/sensorData");
        
          const subscription = pubsub.subscribe('growTent/MKR1010_TempSensor_Alex/sensorData').subscribe({
            next: (data) => {
              console.log("📥 Full message object:", data);
            
              try {
                const raw = data?.value;
                console.log("📦 Raw data.value:", raw);
            
                const message = typeof raw === "string" ? JSON.parse(raw) : raw;
                console.log("🌡️ Parsed temperature:", message);
                setMessages(prev => [...prev, message]);
              } catch (err) {
                console.error("❌ Error parsing message:", err);
              }
            },
            
            error: (error) => console.error('❌ PubSub error:', error),
            complete: () => console.log('✅ PubSub subscription completed'),
          });
        
          return () => {
            console.log("🛑 Unsubscribing from PubSub");
            subscription.unsubscribe();
          };
        }
        
      } catch (error) {
        console.error("❌ User not authenticated or error during PubSub setup:", error);
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
