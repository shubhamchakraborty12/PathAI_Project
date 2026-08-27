export const DAILY_DSA_QUESTIONS = [
  {
    id: "dsa-1",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    companies: ["Google", "Amazon", "Microsoft", "TCS", "Infosys"],
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    hint: "Use a Hash Map to store values and their indices for O(N) time complexity."
  },
  {
    id: "dsa-2",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Sliding Window / Arrays",
    companies: ["Amazon", "Meta", "Accenture", "Wipro"],
    leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    description: "Maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    hint: "Track the minimum price seen so far and calculate max profit at each step."
  },
  {
    id: "dsa-3",
    title: "LRU Cache Architecture",
    difficulty: "Hard",
    category: "Linked List / Hash Map",
    companies: ["Google", "Amazon", "Microsoft", "Uber"],
    leetcodeUrl: "https://leetcode.com/problems/lru-cache/",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    hint: "Combine a Doubly Linked List with a Hash Map for O(1) get and put operations."
  },
  {
    id: "dsa-4",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    category: "Trees / BFS",
    companies: ["Meta", "Amazon", "Cognizant", "TCS Digital"],
    leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
    hint: "Use a Queue (BFS) to process nodes level by level."
  },
  {
    id: "dsa-5",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Sliding Window",
    companies: ["Google", "Amazon", "Microsoft", "Capgemini"],
    leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    description: "Find the length of the longest substring without repeating characters.",
    hint: "Use a sliding window with two pointers and a character set."
  }
];

export function getTodayDSAQuestion() {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  return DAILY_DSA_QUESTIONS[dayOfYear % DAILY_DSA_QUESTIONS.length];
}
