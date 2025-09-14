export interface PashuSahayakResponse {
  advanced_breed_detector: {
    primary_breed: string;
    confidence_score: number;
    breed_origin: string;
    breed_formation: string;
    key_identifiers: string[];
    secondary_breeds: {
      breed: string;
      confidence_score: number;
    }[];
  };
  ai_veterinary_assistant: {
    overall_health_status: 'Good' | 'Fair' | 'Needs Attention';
    detailed_observations: {
      area: string;
      observation: string;
      status: 'Positive' | 'Neutral' | 'Concern';
    }[];
    veterinary_recommendation: string;
  };
  hyper_local_advisor: {
    language: string;
    feeding_tip: string;
    housing_tip: string;
    seasonal_tip: string;
  };
}

export interface ValuationResponse {
  estimated_market_value_inr: string;
  valuation_factors: string[];
}

export interface TraitScore {
    trait: string;
    score: number;
    maxScore: number;
    description: string;
}
