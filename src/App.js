useEffect(() => {
  async function setupSubscription() {
    console.log("🚩 Setting up PubSub subscription...");

    try {
      const user = await getCurrentUser();
      console.log("👤 Current user:", user);

      if (user) {
        const session = await fetchAuthSession();
        console.log("✅ Authenticated Cognito ID:", session.identityId);

        console.log("📡 Subscribing to topic: growTent/MKR1010_TempSensor_Alex/sensorData");

        const subscription = pubsub.subscribe('growTent/MKR1010_TempSensor_Alex/sensorData').subscribe({
          next: (data) => {
            console.log('📥 Incoming message:', data);
            setMessages(prev => [...prev, data.value]);
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
