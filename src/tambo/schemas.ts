import { z } from "zod";

// Define schemas for our generative components

export const StartAssessmentSchema = z.object({
    topic: z.string().optional().describe("The topic or subject matter for the assessment"),
});

export const MultipleChoiceSchema = z.object({
    question: z.string().optional().describe("The question text"),
    options: z.array(z.string()).optional().describe("List of options for the user to choose from"),
    correctAnswer: z.string().optional().describe("The correct answer from the options"),
    explanation: z.string().optional().describe("Explanation for why the answer is correct"),
});

export const FillBlanksSchema = z.object({
    sentence: z.string().optional().describe("The sentence with blanks represented by underscores"),
    blanks: z.array(z.string()).optional().describe("The correct words filling the blanks in order"),
});

export const MatchFollowingSchema = z.object({
    pairs: z.array(z.object({
        left: z.string().optional().describe("Item on the left side to be matched"),
        right: z.string().optional().describe("Corresponding item on the right side")
    })).optional().describe("Array of 3-6 pairs to match. Example: [{left: 'India', right: 'New Delhi'}, {left: 'France', right: 'Paris'}]"),
});

export const AssessmentResultSchema = z.object({
    score: z.number().optional().describe("The final score of the user"),
    total: z.number().optional().describe("Total number of questions"),
    summary: z.string().optional().describe("A summary of the user's performance and areas for improvement"),
});

