
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { Persona } from '@/types/persona';

interface RiskAssessmentProps {
  persona: Persona | null;
  isLoading: boolean;
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({ persona, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="glassmorphism border-white/20 p-6">
        <Skeleton className="h-6 w-32 mb-4 bg-white/10" />
        <div className="space-y-4">
          <Skeleton className="h-16 bg-white/10" />
          <Skeleton className="h-16 bg-white/10" />
        </div>
      </Card>
    );
  }

  if (!persona) return null;

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Low Risk', color: 'text-green-400', icon: CheckCircle };
    if (score >= 60) return { level: 'Medium Risk', color: 'text-yellow-400', icon: AlertTriangle };
    return { level: 'High Risk', color: 'text-red-400', icon: AlertTriangle };
  };

  const getHealthLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-400' };
    if (score >= 60) return { level: 'Good', color: 'text-yellow-400' };
    return { level: 'Needs Attention', color: 'text-red-400' };
  };

  const riskInfo = getRiskLevel(persona.riskScore);
  const healthInfo = getHealthLevel(persona.healthScore);
  const RiskIcon = riskInfo.icon;

  return (
    <Card className="glassmorphism border-white/20 glow-blue">
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Risk Assessment
        </h3>

        {/* Risk Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Risk Score</span>
            <div className="flex items-center space-x-2">
              <RiskIcon className={`w-4 h-4 ${riskInfo.color}`} />
              <span className={`text-sm font-medium ${riskInfo.color}`}>
                {riskInfo.level}
              </span>
            </div>
          </div>
          <Progress value={persona.riskScore} className="h-3 bg-white/10" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>High Risk</span>
            <span className="text-white font-medium">{persona.riskScore}/100</span>
            <span>Low Risk</span>
          </div>
        </div>

        {/* Health Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Wallet Health</span>
            <span className={`text-sm font-medium ${healthInfo.color}`}>
              {healthInfo.level}
            </span>
          </div>
          <Progress value={persona.healthScore} className="h-3 bg-white/10" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Poor</span>
            <span className="text-white font-medium">{persona.healthScore}/100</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Risk Factors</h4>
          
          <RiskFactor
            label="Transaction Patterns"
            status={persona.riskScore > 70 ? 'good' : 'warning'}
            description="Regular, consistent activity"
          />
          
          <RiskFactor
            label="Protocol Diversity"
            status={persona.stats.uniqueProtocols > 10 ? 'good' : 'neutral'}
            description={`Interacts with ${persona.stats.uniqueProtocols} protocols`}
          />
          
          <RiskFactor
            label="Gas Management"
            status={persona.stats.averageGasSpent < 50 ? 'good' : 'warning'}
            description="Efficient gas usage patterns"
          />
        </div>

        {/* Recommendations */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <h4 className="text-sm font-medium text-white mb-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Improvement Tips
          </h4>
          <ul className="text-xs text-gray-300 space-y-1">
            {persona.riskScore < 70 && (
              <li>• Consider diversifying across more protocols</li>
            )}
            {persona.healthScore < 80 && (
              <li>• Maintain more consistent transaction patterns</li>
            )}
            <li>• Monitor gas fees for optimal transaction timing</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

const RiskFactor = ({ 
  label, 
  status, 
  description 
}: { 
  label: string; 
  status: 'good' | 'warning' | 'neutral'; 
  description: string; 
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      good: 'text-green-400',
      warning: 'text-yellow-400',
      neutral: 'text-gray-400'
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      good: '✓',
      warning: '⚠',
      neutral: '○'
    };
    return icons[status as keyof typeof icons];
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm text-white">{label}</div>
        <div className="text-xs text-gray-400">{description}</div>
      </div>
      <span className={`text-sm ${getStatusColor(status)}`}>
        {getStatusIcon(status)}
      </span>
    </div>
  );
};

export default RiskAssessment;
