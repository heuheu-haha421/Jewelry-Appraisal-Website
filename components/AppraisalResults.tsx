import React from 'react';
import { TrendingUp, TrendingDown, Info, Award, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';

interface AppraisalData {
  item: string;
  estimatedValue: {
    low: number;
    high: number;
    average: number;
  };
  marketTrend: 'up' | 'down' | 'stable';
  confidence: number;
  lastUpdated: Date;
  factors: {
    material: string;
    craftsmanship: string;
    rarity: string;
    condition: string;
    marketDemand: string;
  };
  comparables: Array<{
    item: string;
    soldPrice: number;
    soldDate: string;
    similarity: number;
  }>;
}

interface AppraisalResultsProps {
  data: AppraisalData;
  uploadedFiles: File[];
}

export function AppraisalResults({ data, uploadedFiles }: AppraisalResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTrendIcon = () => {
    switch (data.marketTrend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400"></div>;
    }
  };

  const getFactorScore = (factor: string) => {
    const scores = { excellent: 95, good: 80, fair: 60, poor: 30 };
    return scores[factor.toLowerCase() as keyof typeof scores] || 50;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Valuation Card */}
      <Card className="border-2 border-primary">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            Appraisal Results
          </CardTitle>
          <p className="text-muted-foreground">{data.item}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Range */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Low Estimate</p>
                <p className="text-2xl">{formatCurrency(data.estimatedValue.low)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Average Value</p>
                <p className="text-4xl text-primary">{formatCurrency(data.estimatedValue.average)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Estimate</p>
                <p className="text-2xl">{formatCurrency(data.estimatedValue.high)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Market Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className="capitalize">{data.marketTrend} market trend</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Confidence:</span>
              <Badge variant="outline">{data.confidence}%</Badge>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Updated {data.lastUpdated.toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Valuation Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Valuation Factors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(data.factors).map(([factor, rating]) => (
              <div key={factor} className="space-y-2">
                <div className="flex justify-between">
                  <span className="capitalize">{factor.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <Badge variant="outline" className="capitalize">
                    {rating}
                  </Badge>
                </div>
                <Progress value={getFactorScore(rating)} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Comparable Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Recent Comparable Sales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.comparables.map((comp, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="truncate">{comp.item}</p>
                  <p className="text-sm text-muted-foreground">{comp.soldDate}</p>
                </div>
                <div className="text-right">
                  <p>{formatCurrency(comp.soldPrice)}</p>
                  <Badge variant="secondary" className="text-xs">
                    {comp.similarity}% match
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Uploaded Files Summary */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analyzed Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl mb-2">
                    {file.type.startsWith('image/') ? '🖼️' : '📄'}
                  </div>
                  <p className="text-sm truncate">{file.name}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    ✅ Analyzed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> This is an estimated valuation based on available market data and item characteristics. 
            Actual value may vary based on current market conditions, buyer preferences, and professional inspection. 
            For insurance or sale purposes, we recommend consulting with a certified appraiser.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}