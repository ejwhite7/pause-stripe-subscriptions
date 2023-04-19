// Import the Stripe npm package
const Stripe = require('stripe');

// Replace with your Stripe secret key
const stripe = new Stripe('sk_test_XXXXXXXXXXXXXXXXXXXXXXXX');

// Define the number of subscriptions to pause
const limit = 180;

// Specify the product ID for which you want to pause subscriptions
const productId = 'prod_XXXXXXXXXXXXXX';

// Function to pause subscriptions
async function pauseSubscriptions() {
  // Retrieve a list of active subscriptions (up to the specified limit)
  const subscriptions = await stripe.subscriptions.list({ limit, status: 'active' });

  // Iterate through the list and pause subscriptions with the specified product ID
  for (const subscription of subscriptions.data) {
    // Find the subscription item with the specified product ID
    const subscriptionItem = subscription.items.data.find(item => item.product === productId);

    // If the subscription item is found, pause the subscription
    if (subscriptionItem) {
      try {
        console.log(`Pausing subscription: ${subscription.id}`);
        const pausedSubscription = await stripe.subscriptions.update(subscription.id, {
          pause_collection: { behavior: 'mark_uncollectible' },
        });
        console.log(`Paused subscription: ${pausedSubscription.id}`);
      } catch (e) {
        console.error(`Error pausing subscription: ${subscription.id}. Error: ${e.message}`);
      }
    }
  }
}

// Call the pauseSubscriptions function
pauseSubscriptions();
