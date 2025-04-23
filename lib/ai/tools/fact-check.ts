import { tool } from 'ai';
import { z } from 'zod';

export interface ClaimBusterSentence {
  index: number;
  sentence: string;
  claim_score: number;
  label: 'CHECKWORTHY' | 'NOT CHECKWORTHY';
}

export const checkClaimsFromSentences = tool({
  description:
    'Analyze text to fact check the claims in the text, takes string text as argument and returns a score of how likely the claim has to be verified externally(Is it Check worthy or not).',
  parameters: z.object({
    text: z.string(),
  }),
  execute: async ({ text }) => {
    const response = await fetch(
      'https://idir.uta.edu/claimbuster/api/v2/score/text/sentences/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLAIMBUSTER_API_KEY || '',
        },
        body: JSON.stringify({ input_text: text }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ClaimBuster API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    return data.results.map(
      (item: any, index: number): ClaimBusterSentence => ({
        index,
        sentence: item.sentence,
        claim_score: item.claim_score,
        label: item.label,
      }),
    );
  },
});
