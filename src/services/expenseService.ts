
export interface MarketExpenses {
  power: number;
  internet: number;
  license: number;
}

export const fetchMarketExpenses = async (
  address: string,
  openaiApiKey: string
): Promise<MarketExpenses> => {
  console.log(`🔍 Fetching market expenses for ${address}`);

  try {
    if (!openaiApiKey || openaiApiKey.trim() === '') {
      throw new Error('OpenAI API key is required');
    }

    // Extract city and state from address for more targeted search
    const cityState = extractCityState(address);
    
    const prompt = `Research current market rates and municipal information for ${cityState} to provide accurate monthly costs for a short-term rental property.

I need specific information for:

1. **Power/Electricity**: Average monthly electricity cost for a 2-bedroom apartment in ${cityState}
2. **Internet**: Average monthly high-speed internet cost (suitable for STR guests) in ${cityState}
3. **Short-Term Rental License**: Find the annual STR license fee and application costs for ${cityState}. Many cities publish this on their official websites under business licensing or short-term rental regulations.

For the license cost, divide the total annual cost (license fee + application fee) by 12 to get the monthly amount.

Return a JSON object with this exact structure:
{
  "power": 190,
  "internet": 70,
  "license": 29
}

Requirements:
- Use current 2024 rates
- Focus on ${cityState} specifically
- For license, check the city's official website for STR regulations
- Return only the JSON object, no other text`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a real estate market research analyst. Research current municipal costs and utility rates. Return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const parsedContent = JSON.parse(content);
      
      // Validate the response structure
      if (typeof parsedContent.power === 'number' && 
          typeof parsedContent.internet === 'number' && 
          typeof parsedContent.license === 'number') {
        
        console.log('✅ Got market expenses from OpenAI:', parsedContent);
        return {
          power: Math.round(parsedContent.power),
          internet: Math.round(parsedContent.internet),
          license: Math.round(parsedContent.license)
        };
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Failed to parse expense data');
    }

  } catch (error) {
    console.error('❌ Expense lookup error:', error);
    throw error;
  }
};

const extractCityState = (address: string): string => {
  // Try to extract city and state from address
  // This is a simple extraction - could be enhanced with geocoding
  const parts = address.split(',').map(part => part.trim());
  
  if (parts.length >= 2) {
    // Assume last part is state, second to last is city
    const state = parts[parts.length - 1];
    const city = parts[parts.length - 2];
    return `${city}, ${state}`;
  }
  
  return address; // Return full address if can't parse
};
