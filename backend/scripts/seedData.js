import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from '../models/Post.js';

dotenv.config();

const samplePosts = [
  {
    title: "The Art of Minimalism",
    slug: "art-of-minimalism",
    excerpt: "Exploring how less can truly be more in design and life.",
    content: `Minimalism is more than just a design aesthetic—it's a philosophy that embraces the power of less. In our increasingly complex world, the principles of minimalism offer a path to clarity and focus.

## What is Minimalism?

At its core, minimalism is about intentionality. It's the conscious decision to focus on what truly matters while eliminating the unnecessary. This doesn't mean living with nothing; it means living with purpose.

## The Benefits

When we remove the excess, we create space for what's important:

- **Clarity of thought** - Less visual noise leads to clearer thinking
- **Reduced stress** - Fewer possessions mean fewer things to maintain
- **Enhanced focus** - With fewer distractions, we can concentrate on our priorities
- **Greater appreciation** - We value what we have more when we have less

## Applying Minimalism

Minimalism can be applied to every aspect of life:

In **design**, it means clean lines, ample whitespace, and purposeful elements. In **living spaces**, it's about keeping only what serves a function or brings joy. In **digital life**, it's about curating our apps, notifications, and online presence.

The goal isn't to live with as little as possible, but to live with intention. Every item, every commitment, every design element should have a purpose.

## Conclusion

Minimalism teaches us that by choosing less, we often gain more—more time, more peace, more focus on what truly matters. It's not about deprivation; it's about liberation from the unnecessary.`,
    author: "Test Author",
    tags: ["minimalism", "design", "lifestyle"],
    published: true,
    publishedAt: new Date("2024-01-15")
  },
  {
    title: "Digital Detox",
    slug: "digital-detox",
    excerpt: "Why taking breaks from technology is essential for mental clarity.",
    content: `In our hyperconnected world, taking intentional breaks from technology has become essential for maintaining mental clarity and well-being.

## The Need for Digital Detox

Our devices demand constant attention. Notifications ping throughout the day, social media feeds scroll endlessly, and the pressure to stay connected never ceases. This constant stimulation can lead to:

- Mental fatigue
- Decreased attention span
- Increased anxiety
- Sleep disruption
- Reduced face-to-face social skills

## Benefits of Unplugging

Regular digital detoxes offer numerous benefits:

**Mental Clarity**: Without constant digital input, our minds can process information more effectively and think more creatively.

**Better Sleep**: Reducing screen time, especially before bed, improves sleep quality and duration.

**Improved Relationships**: Face-to-face interactions become more meaningful when we're not distracted by devices.

**Increased Productivity**: Paradoxically, spending less time with technology often leads to getting more done.

## Practical Steps

Start small with these approaches:

1. **Phone-free meals** - Keep devices away during eating
2. **Digital sunset** - No screens 1 hour before bed
3. **Weekend mornings** - Delay checking devices until after breakfast
4. **Notification audit** - Turn off non-essential notifications
5. **Tech-free zones** - Designate certain areas as device-free

## Finding Balance

The goal isn't to eliminate technology entirely, but to use it intentionally. Technology should serve us, not the other way around.

Regular digital detoxes help us reset our relationship with technology and remember what it feels like to be fully present in the moment.`,
    author: "John Smith",
    tags: ["technology", "wellness", "productivity"],
    published: true,
    publishedAt: new Date("2024-01-10")
  },
  {
    title: "Simple Living",
    slug: "simple-living",
    excerpt: "Finding joy in the everyday moments through intentional choices.",
    content: `Simple living is about finding contentment in life's basic pleasures and making intentional choices that align with our values.

## The Philosophy of Simple Living

Simple living isn't about poverty or deprivation—it's about abundance in the things that truly matter. It's recognizing that happiness doesn't come from accumulating more, but from appreciating what we already have.

## Core Principles

**Intentionality**: Every choice is made with purpose, from the items we buy to the commitments we make.

**Gratitude**: Regular appreciation for what we have, rather than focusing on what we lack.

**Mindfulness**: Being present in each moment rather than constantly planning for the future or dwelling on the past.

**Connection**: Prioritizing relationships and community over material possessions.

## Practical Applications

Simple living can be practiced in many ways:

### In Our Homes
- Keep only items that are useful or beautiful
- Create spaces that promote calm and reflection
- Choose quality over quantity

### In Our Schedules
- Say no to commitments that don't align with our values
- Build in time for rest and reflection
- Focus on depth rather than breadth in activities

### In Our Consumption
- Buy less, but buy better
- Repair instead of replace when possible
- Consider the true cost of purchases

## The Rewards

Those who embrace simple living often find:

- **More time** for what matters most
- **Less stress** from managing fewer possessions and commitments
- **Greater satisfaction** from experiences rather than things
- **Stronger relationships** built on shared values rather than shared purchases
- **Environmental benefits** from reduced consumption

## Getting Started

Begin with small changes:

1. Declutter one area of your home
2. Practice saying no to one unnecessary commitment
3. Spend time in nature without devices
4. Cook a simple meal from scratch
5. Have a conversation without distractions

Simple living is a journey, not a destination. It's about continuously choosing what matters most and letting go of the rest.`,
    author: "Sarah Johnson",
    tags: ["lifestyle", "minimalism", "mindfulness"],
    published: true,
    publishedAt: new Date("2024-01-05")
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/minimalist-blog');
    console.log('Connected to MongoDB');

    // Clear existing posts
    await Post.deleteMany({});
    console.log('Cleared existing posts');

    // Insert sample posts
    const createdPosts = await Post.insertMany(samplePosts);
    console.log(`Created ${createdPosts.length} sample posts`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();