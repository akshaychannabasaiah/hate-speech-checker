'use client';

import { useEffect, useState } from 'react';
import {
  checkClaimsFromSentences,
  ClaimBusterSentence,
} from '@/lib/ai/tools/fact-check';

export function Fact({ text }: { text: string }) {
  const [claims, setClaims] = useState<ClaimBusterSentence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!text) return;

    const fetchClaims = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await checkClaimsFromSentences(text);
        setClaims(results);
      } catch (err) {
        setError('Failed to fetch claim scores.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [text]);

  if (loading) {
    return <div className="text-gray-500">Analyzing claims...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!claims.length) {
    return <div className="text-gray-500">No claims detected.</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-2xl shadow-md max-w-3xl">
      <h2 className="text-xl font-semibold">Claim Analysis</h2>
      {claims.map((claim) => (
        <div
          key={claim.index}
          className="p-4 rounded-xl border border-gray-200 bg-gray-50"
        >
          <p className="text-gray-800">{claim.sentence}</p>
          <div className="flex justify-between items-center mt-2">
            <span
              className={`text-sm font-medium px-2 py-1 rounded-full ${
                claim.label === 'CHECKWORTHY'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {claim.label}
            </span>
            <span className="text-sm text-gray-500">
              Score: {claim.claim_score.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
