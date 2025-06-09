ALTER TABLE "explanations" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "explanations" ALTER COLUMN "aiResponsesWithQuestions" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "explanations" DROP COLUMN "userPrompt";--> statement-breakpoint
ALTER TABLE "explanations" DROP COLUMN "mode";