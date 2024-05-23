import { Accordion } from '@mantine/core';

const days = [
  {
    "emoji": "🍎",
    "value": "August 10th",
    "description":
      "Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads."
  },
  {
    "emoji": "🍌",
    "value": "August 11th",
    "description":
      "Naturally sweet and potassium-rich fruit. Bananas are a popular choice for their energy-boosting properties and can be enjoyed as a quick snack, added to smoothies, or used in baking."
  },
  {
    "emoji": "🥦",
    "value": "August 12th",
    "description":
      "Nutrient-packed green vegetable. Broccoli is packed with vitamins, minerals, and fiber. It has a distinct flavor and can be enjoyed steamed, roasted, or added to stir-fries."
  },
  {
    "emoji": "🍎",
    "value": "August 13th",
    "description":
      "Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads."
  },
  {
    "emoji": "🍌",
    "value": "August 14th",
    "description":
      "Naturally sweet and potassium-rich fruit. Bananas are a popular choice for their energy-boosting properties and can be enjoyed as a quick snack, added to smoothies, or used in baking."
  },
  {
    "emoji": "🥦",
    "value": "August 15th",
    "description":
      "Nutrient-packed green vegetable. Broccoli is packed with vitamins, minerals, and fiber. It has a distinct flavor and can be enjoyed steamed, roasted, or added to stir-fries."
  },
  {
    "emoji": "🍎",
    "value": "August 16th",
    "description":
      "Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads."
  },
  {
    "emoji": "🍌",
    "value": "August 17th",
    "description":
      "Naturally sweet and potassium-rich fruit. Bananas are a popular choice for their energy-boosting properties and can be enjoyed as a quick snack, added to smoothies, or used in baking."
  },
  {
    "emoji": "🥦",
    "value": "August 18th",
    "description":
      "Nutrient-packed green vegetable. Broccoli is packed with vitamins, minerals, and fiber. It has a distinct flavor and can be enjoyed steamed, roasted, or added to stir-fries."
  },
  {
    "emoji": "🍎",
    "value": "August 19th",
    "description":
      "Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads."
  },
  {
    "emoji": "🍌",
    "value": "August 20th",
    "description":
      "Naturally sweet and potassium-rich fruit. Bananas are a popular choice for their energy-boosting properties and can be enjoyed as a quick snack, added to smoothies, or used in baking."
  },
  {
    "emoji": "🥦",
    "value": "August 21st",
    "description":
      "Nutrient-packed green vegetable. Broccoli is packed with vitamins, minerals, and fiber. It has a distinct flavor and can be enjoyed steamed, roasted, or added to stir-fries."
  },
  {
    "emoji": "🍎",
    "value": "August 22th",
    "description":
      "Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads."
  },
  {
    "emoji": "🍌",
    "value": "August 23th",
    "description":
      "Naturally sweet and potassium-rich fruit. Bananas are a popular choice for their energy-boosting properties and can be enjoyed as a quick snack, added to smoothies, or used in baking."
  },
  {
    "emoji": "🥦",
    "value": "August 24th",
    "description":
      "Nutrient-packed green vegetable. Broccoli is packed with vitamins, minerals, and fiber. It has a distinct flavor and can be enjoyed steamed, roasted, or added to stir-fries."
  },
  {
    "emoji": "🍎",
    "value": "August 25th",
    "description":
      "Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads."
  },
  {
    "emoji": "🍌",
    "value": "August 26th",
    "description":
      "Naturally sweet and potassium-rich fruit. Bananas are a popular choice for their energy-boosting properties and can be enjoyed as a quick snack, added to smoothies, or used in baking."
  },
  {
    "emoji": "🥦",
    "value": "August 27th",
    "description":
      "Nutrient-packed green vegetable. Broccoli is packed with vitamins, minerals, and fiber. It has a distinct flavor and can be enjoyed steamed, roasted, or added to stir-fries."
  },
  {
    "emoji": "🍎",
    "value": "August 28th",
    "description":
      "Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads."
  },
  {
    "emoji": "🍌",
    "value": "August 29th",
    "description":
      "Naturally sweet and potassium-rich fruit. Bananas are a popular choice for their energy-boosting properties and can be enjoyed as a quick snack, added to smoothies, or used in baking."
  },
  {
    "emoji": "🥦",
    "value": "August 30th",
    "description":
      "Nutrient-packed green vegetable. Broccoli is packed with vitamins, minerals, and fiber. It has a distinct flavor and can be enjoyed steamed, roasted, or added to stir-fries."
  },
  {
    "emoji": "🍎",
    "value": "August 31st",
    "description":
      "Crisp and refreshing fruit. Apples are known for their versatility and nutritional benefits. They come in a variety of flavors and are great for snacking, baking, or adding to salads."
  },
  {
    "emoji": "🍌",
    "value": "September 1st",
    "description":
      "Naturally sweet and potassium-rich fruit. Bananas are a popular choice for their energy-boosting properties and can be enjoyed as a quick snack, added to smoothies, or used in baking."
  }
]


export default function AccordionReact() {
  // See groceries data above
  const items = days.map((item) => (
    <Accordion.Item key={item.value} value={item.value}>
      <Accordion.Control icon={item.emoji}>{item.value}</Accordion.Control>
      <Accordion.Panel>{item.description}</Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Accordion variant="separated">
      {items}
    </Accordion>
  );
}