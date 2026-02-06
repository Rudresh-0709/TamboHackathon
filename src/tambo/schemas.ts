import { z } from "zod";

// Define schemas for our generative components

export const StartAssessmentSchema = z.object({
    topic: z.string().describe("The topic or subject matter for the assessment"),
});

export const MultipleChoiceSchema = z.object({
    question: z.string().describe("The question text"),
    options: z.array(z.string()).describe("List of options for the user to choose from"),
    correctAnswer: z.string().describe("The correct answer from the options"),
    explanation: z.string().optional().describe("Explanation for why the answer is correct"),
});

export const FillBlanksSchema = z.object({
    sentence: z.string().describe("The sentence with blanks represented by underscores"),
    blanks: z.array(z.string()).describe("The correct words filling the blanks in order"),
});

export const MatchFollowingSchema = z.object({
    pairs: z.array(z.object({
        left: z.string(),
        right: z.string()
    })).describe("Pairs of items that match together"),
});

export const AssessmentResultSchema = z.object({
    score: z.number().describe("The final score of the user"),
    total: z.number().describe("Total number of questions"),
    summary: z.string().describe("A summary of the user's performance and areas for improvement"),
});

