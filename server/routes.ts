import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertProfileSchema, insertSwipeSchema, insertMessageSchema } from "@shared/schema";

let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get user profile
      const profile = await storage.getProfile(userId);
      
      res.json({ ...user, profile });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.post('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertProfileSchema.parse({ ...req.body, userId });
      
      const profile = await storage.createProfile(profileData);
      res.json(profile);
    } catch (error: any) {
      console.error("Error creating profile:", error);
      res.status(400).json({ message: error.message || "Failed to create profile" });
    }
  });

  app.put('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updates = req.body;
      
      const profile = await storage.updateProfile(userId, updates);
      res.json(profile);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      res.status(400).json({ message: error.message || "Failed to update profile" });
    }
  });

  app.get('/api/discover', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Parse filters from query params
      const filters: any = {};
      if (req.query.location) filters.location = req.query.location;
      if (req.query.ageMin) filters.ageMin = parseInt(req.query.ageMin as string);
      if (req.query.ageMax) filters.ageMax = parseInt(req.query.ageMax as string);
      if (req.query.gender) filters.gender = req.query.gender;
      
      const profiles = await storage.getDiscoverableProfiles(userId, limit, Object.keys(filters).length > 0 ? filters : undefined);
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching discoverable profiles:", error);
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });

  // Swipe routes
  app.post('/api/swipe', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const swipeData = insertSwipeSchema.parse({ ...req.body, swiperId: userId });
      
      // Check if already swiped
      const existingSwipe = await storage.getSwipe(userId, swipeData.swipedId);
      if (existingSwipe) {
        return res.status(400).json({ message: "Already swiped on this user" });
      }
      
      const swipe = await storage.createSwipe(swipeData);
      
      // Check for match if it's a like
      let isMatch = false;
      if (swipeData.isLike) {
        const reverseSwipe = await storage.getSwipe(swipeData.swipedId, userId);
        if (reverseSwipe && reverseSwipe.isLike) {
          // Create match
          await storage.createMatch(userId, swipeData.swipedId);
          isMatch = true;
        }
      }
      
      res.json({ swipe, isMatch });
    } catch (error: any) {
      console.error("Error creating swipe:", error);
      res.status(400).json({ message: error.message || "Failed to create swipe" });
    }
  });

  // Match routes
  app.get('/api/matches', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const matches = await storage.getUserMatches(userId);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  // Message routes
  app.get('/api/matches/:matchId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const { matchId } = req.params;
      const userId = req.user.claims.sub;
      
      // Verify user is part of this match
      const match = await storage.getMatch(userId, ""); // This needs to be fixed
      
      const messages = await storage.getMatchMessages(matchId);
      
      // Mark messages as read
      await storage.markMessagesAsRead(matchId, userId);
      
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/matches/:matchId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const { matchId } = req.params;
      const userId = req.user.claims.sub;
      const messageData = insertMessageSchema.parse({ 
        ...req.body, 
        matchId, 
        senderId: userId 
      });
      
      const message = await storage.createMessage(messageData);
      
      // Broadcast message via WebSocket
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'new_message',
            matchId,
            message
          }));
        }
      });
      
      res.json(message);
    } catch (error: any) {
      console.error("Error creating message:", error);
      res.status(400).json({ message: error.message || "Failed to create message" });
    }
  });

  // Stripe subscription route
  app.post('/api/get-or-create-subscription', isAuthenticated, async (req: any, res) => {
    if (!stripe) {
      return res.status(200).json({ 
        message: "Demo mode - payment processing not configured",
        clientSecret: 'pi_demo_1234567890abcdef_secret_demo'
      });
    }
    
    try {
      const userId = req.user.claims.sub;
      let user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        res.send({
          subscriptionId: subscription.id,
          clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
        });
        return;
      }
      
      if (!user.email) {
        throw new Error('No user email on file');
      }

      let customerId = user.stripeCustomerId;
      
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        });
        
        customerId = customer.id;
        user = await storage.updateStripeCustomerId(userId, customerId);
      }

      // Create a default price for demo purposes (in production, get from env)
      const price = await stripe.prices.create({
        currency: 'usd',
        unit_amount: 1499, // $14.99
        recurring: { interval: 'month' },
        product_data: {
          name: 'LoveConnect Premium',
        },
      });

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: price.id,
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(userId, {
        customerId,
        subscriptionId: subscription.id
      });
  
      res.send({
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      console.error("Subscription error:", error);
      return res.status(400).send({ error: { message: error.message } });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data.toString());
          }
        });
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // M-Pesa payment route
  app.post('/api/mpesa/initiate', isAuthenticated, async (req: any, res) => {
    try {
      const { phoneNumber, amount } = req.body;
      
      // In production, integrate with Safaricom M-Pesa API
      // For demo, we'll simulate the process
      console.log(`M-Pesa payment initiated: ${phoneNumber} - KSH ${amount}`);
      
      // Simulate STK Push
      setTimeout(() => {
        console.log('M-Pesa payment confirmed');
      }, 3000);
      
      res.json({ 
        message: 'Payment initiated successfully',
        transactionId: `MPESA_${Date.now()}`,
        status: 'pending'
      });
    } catch (error) {
      console.error('M-Pesa payment error:', error);
      res.status(400).json({ message: 'Payment initiation failed' });
    }
  });

  return httpServer;
}
