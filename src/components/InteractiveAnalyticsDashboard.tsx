
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp, Activity, Coins, Palette, Users, Zap, Target, Shield, Eye, BarChart3 } from 'lucide-react';
import { Persona } from '@/types/persona';

interface InteractiveAnalyticsDashboardProps {
  persona: Persona | null;
  isLoading: boolean;
}

const InteractiveAnalyticsDashboard: React.FC<InteractiveAnalyticsDashboardProps> = ({ persona, isLoading }) => {
  const [activeView, setActiveView] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('volume');

  if (!persona) return null;

  // Generate comprehensive data for visualizations
  const portfolioComposition = [
    { name: 'DeFi Assets', value: persona.stats.defiInteractions * 1000, color: '#8b5cf6' },
    { name: 'NFTs', value: persona.stats.nftCollections * 500, color: '#ec4899' },
    { name: 'Native Token', value: persona.stats.totalVolume * 0.3, color: '#06b6d4' },
    { name: 'Other Tokens', value: persona.stats.totalVolume * 0.2, color: '#10b981' }
  ];

  const riskMetrics = [
    { metric: 'Liquidity Risk', score: Math.max(0, 100 - persona.riskScore), benchmark: 75 },
    { metric: 'Concentration Risk', score: Math.min(100, persona.stats.uniqueProtocols * 5), benchmark: 60 },
    { metric: 'Protocol Risk', score: persona.healthScore, benchmark: 80 },
    { metric: 'Market Risk', score: Math.max(0, 100 - (persona.riskScore * 0.8)), benchmark: 70 }
  ];

  const activityTimeline = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' }),
    transactions: Math.floor(Math.random() * 50) + 10,
    volume: Math.floor(Math.random() * 10000) + 1000,
    defi: Math.floor(Math.random() * 20) + 5,
    nft: Math.floor(Math.random() * 15) + 2
  }));

  const performanceRadar = [
    { metric: 'Activity', score: Math.min(100, persona.stats.totalTransactions / 10) },
    { metric: 'Diversity', score: Math.min(100, persona.stats.uniqueProtocols * 10) },
    { metric: 'DeFi Engagement', score: Math.min(100, persona.stats.defiInteractions * 5) },
    { metric: 'NFT Holdings', score: Math.min(100, persona.stats.nftCollections * 10) },
    { metric: 'Health', score: persona.healthScore },
    { metric: 'Risk Management', score: 100 - persona.riskScore }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Key Metrics */}
      <Card className="glassmorphism border-white/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <BarChart3 className="w-6 h-6 mr-2" />
              Advanced Analytics Dashboard
            </h2>
            <div className="flex space-x-2">
              {['overview', 'performance', 'risk', 'activity'].map((view) => (
                <Button
                  key={view}
                  variant={activeView === view ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveView(view)}
                  className={activeView === view ? 'bg-purple-600 text-white' : 'border-white/20 text-gray-300 hover:bg-white/10'}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <KPICard
              title="Total Value"
              value={`$${(persona.stats.totalVolume / 1000000).toFixed(1)}M`}
              change="+12.5%"
              positive={true}
              icon={<Coins className="w-5 h-5" />}
            />
            <KPICard
              title="Health Score"
              value={`${persona.healthScore}/100`}
              change="+5.2%"
              positive={true}
              icon={<Shield className="w-5 h-5" />}
            />
            <KPICard
              title="Risk Level"
              value={persona.riskScore < 30 ? 'Low' : persona.riskScore < 70 ? 'Medium' : 'High'}
              change="-2.1%"
              positive={true}
              icon={<Target className="w-5 h-5" />}
            />
            <KPICard
              title="Protocols"
              value={persona.stats.uniqueProtocols.toString()}
              change="+1"
              positive={true}
              icon={<Users className="w-5 h-5" />}
            />
            <KPICard
              title="Activity"
              value={persona.stats.totalTransactions > 100 ? 'High' : 'Medium'}
              change="+8.3%"
              positive={true}
              icon={<Activity className="w-5 h-5" />}
            />
          </div>
        </div>
      </Card>

      {/* Main Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Chart */}
        <div className="lg:col-span-2">
          <Card className="glassmorphism border-white/20">
            <div className="p-6">
              <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
                <TabsList className="grid w-full grid-cols-4 bg-white/10">
                  <TabsTrigger value="overview" className="text-white">Portfolio</TabsTrigger>
                  <TabsTrigger value="performance" className="text-white">Performance</TabsTrigger>
                  <TabsTrigger value="risk" className="text-white">Risk Analysis</TabsTrigger>
                  <TabsTrigger value="activity" className="text-white">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="h-80">
                  <h3 className="text-lg font-semibold text-white mb-4">Portfolio Composition</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolioComposition}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={50}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {portfolioComposition.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`$${(value / 1000).toFixed(1)}K`, 'Value']} />
                    </PieChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="performance" className="h-80">
                  <h3 className="text-lg font-semibold text-white mb-4">Performance Radar</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={performanceRadar}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                      <Radar
                        name="Performance"
                        dataKey="score"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="risk" className="h-80">
                  <h3 className="text-lg font-semibold text-white mb-4">Risk Metrics vs Benchmark</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskMetrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="metric" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="benchmark" fill="#6b7280" radius={[4, 4, 0, 0]} opacity={0.6} />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="activity" className="h-80">
                  <h3 className="text-lg font-semibold text-white mb-4">Activity Timeline</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityTimeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="transactions" stroke="#8b5cf6" strokeWidth={2} />
                      <Line type="monotone" dataKey="defi" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="nft" stroke="#ec4899" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>

        {/* Right Column - Stats and Insights */}
        <div className="space-y-6">
          {/* Wallet Score Card */}
          <Card className="glassmorphism border-white/20">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Wallet Scores</h3>
              <div className="space-y-4">
                <ScoreItem label="Health Score" score={persona.healthScore} color="green" />
                <ScoreItem label="Risk Score" score={persona.riskScore} color="red" />
                <ScoreItem label="Activity Level" score={Math.min(100, persona.stats.totalTransactions / 10)} color="blue" />
                <ScoreItem label="Diversification" score={Math.min(100, persona.stats.uniqueProtocols * 5)} color="purple" />
              </div>
            </div>
          </Card>

          {/* Top Insights */}
          <Card className="glassmorphism border-white/20">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Key Insights</h3>
              <div className="space-y-3">
                <InsightItem
                  icon={<TrendingUp className="w-4 h-4" />}
                  text={`${persona.category.primary} with ${persona.category.confidence}% confidence`}
                  type="positive"
                />
                <InsightItem
                  icon={<Activity className="w-4 h-4" />}
                  text={`${persona.stats.totalTransactions} total transactions across ${persona.stats.uniqueProtocols} protocols`}
                  type="neutral"
                />
                <InsightItem
                  icon={<Shield className="w-4 h-4" />}
                  text={`${persona.healthScore > 70 ? 'Healthy' : 'Moderate'} portfolio with ${persona.riskScore < 50 ? 'low' : 'moderate'} risk`}
                  type={persona.healthScore > 70 ? "positive" : "warning"}
                />
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="glassmorphism border-white/20">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button className="w-full bg-purple-600 hover:bg-purple-700" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Detailed Report
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10" size="sm">
                  Export Analysis
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10" size="sm">
                  Compare Wallets
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, change, positive, icon }: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}) => (
  <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
    <div className="flex items-center justify-between mb-2">
      <div className="text-purple-400">{icon}</div>
      <Badge className={`text-xs ${positive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
        {change}
      </Badge>
    </div>
    <div className="text-xl font-bold text-white">{value}</div>
    <div className="text-xs text-gray-400">{title}</div>
  </div>
);

const ScoreItem = ({ label, score, color }: { label: string; score: number; color: string }) => {
  const colorClasses = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">{label}</span>
        <span className="text-white font-medium">{score}/100</span>
      </div>
      <Progress value={score} className="h-2 bg-white/10" />
    </div>
  );
};

const InsightItem = ({ icon, text, type }: { icon: React.ReactNode; text: string; type: 'positive' | 'warning' | 'neutral' }) => {
  const typeColors = {
    positive: 'text-green-400',
    warning: 'text-yellow-400',
    neutral: 'text-gray-400'
  };

  return (
    <div className="flex items-start space-x-2">
      <div className={`mt-0.5 ${typeColors[type]}`}>{icon}</div>
      <span className="text-sm text-gray-300">{text}</span>
    </div>
  );
};

export default InteractiveAnalyticsDashboard;
